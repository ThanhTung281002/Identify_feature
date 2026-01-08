from fastapi import APIRouter, UploadFile, File
from app.services.ocr_service import scan_cccd
from pathlib import Path
import shutil

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/ocr/cccd/local")
async def ocr_local(image: UploadFile = File(...)):
    path = UPLOAD_DIR / image.filename

    with path.open("wb") as f:
        shutil.copyfileobj(image.file, f)

    try:
        data = scan_cccd(str(path))
        return {"success": True, "data": data}
    finally:
        path.unlink(missing_ok=True)
