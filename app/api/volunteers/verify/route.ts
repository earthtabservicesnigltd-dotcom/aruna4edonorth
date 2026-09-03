import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("id");

    if (!query) {
      return NextResponse.json({ error: "Volunteer ID required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const clean = decodeURIComponent(query).trim();
    const withSlashes = clean.replace(/-/g, "/");
    const withHyphens = clean.replace(/\//g, "-");
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

    let volunteer = null;

    // 1. Try exact and case-insensitive match on volunteer_id
    const candidates = Array.from(new Set([clean, withSlashes, withHyphens]));
    for (const val of candidates) {
      const { data, error } = await supabase
        .from("volunteers")
        .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
        .ilike("volunteer_id", val)
        .maybeSingle();

      if (!error && data) {
        volunteer = data;
        break;
      }
    }

    // 2. If query is a valid UUID, search by id column
    if (!volunteer && isUUID) {
      const { data, error } = await supabase
        .from("volunteers")
        .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
        .eq("id", clean)
        .maybeSingle();

      if (!error && data) {
        volunteer = data;
      }
    }

    // 3. Fallback: search volunteer_id with wildcards if clean length >= 3
    if (!volunteer && clean.length >= 3) {
      const { data, error } = await supabase
        .from("volunteers")
        .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
        .ilike("volunteer_id", `%${clean}%`)
        .maybeSingle();

      if (!error && data) {
        volunteer = data;
      }
    }

    // 4. Fallback: search by full name
    if (!volunteer && clean.length >= 3) {
      const { data, error } = await supabase
        .from("volunteers")
        .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
        .ilike("full_name", `%${clean}%`)
        .maybeSingle();

      if (!error && data) {
        volunteer = data;
      }
    }

    if (!volunteer) {
      return NextResponse.json({ found: false, message: "Volunteer ID not found in the campaign database." }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      volunteer: {
        id: volunteer.id,
        volunteer_id: volunteer.volunteer_id,
        full_name: volunteer.full_name,
        lga: volunteer.lga,
        skills: volunteer.skills || [],
        photo_url: volunteer.photo_url || null,
        status: volunteer.status || "Active",
        created_at: volunteer.created_at,
      },
    });
  } catch (err: any) {
    console.error("Verification server error:", err);
    return NextResponse.json({ found: false, error: "Internal server error" }, { status: 500 });
  }
}
