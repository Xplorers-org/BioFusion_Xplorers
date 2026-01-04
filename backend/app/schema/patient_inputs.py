from pydantic import BaseModel, Field
from typing import Optional

class Patient(BaseModel):
    id: Optional[int] = None
    name: str 

class BasicInfo(BaseModel):
    age: int = Field(..., gt=10, lt=120)   
    sex: str = Field(..., example="Male")
    test_time: float

class voiceInput(BaseModel):
    jitter_percent: float
    jitter_abs: float
    jitter_rap: float
    jitter_ppq5: float
    jitter_ddp: float
    shimmer: float
    shimmer_db: float
    shimmer_apq3: float
    shimmer_apq5: float
    shimmer_apq11: float
    shimmer_dda: float
    nhr: float
    hnr: float
    rpde: float
    dfa: float
    ppe: float

class PatientInput(BaseModel):
    basic_info: BasicInfo
    voice_input: voiceInput
    # has_parkinson: Optional[bool] = None 