from PIL import Image
import pytesseract
from app.services.cccd_parser import parse_cccd

def scan_cccd(image_path: str):
    img = Image.open(image_path).convert("L")
    img = img.resize((2000, int(2000 * img.height / img.width)))
    text = pytesseract.image_to_string(img, lang="vie")
    return parse_cccd(text)
