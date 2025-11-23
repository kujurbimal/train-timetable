from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Train Timetable API is running"}
