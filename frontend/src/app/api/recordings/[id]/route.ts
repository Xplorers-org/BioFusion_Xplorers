import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbPath = path.join(process.cwd(), "data", "recordings.json");

    if (!existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    const data = await readFile(dbPath, "utf-8");
    const recordings = JSON.parse(data);

    const recording = recordings.find((rec: any) => rec.id === id);

    if (!recording) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recording);
  } catch (error) {
    console.error("Fetch recording error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recording" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbPath = path.join(process.cwd(), "data", "recordings.json");

    if (!existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    const data = await readFile(dbPath, "utf-8");
    const recordings = JSON.parse(data);

    const recordingIndex = recordings.findIndex((rec: any) => rec.id === id);

    if (recordingIndex === -1) {
      return NextResponse.json(
        { error: "Recording not found" },
        { status: 404 }
      );
    }

    const recording = recordings[recordingIndex];

    // Delete the audio file
    const { unlink } = await import("fs/promises");
    const filePath = path.join(process.cwd(), "public", recording.fileUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Remove from array
    recordings.splice(recordingIndex, 1);

    // Save updated recordings
    const { writeFile } = await import("fs/promises");
    await writeFile(dbPath, JSON.stringify(recordings, null, 2));

    return NextResponse.json({ message: "Recording deleted successfully" });
  } catch (error) {
    console.error("Delete recording error:", error);
    return NextResponse.json(
      { error: "Failed to delete recording" },
      { status: 500 }
    );
  }
}
