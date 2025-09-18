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
from pydub import AudioSegment

from pydantic import BaseModel
import tempfile
import time
import logging
from fastapi import UploadFile, File
import speech_recognition as sr  # Ensure 'SpeechRecognition' is installed: pip install SpeechRecognition

class UrlInput(BaseModel):
    url: str

class TextInput(BaseModel):
    text: str

class AudioAnalysisResult(BaseModel):
    is_deepfake: bool
    confidence_score: float
    analysis: str
    processing_time: float
    transcribed_text: str | None = None
    fact_check_result: dict | None = None
    explanation: str | None = None

load_dotenv()

logger = logging.getLogger(__name__)

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

@input_router.post("/get-fc-audio")
async def get_fc_audio(file: UploadFile = File(...)):
    """
    Extract speech from audio file and run fact-check on transcription
    """
    try:
        # Validate audio file
        if not file.content_type or not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file")

        # Save uploaded file to a temp file
        suffix = os.path.splitext(file.filename or "audio")[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            audio_path = temp_file.name

        try:
            # Transcribe audio (speech_recognition internally uses audioread for mp3 etc.)
            recognizer = sr.Recognizer()
            transcribed_text = None

            try:
                with sr.AudioFile(audio_path) as source:
                    audio_data = recognizer.record(source)
                    transcribed_text = getattr(recognizer, 'recognize_google')(audio_data)  # type: ignore
            except sr.UnknownValueError:
                logger.error("Google Speech Recognition could not understand audio")
                transcribed_text = None
            except sr.RequestError as e:
                logger.error(f"Could not request results from Google Speech Recognition service; {e}")
                transcribed_text = None
            except Exception as e:
                logger.error(f"Error transcribing audio: {str(e)}")
                transcribed_text = None

            if not transcribed_text:
                return {
                    "status": "error",
                    "content": None,
                    "message": "Could not transcribe audio"
                }

            # Fact-check transcription
            groq_api_key = os.getenv("GROQ_API_KEY")
            serper_api_key = os.getenv("SERPER_API_KEY")
            if not groq_api_key or not serper_api_key:
                raise HTTPException(
                    status_code=500,
                    detail="Missing GROQ_API_KEY or SERPER_API_KEY environment variable"
                )

            fact_checker = FactChecker(groq_api_key=groq_api_key, serper_api_key=serper_api_key)
            fact_check_result = fact_checker.generate_report(transcribed_text)
            explanation = explain_factcheck_result(fact_check_result)

            return {
                "status": "success",
                "content": {
                    "transcribed_text": transcribed_text,
                    "fact_check_result": fact_check_result,
                    "explanation": explanation["explanation"]
                }
            }

        finally:
            # cleanup
            if os.path.exists(audio_path):
                try:
                    time.sleep(0.2)
                    os.remove(audio_path)
                except Exception as cleanup_err:
                    logger.warning(f"Could not delete temp file {audio_path}: {cleanup_err}")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_fc_audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
