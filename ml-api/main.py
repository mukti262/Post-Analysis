from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# Update to match Vercel domain
origins = [
    "https://post-analysis-beta.vercel.app",  # your deployed frontend
    "http://localhost:3000",                  # for local development
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sentiment model loading
model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

class TextData(BaseModel):
    text: str

# POST endpoint for sentiment analysis
@app.post("/analyze")
async def analyze_sentiment(data: TextData):
    inputs = tokenizer(data.text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(scores).item() + 1  # Sentiment score: 1–5

    return {
        "sentiment_score": predicted_class,
        "meaning": {
            1: "Very Negative",
            2: "Negative",
            3: "Neutral",
            4: "Positive",
            5: "Very Positive"
        }[predicted_class]
    }