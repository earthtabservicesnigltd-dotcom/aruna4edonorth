import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("url") as string | null;
    const title = (formData.get("title") as string) || "Campaign Manifesto";
    const version = (formData.get("version") as string) || "2026 Edition";

    let finalUrl = directUrl || "";
    let fileName = "manifesto.pdf";
    let fileSize = "";

    if (file && typeof file === "object" && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      fileName = file.name;
      fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      // Save locally to public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const safeName = `manifesto-${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);

      finalUrl = `/uploads/${safeName}`;
    }

    if (!finalUrl) {
      return NextResponse.json({ success: false, error: "No file or URL provided" }, { status: 400 });
    }

    // Also persist in Supabase if documents/settings table exists
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("documents").upsert({
        id: "manifesto",
        title,
        file_url: finalUrl,
        file_name: fileName,
        file_size: fileSize,
        version,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({
      success: true,
      fileUrl: finalUrl,
      fileName,
      fileSize,
      title,
      version,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("id", "manifesto")
      .maybeSingle();

    if (data) {
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: "manifesto",
        title: "A New Direction for Edo North — Full Manifesto",
        file_url: "/uploads/manifesto.pdf",
        file_name: "Aruna-Abubakari-Manifesto-2026.pdf",
        file_size: "3.2 MB",
        version: "2026 Official Policy Document",
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        id: "manifesto",
        title: "A New Direction for Edo North — Full Manifesto",
        file_url: "/uploads/manifesto.pdf",
        file_name: "Aruna-Abubakari-Manifesto-2026.pdf",
        file_size: "3.2 MB",
        version: "2026 Official Policy Document",
      },
    });
  }
}
