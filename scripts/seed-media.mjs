import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bfbuurcjdmpvevkmdeoo.supabase.co";
const supabaseKey = "sb_publishable_PhQNamM1JbZTSE6fnG93kw_uLr_qjY9";

const supabase = createClient(supabaseUrl, supabaseKey);

const MEDIA_VIDEOS = [
  {
    title: "Campaign Introduction Video",
    tag: "INTRODUCTION",
    description: "Meet Comr. Aruna Abubakari — his story, his record, and his plan for Edo North, in his own words.",
    image_url: "/images/20.jpeg",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "03:42",
    status: "Published",
  },
  {
    title: "“Why I Am Running”",
    tag: "SPEECH",
    description: "The full address delivered at Auchi Town Hall, setting out the case for a new direction in Edo North.",
    image_url: "/images/13.png",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "07:15",
    status: "Published",
  },
];

async function seed() {
  console.log("Seeding media items into 'media' table...");

  for (const item of MEDIA_VIDEOS) {
    const { data: existing } = await supabase
      .from("media")
      .select("id, title")
      .eq("title", item.title)
      .maybeSingle();

    if (existing) {
      console.log(`Updating media item: ${item.title}`);
      const { error } = await supabase
        .from("media")
        .update(item)
        .eq("id", existing.id);
      if (error) console.error("Error updating:", error);
      else console.log("Successfully updated in 'media' table!");
    } else {
      console.log(`Inserting media item: ${item.title}`);
      const { error } = await supabase
        .from("media")
        .insert([item]);
      if (error) console.error("Error inserting:", error);
      else console.log("Successfully inserted into 'media' table!");
    }
  }

  console.log("Finished seeding media items.");
}

seed();
