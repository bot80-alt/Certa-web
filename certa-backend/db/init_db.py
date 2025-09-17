from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config
from datetime import datetime, timezone
from passlib.context import CryptContext
import time
from bson import ObjectId
import tracemalloc
import os
import dotenv

dotenv.load_dotenv()

tracemalloc.start()

MONGO_URL = os.getenv("MONGO_URL")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Database:
    client: AsyncIOMotorClient = None
    user_collection = None

    @classmethod
    async def connect_db(cls):
        try:
            cls.client = AsyncIOMotorClient(MONGO_URL)
            cls.user_collection = cls.client.nexus.users
            await cls.user_collection.create_index("email", unique=True)
            await cls.user_collection.create_index("username", unique=True)
            print("Database connected successfully")
        except Exception as e:
            print(f"Failed to connect to database: {e}")
            raise

    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("Database connection closed")

    @classmethod
    async def save_user(cls, user_data: dict):
        if cls.user_collection is None:
            raise RuntimeError("Database not connected")
        user_data["password"] = pwd_context.hash(user_data["password"])
        user_data["created_at"] = datetime.now(timezone.utc)
        await cls.user_collection.insert_one(user_data)

    @classmethod
    async def get_user(cls, email: str):
        if cls.user_collection is None:
            raise RuntimeError("Database not connected")
        return await cls.user_collection.find_one({"email": email})
    
    @classmethod
    async def get_user_by_username(cls, username: str):
        if cls.user_collection is None:
            raise RuntimeError("Database not connected")
        return await cls.user_collection.find_one({"username": username})


    @classmethod
    def verify_password(cls, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)
