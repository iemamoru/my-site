from flask import Flask, render_template, redirect, abort, request, jsonify, session, make_response
from pymongo import MongoClient
import geoip2.database
import datetime
import hashlib
import os
from dotenv import load_dotenv
import re  
import uuid
from html import escape
from werkzeug.utils import secure_filename
import random
import string
from datetime import timedelta
import secrets
from PIL import Image
import io

load_dotenv()

app = Flask(__name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client.open_chat
messages = db.messages

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

CDN_BASE_URL = "https://cdn.9u9.jp"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  
ALLOWED_IP = os.getenv("ALLOWD_IP")
CSRF_API_ENDPOINT = f"/realfightchangairukarakosobokuhatsukematsugewokaerunokamoshirenai/e0jwpe3rh9eehr30wp"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.secret_key = os.getenv("SECRET_KEY", secrets.token_hex(64))
app.permanent_session_lifetime = timedelta(days=7) 

allowed_pages = {
    "home": True,
    "api": True,
    "tools": False,
    "request-limits": False,
    "error-handling": False,
    "agora": False,
    "database": False,
    "open-chat": True, 
    "rinapen": False,
}

def generate_user_id():
    """Generate a random 7-character user ID."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=7))

def sanitize_input(input_text):
    return re.sub(r'[<>]', '', input_text)

def scan_file_for_viruses(file_path):
    """Scan file for viruses using ClamAV."""
    try:
        clam = clamav.ClamdUnixSocket()
        scan_result = clam.scan(file_path)
        if scan_result[file_path][0] != "OK":
            return False
    except Exception as e:
        print(f"Virus scanning error: {e}")
        return False
    return True

def get_user_language(ip):
    try:
        with geoip2.database.Reader(geoip_db_path) as reader:
            response = reader.city(ip)
            country = response.country.iso_code

            return 'ja' if country == 'JP' else 'en'
    except Exception as e:
        print(f"GeoIP error: {e}")
        return 'ja'  # Default to English

@app.route('/')
def index():
    if request.headers.getlist("X-Forwarded-For"):
        user_ip = request.headers.getlist("X-Forwarded-For")[0]
    else:
        user_ip = request.remote_addr
    user_language = get_user_language(user_ip)
    return redirect(f'/{user_language}/home')

def is_page_allowed(page):
    return allowed_pages.get(page, False)

@app.route('/<lang>/<page>')
def render_page(lang, page):
    if lang not in ['en', 'ja']:
        return redirect('/')
    if not is_page_allowed(page):
        return render_template(f'{lang}/coming_soon.html'), 200
    return render_template(f'{lang}/{page}.html')

@app.route('/<lang>/home')
def home(lang):
    if lang not in ['en', 'ja']:
        return redirect('/')
    return render_template(f'{lang}/home.html')

@app.route('/<lang>/api')
def api_overview(lang):
    if lang not in ['en', 'ja']:
        return redirect('/')
    return render_template(f'{lang}/api.html')


rate_limit_cache = {}

def is_rate_limited(ip):
    now = datetime.datetime.now()
    if ip in rate_limit_cache:
        if (now - rate_limit_cache[ip]).seconds < 5: 
            return True
    rate_limit_cache[ip] = now
    return False

@app.route('/<lang>/open-chat', methods=['GET'])
def open_chat(lang):
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    # if client_ip != ALLOWED_IP:
    #     return jsonify({"error": "Access forbidden: Unauthorized IP address"}), 403
    if lang not in ['en', 'ja']:
        return redirect('/')
    if lang != "ja":
        return redirect('/')


    return render_template(f'{lang}/open_chat.html')
    

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/open-chat/posts', methods=['GET'])
def redirect_to_latest_page():
    try:
        total_messages = messages.count_documents({})
        limit = 60
        total_pages = (total_messages + limit - 1) // limit

        return redirect(f'/api/open-chat/posts/timeline?page={total_pages}', code=302)
    except Exception as e:
        return jsonify({
            "result": "Internal Server Error",
            "message": "Failed to redirect to the latest page.",
            "error_content": str(e)
        }), 500

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

@app.route('/open-chat/posts/new', methods=['POST'])
def post_message():
    """
    新しい投稿を保存する。
    """
    csrf_token = request.headers.get("X-CSRF-Token")
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

@app.route('/open-chat/posts/<int:post_id>', methods=['GET'])
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

@app.route('/open-chat/posts/timeline', methods=['GET'])
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


@app.route('/open-chat/posts/timeline/search', methods=['GET'])
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

@app.before_request
def ensure_csrf_token():
    """Ensure that a CSRF token exists in the session."""
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(64)  # 128文字の難読化されたトークン


@app.route(CSRF_API_ENDPOINT, methods=['GET'])
def get_csrf_token():
    """Provide the CSRF token."""
    csrf_token = session.get("csrf_token")
    return jsonify({"naniittendaomaeha_orehananiitterukawakaranaidegowasu": csrf_token}), 200

@app.before_request
def set_csrf_token():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(32)


# @app.route('/<lang>/open-chat/reply/<message_id>', methods=['POST'])
# def reply_to_message(lang, message_id):
#     data = request.json
#     reply_content = sanitize_input(data.get("content", ""))
#     if not reply_content:
#         return jsonify({"error": "Reply content cannot be empty."}), 400

#     reply = {
#         "content": reply_content,
#         "timestamp": datetime.datetime.now()
#     }
#     result = messages.update_one({"_id": message_id}, {"$push": {"replies": reply}})
#     if result.modified_count:
#         return jsonify({"message": "Reply added successfully."}), 200
#     return jsonify({"error": "Message not found."}), 404

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

if __name__ == '__main__':
    app.run()
