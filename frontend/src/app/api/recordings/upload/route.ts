import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'recordings');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Get audio duration (approximate based on file size)
    const duration = Math.round(buffer.length / (16000 * 2)); // Approximate for 16kHz, 16-bit audio

    // Create recording object
    const recording = {
      id: `rec_${timestamp}_${Math.random().toString(36).substring(7)}`,
      userId: formData.get('userId') as string || 'default-user',
      fileName: originalName,
      fileUrl: `/uploads/recordings/${fileName}`,
      fileSize: buffer.length,
      mimeType: file.type,
      duration: duration || 30,
      createdAt: new Date().toISOString(),
      status: 'completed',
      metadata: {
        patientInfo: {
          fullName: formData.get('fullName') as string || '',
          age: parseInt(formData.get('age') as string) || 0,
          gender: formData.get('gender') as 'male' | 'female' || 'male',
          testTime: parseFloat(formData.get('testTime') as string) || 0,
        }
      }
    };

    // In a real app, save to database here
    // For now, we'll store in a JSON file
    const dbPath = path.join(process.cwd(), 'data', 'recordings.json');
    const dbDir = path.dirname(dbPath);
    
    if (!existsSync(dbDir)) {
      await mkdir(dbDir, { recursive: true });
    }

    let recordings = [];
    try {
      const { readFile } = await import('fs/promises');
      const data = await readFile(dbPath, 'utf-8');
      recordings = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      recordings = [];
    }

    recordings.unshift(recording);
    await writeFile(dbPath, JSON.stringify(recordings, null, 2));

    return NextResponse.json({
      success: true,
      recording
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload recording' },
      { status: 500 }
    );
  }
}
