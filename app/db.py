from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://tungdd202_db_user:vcKOLH4n7xB5FQzN@cluster0.dti9swa.mongodb.net"

client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("test")
forms = db.get_collection("forms")
