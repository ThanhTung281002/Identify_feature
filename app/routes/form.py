from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.db import forms
from app.models import build_form
from pathlib import Path
import shutil, time

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def save(file: UploadFile, name: str):
    ext = Path(file.filename).suffix
    path = UPLOAD_DIR / f"{int(time.time()*1000)}-{name}{ext}"
    with path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return str(path)

@router.post("/submit")
async def submit(
    personal_fullName: str = Form(...),
    personal_phone: str = Form(...),
    personal_address: str = Form(...),

    cccd_fullName: Optional[str] = Form(None),
    cccd_number: Optional[str] = Form(None),
    cccd_address: Optional[str] = Form(None),

    cccd_frontImage: UploadFile = File(None),
    cccd_backImage: UploadFile = File(None),
    signature_image: UploadFile = File(None)
):
    data = {
        "personal.fullName": personal_fullName,
        "personal.phone": personal_phone,
        "personal.address": personal_address,
        "cccd.fullName": cccd_fullName,
        "cccd.number": cccd_number,
        "cccd.address": cccd_address,
    }

    if cccd_frontImage:
        data["cccd.frontImage"] = save(cccd_frontImage, "cccd.frontImage")
    if cccd_backImage:
        data["cccd.backImage"] = save(cccd_backImage, "cccd.backImage")
    if signature_image:
        data["signature.image"] = save(signature_image, "signature.image")

    await forms.insert_one(build_form(data))

    return {"success": True, "message": "Lưu thành công"}

@router.get("/forms")
async def get_all():
    return await forms.find().to_list(1000)
