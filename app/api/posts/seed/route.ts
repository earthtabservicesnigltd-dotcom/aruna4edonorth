import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_POSTS = [
  {
    title: "Thousands Turn Out as Aruna Opens Etsako Town Hall Tour",
    category: "Events",
    excerpt: "The campaign kicked off its seven-LGA listening tour in Auchi, drawing residents, market leaders, and youth groups for an unscripted conversation on jobs, roads, and security.",
    date: "2026-07-06",
    status: "Published",
    image_url: "/images/25.png",
    event_type: "Town Halls",
    event_time: "10:00 AM",
    event_location: "Auchi Township Stadium, Etsako West",
  },
  {
    title: "Campaign Releases Full Six-Agenda Vision Document",
    category: "Press",
    excerpt: "The Aruna campaign has published its complete policy vision covering youth, education, infrastructure, agriculture, security, and governance.",
    date: "2026-07-04",
    status: "Published",
    image_url: "/images/26.jpeg",
  },
  {
    title: "Youth Roundtable in Okpella Draws Record Attendance",
    category: "Events",
    excerpt: "Young entrepreneurs and students gathered to shape the campaign's job-creation agenda.",
    date: "2026-07-02",
    status: "Published",
    image_url: "/images/24.png",
    event_type: "Town Halls",
  },
  {
    title: 'On Rural Electrification: "No Community Left in the Dark"',
    category: "Statements",
    excerpt: "Aruna issues a formal statement recommitting to reliable power access across every ward.",
    date: "2026-06-29",
    status: "Published",
    image_url: "/images/27.jpeg",
  },
  {
    title: "Aruna on Channels TV: Accountability as Party Doctrine",
    category: "Media Features",
    excerpt: "In a wide-ranging interview, the candidate lays out why transparency is the foundation of his Senate bid.",
    date: "2026-06-27",
    status: "Published",
    image_url: "/images/28.jpeg",
  },
  {
    title: "Market Walk: Traders Voice Priorities in Auchi",
    category: "Events",
    excerpt: "A morning walk through Auchi's central market turned into an impromptu listening session.",
    date: "2026-06-24",
    status: "Published",
    image_url: "/images/29.jpeg",
    event_type: "Community Visits",
  },
  {
    title: "Coalition Publishes Biannual Constituency Report Card",
    category: "Press",
    excerpt: "The community development coalition Aruna chairs releases its independent scorecard.",
    date: "2026-06-20",
    status: "Published",
    image_url: "/images/30.jpeg",
  },
  {
    title: "Morning Radio: Agriculture as Edo North's Wealth Engine",
    category: "Media Features",
    excerpt: "A local radio feature explores the campaign's plan to move farmers to profitable agribusiness.",
    date: "2026-06-18",
    status: "Published",
    image_url: "/images/31.jpeg",
  },
  {
    title: "Statement on Community Safety and Peacebuilding",
    category: "Statements",
    excerpt: "Aruna calls for stronger collaboration between communities and security agencies.",
    date: "2026-06-15",
    status: "Published",
    image_url: "/images/32.jpeg",
  },
  {
    title: "School Visit Spotlights Rural Learning Gaps",
    category: "Events",
    excerpt: "A visit to a rural secondary school underscored the push for digital tools and teacher support.",
    date: "2026-06-12",
    status: "Published",
    image_url: "/images/33.jpeg",
    event_type: "Community Visits",
  },
];

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const inserted: any[] = [];
    const skipped: string[] = [];

    for (const post of DEFAULT_POSTS) {
      // Check if post with same title already exists
      const { data: existing } = await supabase
        .from("posts")
        .select("id, title")
        .eq("title", post.title)
        .maybeSingle();

      if (!existing) {
        const { data, error } = await supabase
          .from("posts")
          .insert([post])
          .select();

        if (error) {
          // If image_url or some field fails, try with minimal fields
          const fallbackData = {
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            date: post.date,
            status: post.status,
            event_type: post.event_type || null,
          };
          const { error: fallbackError } = await supabase
            .from("posts")
            .insert([fallbackData]);
          if (fallbackError) {
            console.error("Seed error for post:", post.title, error, fallbackError);
          } else {
            inserted.push(post.title);
          }
        } else {
          inserted.push(post.title);
        }
      } else {
        // Update image_url if missing
        await supabase
          .from("posts")
          .update({ image_url: post.image_url, status: "Published" })
          .eq("id", existing.id);
        skipped.push(post.title);
      }
    }

    return NextResponse.json({
      success: true,
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed posts" },
      { status: 500 }
    );
  }
}
