"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  created_at: string;
  type: string | null;
  name: string;
  email: string;
  body: string | null;
  read: boolean | null;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Unread" | "Talk" | "Contact">("All");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  }

  async function toggleRead(id: string, currentStatus: boolean | null) {
    const supabase = createClient();
    const { error } = await supabase.from("messages").update({ read: !currentStatus }).eq("id", id);
    
    if (error) {
      toast.error("Failed to update status.");
    } else {
      toast.success(!currentStatus ? "Marked as read" : "Marked as unread");
    }
    loadMessages();
  }

  async function deleteMessage(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete message.");
    } else {
      toast.success("Message deleted");
      loadMessages();
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === "All") return true;
    if (filter === "Unread") return msg.read === false;
    return msg.type === filter;
  });

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
          Inbox
        </span>
        <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
          Citizen Messages
        </h1>
        <p className="text-[13.5px] text-slate mt-1">
          Questions from &quot;Talk to Abubakari&quot; and general contact forms.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["All", "Unread", "Talk", "Contact"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-site text-[12px] font-mono uppercase tracking-wide border transition-colors ${
              filter === f
                ? "bg-ink text-white border-ink"
                : "bg-white text-slate border-ink/15 hover:border-orange"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white border border-ink/10 rounded-site py-16 text-center">
            <div className="text-3xl mb-3">📭</div>
            <p className="font-display font-semibold text-ink">No messages here</p>
            <p className="text-slate text-sm">When people submit forms, they will appear here.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className={`bg-white border rounded-site p-5 transition-all ${msg.read ? 'border-ink/10 opacity-70' : 'border-orange/40 shadow-sm'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${msg.type === 'Talk' ? 'bg-orange/12 text-orange-dark' : 'bg-emerald/10 text-emerald'}`}>
                      {msg.type || "General"}
                    </span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-orange"></span>}
                    <span className="font-mono text-[11px] text-slate">
                      {new Date(msg.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-[16px] text-ink">{msg.name}</h3>
                  <p className="text-[12.5px] text-slate mb-3">📧 {msg.email}</p>
                  <div className="bg-paper rounded-site p-4 whitespace-pre-line text-[14px] text-ink leading-relaxed">
                    {msg.body}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => toggleRead(msg.id, msg.read)} 
                    className="p-2 border border-ink/10 rounded-site text-slate hover:text-orange hover:border-orange transition-colors"
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => deleteMessage(msg.id)} 
                    className="p-2 border border-ink/10 rounded-site text-slate hover:text-red-600 hover:border-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}