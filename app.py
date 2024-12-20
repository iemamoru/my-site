import os
import datetime
import secrets
import random
import string
import re
import uuid

from flask import Flask, render_template, redirect, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import requests
from jinja2 import TemplateNotFound

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", secrets.token_hex(64))
app.permanent_session_lifetime = datetime.timedelta(days=7)


mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.open_chat
messages = db.messages
users = db.users

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
IPINFO_API_TOKEN = os.getenv("IPINFO_API_TOKEN")
DEBUGMODE = os.getenv('DEBUGMODE')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

CSRF_API_ENDPOINT = "/realfightchangairukarakosobokuhatsukematsugewokaerunokamoshirenai/e0jwpe3rh9eehr30wp"
CDN_BASE_URL = ""
ALLOWED_EXTENSIONS = ""

 
def get_user_language(ip):
    try:
        response = requests.get(f"https://ipinfo.io/{ip}?token={IPINFO_API_TOKEN}")
        if response.status_code == 200:
            data = response.json()
            country = data.get("country", "US") 
            return "ja" if country == "JP" else "en"
        else:
            print(f"IP info API error: {response.status_code}")
            return "ja"
    except Exception as e:
        print(f"Error fetching IP info: {e}")
        return "ja"  
    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(image_file):
    """
    画像を保存し、CDN形式のURLを返す。
    """
    now = datetime.datetime.now()
    year = now.strftime("%Y")
    month = now.strftime("%m")
    day = now.strftime("%d")

    # ファイル名の安全性を確保
    filename = secure_filename(image_file.filename[:100])  # ファイル名の長さを制限

    # 保存先パスを構築
    save_path = os.path.join(UPLOAD_FOLDER, year, month, day)
    try:
        os.makedirs(save_path, exist_ok=True)
        print(f"Directory created or exists: {save_path}")
    except Exception as e:
        print(f"Failed to create directory {save_path}: {e}")
        raise

    # 画像を保存
    image_path = os.path.join(save_path, filename)
    try:
        image_file.save(image_path)
        print(f"Image saved successfully at {image_path}")
    except Exception as e:
        print(f"Failed to save image at {image_path}: {e}")
        raise

    # CDN URLを生成
    cdn_url = f"{CDN_BASE_URL}/uploads/{year}/{month}/{day}/{filename}"
    return cdn_url

def sanitize_input(input_text):
    return re.sub(r'[<>]', '', input_text)

