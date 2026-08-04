import { createServerSupabase } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { completeLesson } from "../actions";

export default async function LessonPage({ params }: { params: { courseId: string } }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login-signup");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, content")
    .eq("id", params.courseId)
    .single();

  if (!course) notFound();

  // Check if they are enrolled
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  const { data: progress } = await supabase
    .from("student_progress")
    .select("lesson_completed")
    .eq("student_id", student?.id)
    .eq("course_id", course.id)
    .single();

  if (!progress) {
    redirect(`/academy/courses/${course.id}`); // Kick them out if not enrolled
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={`/academy/courses/${course.id}`} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Details
      </Link>

      <div className="bg-white border border-ink/10 rounded-site p-8">
        <h1 className="font-display font-semibold text-[24px] text-ink mb-6">{course.title}</h1>
        
        {/* Render the HTML content from the database securely */}
        <div 
          className="prose prose-sm max-w-none text-slate leading-relaxed"
          dangerouslySetInnerHTML={{ __html: course.content || "<p>Lesson content coming soon.</p>" }} 
        />

        <div className="mt-8 pt-6 border-t border-ink/10">
          {progress.lesson_completed ? (
            <Link 
              href={`/academy/courses/${course.id}/test`}
              className="w-full bg-ink text-white font-bold py-3 rounded-site hover:bg-forest transition-colors text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Lesson Completed - Take Assessment
            </Link>
          ) : (
            <form action={completeLesson.bind(null, course.id)}>
              <button 
                type="submit" 
                className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm"
              >
                I've Finished — Mark Lesson Complete
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}