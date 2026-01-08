import re

def extract(text, regex):
    match = re.search(regex, text, re.IGNORECASE)
    return match.group(1) if match and match.groups() else (match.group(0) if match else "")

def parse_cccd(text: str):
    text = re.sub(r"\n+", " ", text)

    return {
        "hoTen": extract(text, r"Họ tên[:\s]*(.*?)(?=Ngày sinh|Giới tính)"),
        "soCCCD": extract(text, r"\b\d{12}\b"),
        "ngaySinh": extract(text, r"Ngày sinh[:\s]*(\d{2}/\d{2}/\d{4})"),
        "gioiTinh": extract(text, r"(Nam|Nữ)"),
        "diaChi": extract(text, r"Nơi thường trú[:\s]*(.*?)(?=Có giá trị|Ngày cấp)"),
        "ngayCap": extract(text, r"Ngày cấp[:\s]*(\d{2}/\d{2}/\d{4})")
    }
