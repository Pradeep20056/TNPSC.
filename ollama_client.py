import aiohttp # type: ignore
import json
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class OllamaClient:
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = "phi"  # You can change this to your preferred model
    
    async def generate_response(self, message: str, context: str = "") -> str:
        """Generate response using Ollama API"""
        
        prompt = f"{context}\n\nUser: {message}\nAssistant:"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 500
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("response", "Sorry, I couldn't generate a response.")
                    else:
                        return "Sorry, I'm having trouble connecting to the AI service."
        except Exception as e:
            print(f"Error calling Ollama API: {e}")
            return "Sorry, I'm currently unavailable. Please try again later."
    
    async def health_check(self) -> bool:
        """Check if Ollama service is running"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags") as response:
                    return response.status == 200
        except:
            return False