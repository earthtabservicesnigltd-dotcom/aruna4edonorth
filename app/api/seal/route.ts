import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadedPath = "C:/Users/USER/.gemini/antigravity-ide/brain/ee709956-776d-4e0e-8591-94f0fe998673/.user_uploaded/media_1788435364011.png";
  const publicPath = path.join(process.cwd(), "public", "images", "official-seal.png");

  try {
    if (fs.existsSync(uploadedPath)) {
      const buffer = fs.readFileSync(uploadedPath);
      try {
        fs.writeFileSync(publicPath, buffer);
      } catch (e) {
        console.error("Could not write to public/images/official-seal.png:", e);
      }
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (fs.existsSync(publicPath)) {
      const buffer = fs.readFileSync(publicPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
        },
      });
    }
  } catch (err: any) {
    console.error("Error loading seal:", err);
  }

  return new NextResponse(null, { status: 404 });
}
