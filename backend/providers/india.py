import os


def get_trains(req):
# Demo or real depending on env
api_key = os.getenv('INDIA_API_KEY','')
if not api_key:
return {"provider":"RailwayAPI (demo)","provider_status":"demo","trains":[{"train":"12841 - Rajdhani Express","depart":"06:00","arrive":"12:30","duration":"6h 30m"},{"train":"12627 - Shatabdi Express","depart":"08:15","arrive":"11:45","duration":"3h 30m"}]}
# Insert actual API call here if you have endpoints and keys
# Example: requests.get(f"https://api.railwayapi.com/v2/between/source/{req.from_station}/dest/{req.to_station}/date/{req.date}/apikey/{api_key}")
return {"provider":"RailwayAPI","provider_status":"ok","trains":[]}
