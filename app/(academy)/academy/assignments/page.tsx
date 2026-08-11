"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Upload, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AssignmentsPage() {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stu } = await supabase.from("students").select("*").eq("email", user.email).single();
        if (stu) {
          setStudent(stu);
          
          const { data: assignData } = await supabase
            .from("assignments")
            .select("*")
            .eq("programme_id", stu.programme_id)
            .eq("cohort", stu.cohort)
            .order("created_at", { ascending: true });
          
          setAssignments(assignData || []);

          const { data: subData } = await supabase
            .from("assignment_submissions")
            .select("*")
            .eq("student_id", stu.id);
          
          const subMap: Record<string, any> = {};
          subData?.forEach(s => subMap[s.assignment_id] = s);
          setSubmissions(subMap);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  async function handleUpload(assignmentId: string, file: File) {
    if (!student) return;
    setUploadingId(assignmentId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${student.id}/${assignmentId}-${Date.now()}.${fileExt}`;
    
    // 1. Upload to Storage
    const { error: uploadErr } = await supabase.storage
      .from("assignments")
      .upload(fileName, file, { upsert: true });
      
    if (uploadErr) {
      toast.error("File upload failed.");
      setUploadingId(null);
      return;
    }
    
    const { data: publicUrlData } = supabase.storage.from("assignments").getPublicUrl(fileName);
    
    // 2. Save submission record
    const { error: subErr } = await supabase
      .from("assignment_submissions")
      .upsert({
        assignment_id: assignmentId,
        student_id: student.id,
        file_url: publicUrlData.publicUrl,
        status: "Submitted",
        submitted_at: new Date().toISOString()
      }, { onConflict: "assignment_id,student_id" });
      
    if (subErr) {
      toast.error("Failed to record submission.");
    } else {
      toast.success("Assignment submitted successfully!");
      // Update local state
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: { file_url: publicUrlData.publicUrl, status: "Submitted" }
      }));
    }
    setUploadingId(null);
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">
          {student?.programme?.toUpperCase() || "PROGRAMME"} · {student?.cohort?.toUpperCase() || "COHORT"}
        </span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Assignments</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Complete your tasks and upload your documents before the deadline.
        </p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && uploadingId) {
            handleUpload(uploadingId, e.target.files[0]);
          }
        }}
      />

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left font-mono text-[10.5px] uppercase tracking-wide text-slate bg-paper border-b border-ink/10">
              <th className="px-5 py-3.5 font-medium">Task</th>
              <th className="px-5 py-3.5 font-medium">Type</th>
              <th className="px-5 py-3.5 font-medium">Due</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate text-sm">No assignments uploaded yet.</td>
              </tr>
            ) : (
              assignments.map((a) => {
                const submission = submissions[a.id];
                const isSubmitted = submission?.status === "Submitted";
                
                return (
                  <tr key={a.id} className="border-b border-ink/5 last:border-0 hover:bg-paper/30">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[14px] text-ink">{a.title}</div>
                      <div className="text-[12px] text-slate mt-0.5">{a.description}</div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate">{a.type}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-ink">{a.due_day}</td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-site ${
                        isSubmitted ? 'bg-emerald/10 text-emerald' : 'bg-orange/12 text-orange-dark'
                      }`}>
                        {isSubmitted ? "Submitted" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {isSubmitted ? (
                        <a 
                          href={submission.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-site text-[13px] font-semibold text-ink hover:border-orange hover:text-orange transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        <button 
                          onClick={() => {
                            setUploadingId(a.id);
                            fileInputRef.current?.click();
                          }}
                          disabled={uploadingId === a.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-site text-[13px] font-semibold hover:bg-orange-dark transition-colors disabled:opacity-60"
                        >
                          {uploadingId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}