def build_form(data: dict):
    return {
        "personal": {
            "fullName": data["personal.fullName"],
            "phone": data["personal.phone"],
            "address1": data["personal.address"]
        },
        "cccd": {
            "fullName": data.get("cccd.fullName"),
            "number": data.get("cccd.number"),
            "address2": data.get("cccd.address"),
            "frontImage": data.get("cccd.frontImage"),
            "backImage": data.get("cccd.backImage")
        },
        "signature": {
            "image": data.get("signature.image")
        }
    }
