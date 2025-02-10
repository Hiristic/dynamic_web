from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import uuid
from typing import List
from pydantic import BaseModel

app = FastAPI(
    title="Document Management API",
    description="API för hantering av PDF-dokument",
    version="1.0.0"
)

# CORS-inställningar för utveckling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's standardport
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skapa uploads-mapp om den inte finns
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Datamodell för dokument
class Document(BaseModel):
    id: str
    name: str
    path: str

# In-memory dokumentlista (ersätt med databas i produktion)
documents = []

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Endast PDF-filer är tillåtna")
    
    try:
        # Generera unikt filnamn
        file_id = str(uuid.uuid4())
        extension = os.path.splitext(file.filename)[1]
        new_filename = f"{file_id}{extension}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        # Spara filen
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Lägg till i dokumentlistan
        doc = Document(
            id=file_id,
            name=file.filename,
            path=file_path
        )
        documents.append(doc)
        
        return {"message": "Fil uppladdad framgångsrikt", "document_id": file_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def get_documents() -> List[Document]:
    return documents

@app.get("/documents/{document_id}")
async def get_document(document_id: str):
    doc = next((doc for doc in documents if doc.id == document_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Dokument hittades inte")
    
    return FileResponse(
        doc.path,
        media_type="application/pdf",
        filename=doc.name
    )

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    doc = next((doc for doc in documents if doc.id == document_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Dokument hittades inte")
    
    try:
        # Ta bort filen
        os.remove(doc.path)
        # Ta bort från listan
        documents.remove(doc)
        return {"message": "Dokument raderat"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Välkommen till Document Management API",
        "endpoints": {
            "upload": "/upload",
            "list_documents": "/documents",
            "get_document": "/documents/{document_id}",
        }
    } 