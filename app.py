from flask import Flask, render_template, redirect, abort, request
import geoip2.database

app = Flask(__name__)

# Path to the GeoLite2 database
geoip_db_path = 'GeoLite2-City.mmdb'

# List of allowed pages
allowed_pages = {
    "home": True,
    "api": True,
    "tools": False,
    "request-limits": False,
    "error-handling": False,
    "agora": False,
    "database": False,
    "open-chat": False,
    "rinapen": False,
}


# Helper function to determine language based on geolocation
def get_user_language(ip):
    try:
        with geoip2.database.Reader(geoip_db_path) as reader:
            response = reader.city(ip)
            country = response.country.iso_code
            # Return 'ja' for Japan, 'en' otherwise
            return 'ja' if country == 'JP' else 'en'
    except Exception as e:
        print(f"GeoIP error: {e}")
        return 'en'  # Default to English


# Redirect root URL to language-specific home based on location
@app.route('/')
def index():
    user_ip = request.remote_addr or '8.8.8.8'  # Default IP for testing
    user_language = get_user_language(user_ip)
    return redirect(f'/{user_language}/home')


# Helper function to check if a page is allowed
def is_page_allowed(page):
    return allowed_pages.get(page, False)


# Define dynamic routes for all pages
@app.route('/<lang>/<page>')
def render_page(lang, page):
    if lang not in ['en', 'ja']:
        return redirect('/')
    if not is_page_allowed(page):
        return render_template(f'{lang}/coming_soon.html'), 200
    return render_template(f'{lang}/{page}.html')


# Separate routes for `home` and `api` for clarity
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


# Custom 404 error handler
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    app.run()