"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Award } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminStudentsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      // 1. Fetch all students
      const { data: stuData, error: stuErr } = await supabase
        .from("students")
        .select("*")
        .order("name", { ascending: true });
      
      if (stuErr) {
        console.error("Error fetching students:", stuErr);
        toast.error("Failed to load students: " + stuErr.message);
        setLoading(false);
        return;
      }

      // 2. Fetch all programmes to map the names manually
      const { data: progData } = await supabase
        .from("programmes")
        .select("id, name");

      // 3. Combine them: Attach the programme name to the student object
      const mappedStudents = (stuData || []).map(stu => {
        const programme = progData?.find(p => p.id === stu.programme_id);
        return {
          ...stu,
          programme_name: programme?.name || "Unknown Programme"
        };
      });

      setStudents(mappedStudents);
      setLoading(false);
    }
    fetchStudents();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[22px] text-ink">Students</h1>
        <p className="text-[13.5px] text-slate mt-1">View all enrolled academy students. Click a name to see details.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left font-mono text-[10.5px] uppercase tracking-wide text-slate bg-paper border-b border-ink/10">
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Email</th>
              <th className="px-5 py-3.5 font-medium">Phone</th>
              <th className="px-5 py-3.5 font-medium">Programme</th>
              <th className="px-5 py-3.5 font-medium">Cohort</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium text-right">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate text-sm">No students found.</td>
              </tr>
            ) : (
              students.map((stu) => (
                <tr key={stu.id} className="border-b border-ink/5 last:border-0 hover:bg-paper/50">
                  <td className="px-5 py-3.5 font-medium text-[13.5px] text-ink">
                    <Link href={`/admin/academy/students/${stu.id}`} className="hover:text-orange hover:underline">
                      {stu.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate">{stu.email}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate">{stu.phone || "N/A"}</td>
                  {/* Display the manually mapped programme name */}
                  <td className="px-5 py-3.5 text-[13px] text-slate">{stu.programme_name}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate">{stu.cohort || "N/A"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[10px] uppercase px-2 py-1 rounded ${
                      stu.status === 'Active' ? 'bg-emerald/10 text-emerald' : 'bg-paper text-slate border border-ink/10'
                    }`}>
                      {stu.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/academy/students/${stu.id}/certificate`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-orange hover:text-orange-dark font-semibold px-2.5 py-1 rounded-site hover:bg-orange/10 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" /> Preview
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}