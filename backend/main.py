import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from providers import india, germany, usa, japan, uk, australia
from stations import router as stations_router


app = FastAPI(title='World Train Timetable Backend')
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(stations_router)


class SearchRequest(BaseModel):
country: str
from_station: str
to_station: str
date: str
extras: dict = None


@app.post('/api/train/search')
async def search(req: SearchRequest):
key = req.country.strip().lower()
if 'india' in key or req.country.lower()=='in':
return india.get_trains(req)
if 'germany' in key or req.country.lower() in ('de','eu'):
return germany.get_trains(req)
if 'japan' in key or req.country.lower()=='jp':
return japan.get_trains(req)
if 'usa' in key or req.country.lower()=='us':
return usa.get_trains(req)
if 'uk' in key:
return uk.get_trains(req)
if 'australia' in key or req.country.lower()=='au':
return australia.get_trains(req)
# default demo
return {"provider":"demo","provider_status":"demo","trains":[{"train":"Demo 1","depart":"09:00","arrive":"12:00","duration":"3h"}]}


@app.get('/')
async def root():
return {'status':'ok'}
