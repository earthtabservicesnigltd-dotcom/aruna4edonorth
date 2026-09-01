import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bfbuurcjdmpvevkmdeoo.supabase.co";
const supabaseKey = "sb_publishable_PhQNamM1JbZTSE6fnG93kw_uLr_qjY9";

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_VOXPOPS = [
  {
    image_url: "/images/14.png",
    duration: "01:20",
    quote: "What I want from a senator is a working skills desk, not a rally.",
    attribution: "Comfort Aigbe — Trader, Owan East",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
  {
    image_url: "/images/07.png",
    duration: "01:45",
    quote: "His plan is the first one with a payment schedule attached to it.",
    attribution: "Blessing Erhabor — Head Teacher, Etsako West",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
  {
    image_url: "/images/05.png",
    duration: "02:05",
    quote: "He was the only official who came back to check on the borehole.",
    attribution: "Osaze Igbinedion — Community Leader, Ovia North-East",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
];

async function seed() {
  console.log("Seeding citizen quotes into 'voxpop' table...");

  for (const item of DEFAULT_VOXPOPS) {
    const { data: existing } = await supabase
      .from("voxpop")
      .select("id, attribution")
      .eq("attribution", item.attribution)
      .maybeSingle();

    if (existing) {
      console.log(`Updating: ${item.attribution}`);
      const { error } = await supabase
        .from("voxpop")
        .update(item)
        .eq("id", existing.id);
      if (error) console.error("Error updating:", error);
      else console.log("Successfully updated in 'voxpop' table!");
    } else {
      console.log(`Inserting: ${item.attribution}`);
      const { error } = await supabase
        .from("voxpop")
        .insert([item]);
      if (error) console.error("Error inserting:", error);
      else console.log("Successfully inserted into 'voxpop' table!");
    }
  }

  console.log("Finished seeding voxpop items.");
}

seed();
