// components/sections/news/news-feed-section.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { VideoModal } from "@/components/ui/video-modal";
import { StoryModal } from "@/components/ui/story-modal";

interface PostItem {
  id: string;
  image_url?: string;
  category: string;
  catClass?: string;
  date: string;
  title: string;
  excerpt: string;
  video_url?: string;
  is_video?: boolean;
  status?: string;
}

function getCategoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("event")) return "bg-emerald/92";
  if (cat.includes("statement")) return "bg-orange/94";
  if (cat.includes("press")) return "bg-ink/86";
  if (cat.includes("media")) return "bg-forest/90";
  return "bg-ink/86";
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function NewsFeedSection() {
  const [active, setActive] = useState("All");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title?: string } | null>(null);
  const [activeStory, setActiveStory] = useState<PostItem | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("date", { ascending: false });

        if (!error && data) {
          const published = data.filter(
            (p) => !p.status || p.status.toLowerCase() === "published"
          );
          const candidates = published.length > 0 ? published : data;

          const mapped: PostItem[] = candidates.map((item) => {
            const hasVideo = Boolean(
              item.video_url && item.video_url.startsWith("http")
            );

            return {
              id: item.id,
              image_url: item.image_url || "/images/26.jpeg",
              category: item.category || "News",
              catClass: getCategoryColor(item.category || "News"),
              date: item.date || new Date().toISOString().slice(0, 10),
              title: item.title,
              excerpt: item.excerpt || "",
              video_url: item.video_url || undefined,
              is_video: hasVideo,
              status: item.status,
            };
          });
          setPosts(mapped);
        }
      } catch (err) {
        console.error("Error fetching news posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Compute dynamic categories based on live DB posts
  const dynamicCategories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ];

  const filtered =
    active === "All"
      ? posts
      : posts.filter((p) => (p.category || "").toLowerCase() === active.toLowerCase());

  return (
    <section className="pb-24">
      <div className="max-w-site mx-auto px-8">
        {/* Category Filter Pills */}
        <div className="flex gap-2.5 flex-wrap pb-9 mb-10 border-b border-ink/10 rise in">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-mono text-[11.5px] tracking-wide uppercase px-4 py-2 rounded-full border transition-colors ${
                active.toLowerCase() === cat.toLowerCase()
                  ? "bg-ink text-white border-ink shadow-sm"
                  : "bg-white text-slate border-ink/15 hover:border-orange hover:text-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16 text-slate gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-orange" />
            <span className="font-mono text-xs uppercase tracking-wider">Loading updates...</span>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((post) => {
              const imgSrc = post.image_url || "/images/26.jpeg";
              const badgeClass = post.catClass || getCategoryColor(post.category);
              const dateDisplay = formatDate(post.date);

              return (
                <div
                  key={post.id || post.title}
                  className="border border-ink/12 rounded-site overflow-hidden bg-white hover:-translate-y-1 hover:shadow-lg transition-all group flex flex-col"
                >
                  <div
                    onClick={() => {
                      if (post.is_video) {
                        setActiveVideo({ url: post.video_url || "", title: post.title });
                      } else {
                        setActiveStory(post);
                      }
                    }}
                    className="relative aspect-[16/10] bg-paper overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={imgSrc}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 font-mono text-[10px] tracking-wider uppercase text-white px-2.5 py-1 rounded-full shadow-sm ${badgeClass}`}
                    >
                      {post.category}
                    </span>
                    {post.is_video && (
                      <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-orange/94 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>

                  <div className="p-6 pb-7 flex flex-col flex-1">
                    <span className="font-mono text-[10.5px] tracking-wide text-slate mb-3">
                      {dateDisplay}
                    </span>
                    <h3
                      onClick={() => {
                        if (post.is_video) setActiveVideo({ url: post.video_url || "", title: post.title });
                        else setActiveStory(post);
                      }}
                      className="font-display font-semibold text-[19px] leading-tight text-ink mb-2.5 cursor-pointer hover:text-orange transition-colors line-clamp-2"
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.is_video ? (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVideo({ url: post.video_url || "", title: post.title })
                        }
                        className="inline-flex items-center gap-2 font-semibold text-sm text-orange hover:gap-3 transition-all self-start mt-auto"
                      >
                        Watch video →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveStory(post)}
                        className="inline-flex items-center gap-2 font-semibold text-sm text-orange hover:gap-3 transition-all self-start mt-auto"
                      >
                        Read more →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate bg-paper/50 rounded-site border border-ink/8">
            <span className="text-3xl block mb-3">📬</span>
            <p className="font-mono text-xs tracking-wide">
              No posts in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Video Popup Modal */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url}
        title={activeVideo?.title}
      />

      {/* Story Popup Modal */}
      <StoryModal
        isOpen={Boolean(activeStory)}
        onClose={() => setActiveStory(null)}
        title={activeStory?.title}
        category={activeStory?.category}
        date={activeStory ? formatDate(activeStory.date) : ""}
        excerpt={activeStory?.excerpt}
        image_url={activeStory?.image_url}
      />
    </section>
  );
}
