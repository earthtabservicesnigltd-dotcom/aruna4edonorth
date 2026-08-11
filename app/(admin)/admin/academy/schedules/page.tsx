"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Plus, Trash2, Link as LinkIcon, Save } from "lucide-react";
import { toast } from "sonner";

const daysOfWeek = [
  { day: "Mon", order: 1 },
  { day: "Tue", order: 2 },
  { day: "Wed", order: 3 },
  { day: "Thu", order: 4 },
  { day: "Fri", order: 5 },
  { day: "Sat", order: 6 },
];

export default function SchedulesManager() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [selectedProg, setSelectedProg] = useState("");
  const [cohort, setCohort] = useState("Week 28");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  
  const [newItem, setNewItem] = useState({
    day: "Mon",
    type: "Individual",
    start_time: "9:00 AM",
    title: "",
    is_live: false,
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
    if (selectedProg && cohort) {
      fetchSchedule();
    }
  }, [selectedProg, cohort]);

  async function fetchSchedule() {
    setLoading(true);
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("programme_id", selectedProg)
      .eq("cohort", cohort)
      .order("day_order", { ascending: true });

    if (error) toast.error("Failed to load schedule.");
    
    const schedData = data || [];
    setSchedule(schedData);
    
    // Initialize link inputs with existing meet links
    const links: Record<string, string> = {};
    schedData.forEach(item => {
      links[item.id] = item.meet_link || "";
    });
    setLinkInputs(links);
    
    setLoading(false);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title) return toast.error("Please enter a title.");

    const dayData = daysOfWeek.find(d => d.day === newItem.day);
    
    const { error } = await supabase.from("schedules").insert([{
      programme_id: selectedProg,
      cohort: cohort,
      day_of_week: newItem.day,
      day_order: dayData?.order || 1,
      type: newItem.type,
      start_time: newItem.start_time,
      title: newItem.title,
      is_live: newItem.is_live,
    }]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Schedule item added!");
      setNewItem({ ...newItem, title: "" });
      fetchSchedule();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (error) return toast.error("Failed to delete.");
    toast.success("Item deleted.");
    fetchSchedule();
  }

  async function handleSaveLink(id: string) {
    const link = linkInputs[id];
    const { error } = await supabase
      .from("schedules")
      .update({ meet_link: link })
      .eq("id", id);
      
    if (error) return toast.error("Failed to save link.");
    toast.success("Meet link saved!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-semibold text-[22px] text-ink">Schedules</h1>
          <p className="text-[13.5px] text-slate mt-1">Manage weekly schedules and live Meet links.</p>
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
        {/* Add Schedule Item Form */}
        <form onSubmit={handleAddItem} className="bg-white border border-ink/10 rounded-site p-6 space-y-4 h-fit">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-2">Add Schedule Item</h3>
          
          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Day</label>
            <select 
              value={newItem.day} 
              onChange={(e) => setNewItem({ ...newItem, day: e.target.value })}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            >
              {daysOfWeek.map(d => <option key={d.day} value={d.day}>{d.day}</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Type</label>
            <select 
              value={newItem.type} 
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            >
              <option>Individual</option>
              <option>Group</option>
              <option>Capstone</option>
              <option>Graduation</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Time / Tag</label>
            <input 
              type="text" 
              value={newItem.start_time} 
              onChange={(e) => setNewItem({ ...newItem, start_time: e.target.value })}
              placeholder="e.g. 10:00 AM · LIVE or TASK"
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Title</label>
            <input 
              type="text" 
              value={newItem.title} 
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="e.g. Property Identification & Market Analysis"
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={newItem.is_live} 
              onChange={(e) => setNewItem({ ...newItem, is_live: e.target.checked })}
              className="accent-orange w-4 h-4"
            />
            <span className="text-[13.5px] text-ink">Is Live Class?</span>
          </label>

          <button type="submit" className="w-full bg-orange text-white py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add to Schedule
          </button>
        </form>

        {/* Schedule List & Link Manager */}
        <div className="bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4">
            Current Schedule: <span className="text-orange">{cohort}</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>
          ) : schedule.length === 0 ? (
            <div className="text-center py-10 text-slate text-[13.5px]">No schedule items found for this cohort.</div>
          ) : (
            <div className="space-y-5">
              {schedule.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 pb-4 border-b border-ink/5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-12 text-center shrink-0">
                      <div className="font-display font-semibold text-[14px] text-ink">{item.day_of_week}</div>
                      <div className="font-mono text-[9px] text-slate uppercase">{item.type}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] text-orange mb-0.5">{item.start_time}</div>
                      <div className="text-[13.5px] text-ink font-medium leading-tight">{item.title}</div>
                      {item.is_live && <span className="inline-block mt-1 font-mono text-[9px] uppercase bg-orange/10 text-orange-dark px-1.5 py-0.5 rounded">LIVE</span>}
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-slate/40 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Meet Link Input (only show for live classes) */}
                  {item.is_live && (
                    <div className="flex items-center gap-2 pl-14">
                      <div className="flex-1 flex items-center gap-2 bg-paper border border-ink/10 rounded-site px-3 py-1.5 focus-within:border-orange">
                        <LinkIcon className="w-3.5 h-3.5 text-slate shrink-0" />
                        <input 
                          type="text" 
                          value={linkInputs[item.id] || ""} 
                          onChange={(e) => setLinkInputs({ ...linkInputs, [item.id]: e.target.value })}
                          placeholder="Paste Google Meet link..."
                          className="bg-transparent text-[12.5px] outline-none w-full text-ink"
                        />
                      </div>
                      <button 
                        onClick={() => handleSaveLink(item.id)} 
                        className="bg-ink text-white px-3 py-1.5 rounded-site text-[11.5px] font-semibold hover:bg-forest transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}