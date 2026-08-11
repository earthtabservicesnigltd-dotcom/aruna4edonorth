"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminLinksPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [selectedProg, setSelectedProg] = useState("");
  const [cohort, setCohort] = useState("Week 28");
  const [links, setLinks] = useState<any[]>([]);
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    url: "",
    icon: "💬"
  });

  useEffect(() => {
    async function fetchProgrammes() {
      const { data } = await supabase.from("programmes").select("id, name").eq("active", true);
      if (data) {
        setProgrammes(data);
        if (data.length > 0) setSelectedProg(data[0].id);
      }
      setLoading(false);
    }
    fetchProgrammes();
  }, [supabase]);

  useEffect(() => {
    if (selectedProg && cohort) fetchLinks();
  }, [selectedProg, cohort]);

  async function fetchLinks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cohort_links")
      .select("*")
      .eq("programme_id", selectedProg)
      .eq("cohort", cohort)
      .order("created_at", { ascending: true });

    if (error) toast.error("Failed to load links.");
    setLinks(data || []);
    setLoading(false);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title || !newItem.url) return toast.error("Please enter a title and URL.");

    const { error } = await supabase.from("cohort_links").insert([{
      programme_id: selectedProg,
      cohort: cohort,
      title: newItem.title,
      description: newItem.description,
      url: newItem.url,
      icon: newItem.icon || "💬"
    }]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Link added!");
      setNewItem({ title: "", description: "", url: "", icon: "💬" });
      fetchLinks();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("cohort_links").delete().eq("id", id);
    if (error) return toast.error("Failed to delete.");
    toast.success("Link deleted.");
    fetchLinks();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-semibold text-[22px] text-ink">Cohort Links</h1>
          <p className="text-[13.5px] text-slate mt-1">Manage WhatsApp, Telegram, or Meet links for cohorts.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedProg} 
            onChange={(e) => setSelectedProg(e.target.value)}
            className="px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
          >
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input 
            type="text" 
            value={cohort} 
            onChange={(e) => setCohort(e.target.value)} 
            placeholder="Cohort"
            className="px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange w-[140px]"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* Add Link Form */}
        <form onSubmit={handleAddItem} className="bg-white border border-ink/10 rounded-site p-6 space-y-4 h-fit">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-2">Add Communication Link</h3>
          
          <div className="grid grid-cols-[1fr_3fr] gap-3">
            <div>
              <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Icon</label>
              <input 
                type="text" 
                value={newItem.icon} 
                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                placeholder="💬"
                className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange text-center"
              />
            </div>
            <div>
              <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Title</label>
              <input 
                type="text" 
                value={newItem.title} 
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g. WhatsApp Group"
                className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Description</label>
            <input 
              type="text" 
              value={newItem.description} 
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="e.g. Main chat for Week 28"
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">URL</label>
            <input 
              type="text" 
              value={newItem.url} 
              onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <button type="submit" className="w-full bg-orange text-white py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </form>

        {/* Links List */}
        <div className="bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4">
            Current Links: <span className="text-orange">{cohort}</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>
          ) : links.length === 0 ? (
            <div className="text-center py-10 text-slate text-[13.5px]">No links found for this cohort.</div>
          ) : (
            <div className="space-y-4">
              {links.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-ink/5 last:border-0 last:pb-0">
                  <div className="w-10 text-center shrink-0 pt-1">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] text-ink font-medium leading-tight">{item.title}</div>
                    <div className="text-[12px] text-slate mt-0.5">{item.description}</div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-orange hover:underline mt-1 block truncate">
                      {item.url}
                    </a>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-slate/40 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}