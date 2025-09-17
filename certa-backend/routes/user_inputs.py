from .news_summ import get_news
from fastapi import Depends, APIRouter, HTTPException
from .auth import get_current_user
import os
from dotenv import load_dotenv
from fc.newsfetcher import NewsFetcher
import json
import asyncio
from fc.expAi import explain_factcheck_result, generate_visual_explanation
from fc.fact_checker import FactChecker

from pydantic import BaseModel

class UrlInput(BaseModel):
    url: str

class TextInput(BaseModel):
    text: str

load_dotenv()

input_router = APIRouter()

@input_router.post("/get-fc-url")
async def get_fc_url(input_data: UrlInput):
    try:
        print(f"Fetching news from URL: {input_data.url}")
        news_text = get_news(input_data.url)
        print(f"News fetch result: {news_text['status']}")
      
        if news_text['status'] == 'error':
            print(f"Error message: {news_text.get('message', 'Unknown error')}")
            return {
                "status": "Unable to fetch the news from the url. Please try a different link",
                "content": None
            }
        
        groq_api_key=os.getenv("GROQ_API_KEY")
        serper_api_key=os.getenv("SERPER_API_KEY")
        if not groq_api_key or not serper_api_key:
            raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY or SERPER_API_KEY environment variable")
        print(f"API keys present: GROQ={groq_api_key is not None}, SERPER={serper_api_key is not None}")
        
        fact_checker = FactChecker(groq_api_key=groq_api_key, serper_api_key=serper_api_key)
        # Run fact check - it will be run through transformation pipeline
        fact_check_result = fact_checker.generate_report(news_text['text'])
        
        explanation = explain_factcheck_result(fact_check_result)

        
        #return an object with fact check result and visualization data, and explanation
        return {
            "status": "success",
            "content": {
                "fact_check_result": fact_check_result,
                "explanation": explanation["explanation"],
            }
        }
    except Exception as e:
        print(f"Exception in get_fc_url: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
@input_router.post("/get-fc-text")
async def get_fc_text(input_data: TextInput):
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        serper_api_key = os.getenv("SERPER_API_KEY")
        if not groq_api_key or not serper_api_key:
            raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY or SERPER_API_KEY environment variable")
        
        fact_checker = FactChecker(groq_api_key=groq_api_key, serper_api_key=serper_api_key)
        # Run fact check - it will be run through transformation pipeline
        fact_check_result = fact_checker.generate_report(input_data.text)
        
        explanation = explain_factcheck_result(fact_check_result)

        
        #return an object with fact check result and visualization data, and explanation
        return {
            "status": "success",
            "content": {
                "fact_check_result": fact_check_result,
                "explanation": explanation["explanation"],
                
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))