def generate_user_id():
    """Generate a random 7-character user ID."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=7))

@app.route('/oc/api/v1/posts', methods=['GET'])
def redirect_to_latest_page():
    try:
        total_messages = messages.count_documents({})
        limit = 60
        total_pages = (total_messages + limit - 1) // limit

        return redirect(f'/r/v1/posts/timeline?page={total_pages}', code=302)
    except Exception as e:
        return jsonify({
            "result": "Internal Server Error",
            "message": "Failed to redirect to the latest page.",
            "error_content": str(e)
        }), 500

@app.route('/oc/api/v1/posts/new', methods=['POST'])
def post_message():
    csrf_token = request.headers.get("X-CSRF-Token")
    print(f"Received CSRF token: {csrf_token}")
    print(f"Session CSRF token: {session.get('csrf_token')}")

    if not csrf_token or csrf_token != session.get("csrf_token"):
        return jsonify({"result": "error", "message": "Invalid or missing CSRF token"}), 403

    if 'content' not in request.form and 'image' not in request.files:
        return jsonify({"result": "error", "message": "Message content or image is required."}), 400

    # 投稿内容の取得とサニタイズ
    content = sanitize_input(request.form.get("content", "").strip())
    use_id = request.form.get("use_id") == "true"

    # ユーザーIDの取得
    user_id = None
    if use_id:
        user_ip = request.headers.getlist("X-Forwarded-For")[0] if request.headers.getlist("X-Forwarded-For") else request.remote_addr
        session_id = request.cookies.get("session", str(uuid.uuid4()))
        user_record = db.users.find_one({"ip": user_ip, "session_id": session_id})
        if not user_record:
            user_id = generate_user_id()
            db.users.insert_one({"ip": user_ip, "session_id": session_id, "user_id": user_id})
        else:
            user_id = user_record["user_id"]

    # 画像処理
    image_file = request.files.get('image')
    image_url = None
    if image_file:
        if not allowed_file(image_file.filename):
            return jsonify({"result": "error", "message": "Unsupported file format."}), 400
        
        try:
            # CDN URLを生成
            image_url = save_image(image_file)
        except Exception as e:
            return jsonify({"result": "error", "message": f"Image processing failed: {str(e)}"}), 400

    if not content and not image_url:
        return jsonify({"result": "error", "message": "Message content or image is required."}), 400

    # DBに投稿を保存
    post_id = messages.count_documents({}) + 1
    now_jst = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
    message = {
        "post_id": post_id,
        "content": content,
        "user_id": user_id if use_id else None,
        "timestamp": now_jst.isoformat(),
        "image_url": image_url,
    }
    messages.insert_one(message)

    return jsonify({
        "result": "success",
        "post": {
            "id": post_id,
            "content": content,
            "user_id": user_id,
            "image_url": image_url,
            "timestamp": now_jst.isoformat(),
        }
    }), 200

@app.route('/oc/api/v1/posts/<int:post_id>', methods=['GET'])
def get_message(post_id):
    try:
        post = messages.find_one({"post_id": post_id}, {"_id": 0})
        
        if not post:
            return jsonify({
                "result": "error",
                "message": "post not found.",
                "error_code": -1
            }), 404

        return jsonify({
            "result": "success",
            "post": {
                "id": post.get("post_id"),
                "content": post.get("content"),
                "color": post.get("text_color"),
                "size": post.get("text_size"),
                "image_url": post.get("image_url"), 
                "timestamp": post.get("timestamp")
            }
        }), 200

    except Exception as e:
        return jsonify({
            "result": "Internal Server Error",
            "message": "Failed to fetch post.",
            "error_content": str(e) 
        }), 500

@app.route('/oc/api/v1/posts/timeline', methods=['GET'])
def get_messages():
    try:
        total_messages = messages.count_documents({})
        limit = 30  # 1ページあたりの投稿数
        total_pages = (total_messages + limit - 1) // limit

        page = int(request.args.get('page', total_pages))
        if page < 1 or page > total_pages: 
            return jsonify({
                "result": "error",
                "message": "Invalid page number.",
                "error_code": -1
            }), 400

        skip = (page - 1) * limit
        paginated_posts = list(
            messages.find({}, {"_id": 0})
            .sort("post_id", 1)
            .skip(skip)
            .limit(limit)
        )

        return jsonify({
            "result": "success",
            "posts": paginated_posts,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_messages": total_messages
            }
        }), 200
    except Exception as e:
        return jsonify({
            "result": "Internal Server Error",
            "message": "Failed to fetch timeline.",
            "error_content": str(e)
        }), 500

@app.route('/oc/api/v1/posts/timeline/search', methods=['GET'])
def search_posts():
    try:
        keyword = request.args.get('keyword', '').strip()
        if not keyword:
            return jsonify({
                "result": "error",
                "message": "検索クエリが必要です。",
                "error_code": -1
            }), 400

        search_results = list(
            messages.find(
                {
                    "$or": [
                        {"content": {"$regex": keyword, "$options": "i"}},
                        {"quoted_content": {"$regex": keyword, "$options": "i"}}
                    ]
                },
                {"_id": 0}
            ).sort("post_id",  1)
        )

        total_hits = len(search_results)

        return jsonify({
            "result": "success",
            "posts": search_results,
            "search_info": {
                "total_hits": total_hits,
                "keyword": keyword
            }
        }), 200
    except Exception as e:
        return jsonify({
            "result": "Internal Server Error",
            "message": "検索処理中にエラーが発生しました。",
            "error_content": str(e)
        }), 500

@app.route(CSRF_API_ENDPOINT, methods=['GET'])
def get_csrf_token():
    """Provide the CSRF token."""
    csrf_token = session.get("csrf_token")
    return jsonify({"naniittendaomaeha_orehananiitterukawakaranaidegowasu": csrf_token}), 200

@app.before_request
def ensure_csrf_token():
    """Ensure that a CSRF token exists in the session."""
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(64)  

@app.before_request
def set_csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(32)

@app.before_request
def check_csrf_in_session():
    if "csrf_token" not in session:
        print("CSRF token not found in session.")
    else:
        print(f"CSRF token in session: {session['csrf_token']}")

@app.route('/', methods=['GET', 'HEAD'])
def index():
    if request.headers.getlist("X-Forwarded-For"):
        user_ip = request.headers.getlist("X-Forwarded-For")[0]
        print(f"Good IP: {user_ip}")
    else:
        user_ip = request.remote_addr
        print(f"Bad IP: {user_ip} : {request.headers}")
    
    if request.method == 'HEAD':
        return '', 200

    return redirect("/popo-square")

title = {
    'popo-square': 'ぽぽスクエア'
}

@app.route('/<page>')
def render_page(page):
    try:
        page_name = title.get(page, "")
        if page_name:
            page_name = f" | {page_name}"
        return render_template(f"{page}.html", title=f"ぽぽち2丁目{page_name}")
    except TemplateNotFound:
        return render_template("maigo.html"), 404

if __name__ == '__main__':
    if DEBUGMODE and DEBUGMODE == 'true':
        app.run(debug=True)
    else:
        app.run(host='0.0.0.0', port=5000)

