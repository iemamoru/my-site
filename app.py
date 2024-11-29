from flask import Flask, render_template, redirect, abort, request, jsonify, session, make_response
from pymongo import MongoClient
from flask_cors import CORS 
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

cors = CORS(app, resources={
    r"/*": {
        "origins": ["https://9u9.jp"],  
        "supports_credentials": True   
    }
})
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

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

if __name__ == '__main__':
    app.run()
