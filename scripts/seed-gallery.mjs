import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bfbuurcjdmpvevkmdeoo.supabase.co";
const supabaseKey = "sb_publishable_PhQNamM1JbZTSE6fnG93kw_uLr_qjY9";

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_GALLERY = [
  {
    image_url: "/images/22.jpg",
    alt_text: "Community visit, Auchi",
    caption: "Ward Visit — Auchi",
    layout: "tall",
    order_num: 1,
    status: "Published",
  },
  {
    image_url: "/images/27.jpeg",
    alt_text: "Town hall rally",
    caption: "Town Hall — Etsako West",
    layout: "normal",
    order_num: 2,
    status: "Published",
  },
  {
    image_url: "/images/28.jpeg",
    alt_text: "Youth meeting",
    caption: "Youth Desk Launch — Owan East",
    layout: "normal",
    order_num: 3,
    status: "Published",
  },
  {
    image_url: "/images/29.jpeg",
    alt_text: "Market association meeting",
    caption: "Market Association Meeting",
    layout: "wide",
    order_num: 4,
    status: "Published",
  },
  {
    image_url: "/images/30.jpeg",
    alt_text: "Health centre inspection",
    caption: "PHC Inspection — Ovia North-East",
    layout: "normal",
    order_num: 5,
    status: "Published",
  },
];

async function seed() {
  console.log("Seeding gallery items into 'gallery' table...");

  for (const item of DEFAULT_GALLERY) {
    const { data: existing } = await supabase
      .from("gallery")
      .select("id, caption")
      .eq("caption", item.caption)
      .maybeSingle();

    if (existing) {
      console.log(`Updating: ${item.caption}`);
      const { error } = await supabase
        .from("gallery")
        .update(item)
        .eq("id", existing.id);
      if (error) console.error("Error updating:", error);
      else console.log("Successfully updated in 'gallery' table!");
    } else {
      console.log(`Inserting: ${item.caption}`);
      const { error } = await supabase
        .from("gallery")
        .insert([item]);
      if (error) console.error("Error inserting:", error);
      else console.log("Successfully inserted into 'gallery' table!");
    }
  }

  console.log("Finished seeding gallery items.");
}

seed();
