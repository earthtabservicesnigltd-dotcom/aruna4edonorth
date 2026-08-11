"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function AdminAssignmentsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [selectedProg, setSelectedProg] = useState("");
  const [cohort, setCohort] = useState("Week 28");
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "Individual",
    due_day: "Mon",
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
    if (selectedProg && cohort) fetchAssignments();
  }, [selectedProg, cohort]);

  async function fetchAssignments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("programme_id", selectedProg)
      .eq("cohort", cohort)
      .order("created_at", { ascending: true });

    if (error) toast.error("Failed to load assignments.");
    setAssignments(data || []);
    setLoading(false);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title) return toast.error("Please enter a title.");

    const { error } = await supabase.from("assignments").insert([{
      programme_id: selectedProg,
      cohort: cohort,
      title: newItem.title,
      description: newItem.description,
      type: newItem.type,
      due_day: newItem.due_day,
    }]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Assignment added!");
      setNewItem({ title: "", description: "", type: "Individual", due_day: "Mon" });
      fetchAssignments();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    if (error) return toast.error("Failed to delete.");
    toast.success("Assignment deleted.");
    fetchAssignments();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-semibold text-[22px] text-ink">Assignments</h1>
          <p className="text-[13.5px] text-slate mt-1">Manage weekly assignments for cohorts.</p>
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
        {/* Add Assignment Form */}
        <form onSubmit={handleAddItem} className="bg-white border border-ink/10 rounded-site p-6 space-y-4 h-fit">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-2">Add Assignment</h3>
          
          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Title</label>
            <input 
              type="text" 
              value={newItem.title} 
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="e.g. Personal Reflection Sheet"
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Description</label>
            <textarea 
              value={newItem.description} 
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Brief instructions..."
              rows={3}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              </select>
            </div>
            <div>
              <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Due Day</label>
              <select 
                value={newItem.due_day} 
                onChange={(e) => setNewItem({ ...newItem, due_day: e.target.value })}
                className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange text-white py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Assignment
          </button>
        </form>

        {/* Assignments List */}
        <div className="bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4">
            Current Assignments: <span className="text-orange">{cohort}</span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-10 text-slate text-[13.5px]">No assignments found for this cohort.</div>
          ) : (
            <div className="space-y-4">
              {assignments.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-ink/5 last:border-0 last:pb-0">
                  <div className="w-12 text-center shrink-0">
                    <div className="font-display font-semibold text-[14px] text-ink">{item.due_day}</div>
                    <div className="font-mono text-[9px] text-slate uppercase">{item.type}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] text-ink font-medium leading-tight">{item.title}</div>
                    <div className="text-[12px] text-slate mt-0.5">{item.description}</div>
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