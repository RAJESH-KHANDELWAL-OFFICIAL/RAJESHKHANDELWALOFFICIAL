from __future__ import annotations

import requests

from flask import Flask, Response, jsonify

app = Flask(__name__)

# ============================================================
# SUPREMESETUHUB CENTRAL SOURCE
# ============================================================

SUPREME_API_URL = (
    "https://supremesetuhub-3v4e.onrender.com"
)

SUPREME_FRONTEND_URL = (
    SUPREME_API_URL
    + "/api/v1/frontend/supreme"
)

SUPREME_CSS_URL = (
    SUPREME_API_URL
    + "/api/v1/frontend/supreme/style.css"
)


# ============================================================
# CORS
# ============================================================

@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type,Authorization"
    )
    response.headers["Access-Control-Allow-Methods"] = (
        "GET,PUT,POST,DELETE,OPTIONS"
    )
    return response


# ============================================================
# CENTRAL SUPREME FRONTEND
# ============================================================

@app.get("/")
def root():
    try:
        response = requests.get(
            SUPREME_FRONTEND_URL,
            timeout=30,
        )

        return Response(
            response.content,
            status=response.status_code,
            content_type=response.headers.get(
                "Content-Type",
                "text/html; charset=utf-8",
            ),
        )

    except requests.RequestException as exc:
        return jsonify({
            "success": False,
            "error": "SUPREME_FRONTEND_UNAVAILABLE",
            "message": str(exc),
            "upstream": SUPREME_FRONTEND_URL,
        }), 502


# ============================================================
# CENTRAL SUPREME CSS
# ============================================================

@app.get("/style.css")
def style_css():
    try:
        response = requests.get(
            SUPREME_CSS_URL,
            timeout=30,
        )

        return Response(
            response.content,
            status=response.status_code,
            content_type=response.headers.get(
                "Content-Type",
                "text/css; charset=utf-8",
            ),
        )

    except requests.RequestException as exc:
        return jsonify({
            "success": False,
            "error": "SUPREME_CSS_UNAVAILABLE",
            "message": str(exc),
            "upstream": SUPREME_CSS_URL,
        }), 502


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return jsonify({
        "service": "RAJESHKHANDELWALOFFICIAL",
        "status": "healthy",
        "frontend_source": SUPREME_FRONTEND_URL,
        "css_source": SUPREME_CSS_URL,
        "architecture": "GLOBAL BUSINESS ECOSYSTEM",
    }), 200


# ============================================================
# SUPREME BRIDGE STATUS
# ============================================================

@app.get("/supreme/bridge/status")
def supreme_bridge_status():
    try:
        response = requests.get(
            SUPREME_API_URL + "/health",
            timeout=15,
        )

        try:
            payload = response.json()
        except ValueError:
            payload = {
                "raw": response.text
            }

        return jsonify({
            "success": response.ok,
            "repository": "RAJESHKHANDELWALOFFICIAL",
            "supreme": payload,
            "status_code": response.status_code,
        }), response.status_code

    except requests.RequestException as exc:
        return jsonify({
            "success": False,
            "repository": "RAJESHKHANDELWALOFFICIAL",
            "error": str(exc),
            "upstream": SUPREME_API_URL,
        }), 502


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": "NOT_FOUND",
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "error": "INTERNAL_SERVER_ERROR",
    }), 500


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
    )
