"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProgrammes() {
      const { data, error } = await supabase
        .from("programmes")
        .select("id, name, blurb, courses(id, title, order)")
        .eq("active", true)
        .order("name");
      
      if (error) console.error(error);
      setProgrammes(data || []);
      setLoading(false);
    }
    fetchProgrammes();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[22px] text-ink">Programmes & Courses</h1>
        <p className="text-[13.5px] text-slate mt-1">Click on a course to edit its content, video, and assessment.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {programmes.map((prog) => (
          <div key={prog.id} className="bg-white border border-ink/10 rounded-site p-6">
            <h3 className="font-display font-semibold text-[18px] text-ink mb-1">{prog.name}</h3>
            <p className="text-[13px] text-slate mb-4">{prog.blurb}</p>
            
            <div className="space-y-2 border-t border-ink/10 pt-4">
              {prog.courses?.sort((a: any, b: any) => a.order - b.order).map((course: any) => (
                <Link 
                  key={course.id} 
                  href={`/admin/academy/courses/${course.id}`}
                  className="flex items-center gap-3 text-[13.5px] p-2 -mx-2 rounded-site hover:bg-paper transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full bg-paper text-slate font-mono text-[10px] flex items-center justify-center shrink-0 group-hover:bg-orange group-hover:text-white transition-colors">
                    {course.order}
                  </span>
                  <span className="text-ink font-medium flex-1">{course.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate opacity-0 group-hover:opacity-100 group-hover:text-orange transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}