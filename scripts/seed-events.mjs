import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bfbuurcjdmpvevkmdeoo.supabase.co";
const supabaseKey = "sb_publishable_PhQNamM1JbZTSE6fnG93kw_uLr_qjY9";

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_EVENTS = [
  {
    title: "Edo North Grand Rally: A New Direction",
    category: "Events",
    event_type: "Rallies",
    event_time: "10:00 AM",
    event_location: "Auchi Township Stadium, Etsako West",
    date: "2026-07-18",
    excerpt: "Join Comr. Aruna Abubakari and thousands of supporters across Edo North for our largest rally yet.",
    image_url: "/images/34.png",
    featured: true,
    status: "Published",
  },
  {
    title: "Thousands Turn Out as Aruna Opens Etsako Town Hall Tour",
    category: "Events",
    event_type: "Town Halls",
    event_time: "10:00 AM",
    event_location: "Auchi Township Stadium, Etsako West",
    date: "2026-07-06",
    excerpt: "The campaign kicked off its seven-LGA listening tour in Auchi, drawing residents, market leaders, and youth groups.",
    image_url: "/images/25.png",
    status: "Published",
  },
  {
    title: "Youth Roundtable in Okpella Draws Record Attendance",
    category: "Events",
    event_type: "Town Halls",
    event_time: "02:00 PM",
    event_location: "Okpella Community Hall, Etsako East",
    date: "2026-07-02",
    excerpt: "Young entrepreneurs and students gathered to shape the campaign's job-creation agenda.",
    image_url: "/images/24.png",
    status: "Published",
  },
  {
    title: "Market Walk: Traders Voice Priorities in Auchi",
    category: "Events",
    event_type: "Community Visits",
    event_time: "09:00 AM",
    event_location: "Central Market, Auchi",
    date: "2026-06-24",
    excerpt: "A morning walk through Auchi's central market turned into an impromptu listening session.",
    image_url: "/images/29.jpeg",
    status: "Published",
  },
  {
    title: "School Visit Spotlights Rural Learning Gaps",
    category: "Events",
    event_type: "Community Visits",
    event_time: "11:30 AM",
    event_location: "Igarra Secondary School, Akoko Edo",
    date: "2026-06-12",
    excerpt: "A visit to a rural secondary school underscored the push for digital tools and teacher support.",
    image_url: "/images/33.jpeg",
    status: "Published",
  },
];

async function seed() {
  console.log("Seeding campaign events into DB...");

  for (const item of DEFAULT_EVENTS) {
    const { data: existing } = await supabase
      .from("posts")
      .select("id, title")
      .eq("title", item.title)
      .maybeSingle();

    if (existing) {
      console.log(`Updating: ${item.title}`);
      const { error } = await supabase
        .from("posts")
        .update(item)
        .eq("id", existing.id);
      if (error) console.error("Error updating:", error);
      else console.log("Successfully updated event!");
    } else {
      console.log(`Inserting: ${item.title}`);
      const { error } = await supabase
        .from("posts")
        .insert([item]);
      if (error) console.error("Error inserting:", error);
      else console.log("Successfully inserted event!");
    }
  }

  console.log("Finished seeding events.");
}

seed();
