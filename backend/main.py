from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "API is running"}

origins = [
    "https://conceptclassesjhs.vercel.app",
]

# Allow all for dev; restrict origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATA_DIR = Path(__file__).parent / "data"


@app.get("/subjects")
async def get_subjects():
    subjects = [f.stem for f in DATA_DIR.glob("*.json")]
    return subjects


def load_subject(subject: str):
    fp = DATA_DIR / f"{subject}.json"
    if not fp.exists():
        raise HTTPException(status_code=404, detail="subject not found")
    data = json.loads(fp.read_text(encoding="utf-8"))
    return data['root'][0]['name']




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