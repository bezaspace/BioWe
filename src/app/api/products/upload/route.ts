import { NextResponse } from "next/server";
import { adminAuth, adminStorage } from "@/firebase/admin";
import { isAdmin } from "@/lib/admin";

// Helper to parse multipart/form-data
import { Readable } from "stream";
import { randomUUID } from "crypto";

// Use 'busboy' for parsing multipart form data
const Busboy = require("busboy");

export const runtime = "nodejs"; // Ensure Node.js runtime for streaming

export async function POST(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const uid = decoded.uid;
    const admin = await isAdmin(uid);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse multipart form data
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const busboy = Busboy({ headers: { "content-type": contentType } });
    const buffers: Buffer[] = [];
    let fileName = "";
    let mimeType = "";

    let resolveBusboy: (value: { buffer: Buffer; fileName: string; mimeType: string }) => void;
    const busboyPromise = new Promise<{ buffer: Buffer; fileName: string; mimeType: string }>((resolve) => {
      resolveBusboy = resolve;
    });

    busboy.on("file", (fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string) => {
      fileName = filename;
      mimeType = mimetype;
      file.on("data", (data: Buffer) => buffers.push(data));
      file.on("end", () => {
        resolveBusboy({ buffer: Buffer.concat(buffers), fileName, mimeType });
      });
    });

    // Pipe the request body to busboy
    const reqBody = request.body as any;
    if (!reqBody) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    Readable.fromWeb(reqBody).pipe(busboy);

    const { buffer, fileName: originalName, mimeType: fileMime } = await busboyPromise;

    // Ensure originalName is a string and extract extension
    let ext = "jpg";
    if (typeof originalName === "string" && originalName.includes(".")) {
      ext = originalName.split(".").pop() || "jpg";
    }
    const storageFileName = `products/${randomUUID()}.${ext}`;

    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(storageFileName);
    await file.save(buffer, {
      metadata: { contentType: fileMime },
      public: true,
    });

    // Make file public and get URL
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
