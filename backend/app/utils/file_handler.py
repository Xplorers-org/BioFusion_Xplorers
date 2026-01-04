import tempfile
import shutil
import os
from pydub import AudioSegment

async def save_temp_file(upload_file):
    # Get the original file extension from content type or filename
    content_type = upload_file.content_type
    filename = upload_file.filename
    
    # Determine file extension
    if 'webm' in content_type or filename.endswith('.webm'):
        original_suffix = ".webm"
    elif 'ogg' in content_type or filename.endswith('.ogg'):
        original_suffix = ".ogg"
    elif 'mp3' in content_type or filename.endswith('.mp3'):
        original_suffix = ".mp3"
    elif 'wav' in content_type or filename.endswith('.wav'):
        original_suffix = ".wav"
    else:
        original_suffix = ".wav"  # default
    
    # Save original file first
    with tempfile.NamedTemporaryFile(delete=False, suffix=original_suffix) as tmp_original:
        content = await upload_file.read()
        tmp_original.write(content)
        original_path = tmp_original.name
    
    # If already WAV, return as is
    if original_suffix == ".wav":
        return original_path
    
    # Convert to WAV using pydub
    try:
        audio = AudioSegment.from_file(original_path)
        
        # Create WAV file
        wav_path = original_path.replace(original_suffix, ".wav")
        audio.export(wav_path, format="wav")
        
        # Delete original file
        os.remove(original_path)
        
        return wav_path
    except Exception as e:
        # If conversion fails, try to use original
        print(f"Audio conversion error: {e}")
        # Cleanup
        if os.path.exists(original_path):
            os.remove(original_path)
        raise Exception(f"Failed to convert audio file: {e}")