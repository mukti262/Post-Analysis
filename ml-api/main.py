from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set to ["http://localhost:3000"] for Next.js
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Load multilingual sentiment model
model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

class TextData(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_sentiment(data: TextData):
    inputs = tokenizer(data.text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(scores).item() + 1 

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