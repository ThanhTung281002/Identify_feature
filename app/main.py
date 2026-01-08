from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.form import router as form_router
from app.routes.ocr import router as ocr_router

app = FastAPI()

# ================= STATIC (GIỐNG EXPRESS) =================
# public/index.html sẽ được serve ở "/"
# css/js/image trong public/ sẽ load đúng path cũ
app.mount("/", StaticFiles(directory="public", html=True), name="public")

# uploads giống express
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ================= API ROUTES =================
app.include_router(form_router)
app.include_router(ocr_router)
