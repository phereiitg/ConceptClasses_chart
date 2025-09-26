from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json


app = FastAPI()


# Allow all for dev; restrict origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATA_DIR = Path(__file__).parent / "data"




def load_subject(subject: str):
    fp = DATA_DIR / f"{subject}.json"
    if not fp.exists():
        raise HTTPException(status_code=404, detail="subject not found")
    return json.loads(fp.read_text(encoding="utf-8"))




@app.get("/tree/{subject}/root")
async def get_root(subject: str):
   data = load_subject(subject)
   return data.get("root", [])




@app.get("/tree/{subject}/children/{node_id}")
async def get_children(subject: str, node_id: int):
    data = load_subject(subject)
    nodes = data.get("nodes", {})
    # store node ids as strings in JSON for convenience
    return nodes.get(str(node_id), [])