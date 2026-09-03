import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadedPath = "C:/Users/USER/.gemini/antigravity-ide/brain/ee709956-776d-4e0e-8591-94f0fe998673/.user_uploaded/media_1788434345878.jpg";
  const publicPath = path.join(process.cwd(), "public", "images", "certificate-template.jpg");

  try {
    if (fs.existsSync(uploadedPath)) {
      const buffer = fs.readFileSync(uploadedPath);
      try {
        fs.writeFileSync(publicPath, buffer);
      } catch (e) {
        console.error("Could not persist certificate-template.jpg:", e);
      }
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (fs.existsSync(publicPath)) {
      const buffer = fs.readFileSync(publicPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
    }
  } catch (err: any) {
    console.error("Error loading certificate template:", err);
  }

  return new NextResponse(null, { status: 404 });
}
