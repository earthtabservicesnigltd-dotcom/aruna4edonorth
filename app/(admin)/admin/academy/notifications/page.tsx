"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Trash2, Send, Bell } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [newNotif, setNewNotif] = useState({
    title: "",
    message: "",
    audience: "All Students"
  });

  useEffect(() => {
    async function fetchData() {
      const { data: progs } = await supabase.from("programmes").select("id, name").eq("active", true);
      setProgrammes(progs || []);
      
      const { data: notifs } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      setNotifications(notifs || []);
      
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return toast.error("Title and message are required.");

    const { data, error } = await supabase.from("notifications").insert([{
      title: newNotif.title,
      message: newNotif.message,
      audience: newNotif.audience,
      status: "Sent",
      date: new Date().toISOString().split('T')[0]
    }]).select();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Notification sent!");
      setNewNotif({ title: "", message: "", audience: "All Students" });
      setNotifications(prev => [data[0], ...prev]);
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) return toast.error("Failed to delete.");
    toast.success("Notification deleted.");
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-semibold text-[22px] text-ink">Announcements</h1>
          <p className="text-[13.5px] text-slate mt-1">Send broadcast messages to student dashboards.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* Create Notification Form */}
        <form onSubmit={handleSend} className="bg-white border border-ink/10 rounded-site p-6 space-y-4 h-fit">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-2">Create Announcement</h3>
          
          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Target Audience</label>
            <select 
              value={newNotif.audience} 
              onChange={(e) => setNewNotif({ ...newNotif, audience: e.target.value })}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            >
              <option value="All Students">All Students</option>
              {programmes.map(p => <option key={p.id} value={p.id}>{p.name} Only</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Title</label>
            <input 
              type="text" 
              value={newNotif.title} 
              onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
              placeholder="e.g. Live Class Starting Soon"
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Message</label>
            <textarea 
              value={newNotif.message} 
              onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <button type="submit" className="w-full bg-orange text-white py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Send Announcement
          </button>
        </form>

        {/* Sent Notifications List */}
        <div className="bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4">Sent Announcements</h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-slate text-[13.5px]">No announcements sent yet.</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => {
                const prog = programmes.find(p => p.id === item.audience);
                const audienceText = item.audience === "All Students" ? "All Students" : prog?.name || "Unknown";
                
                return (
                  <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-ink/5 last:border-0 last:pb-0">
                    <div className="w-10 text-center shrink-0 pt-1">
                      <Bell className="w-5 h-5 text-orange mx-auto" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-[13.5px] text-ink font-medium leading-tight">{item.title}</div>
                        <span className="text-[9px] font-mono uppercase bg-orange/10 text-orange px-1.5 py-0.5 rounded">{audienceText}</span>
                      </div>
                      <div className="text-[12px] text-slate mt-0.5">{item.message}</div>
                      <div className="text-[10px] text-slate/60 mt-1 font-mono">{new Date(item.created_at).toLocaleString()}</div>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-slate/40 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}