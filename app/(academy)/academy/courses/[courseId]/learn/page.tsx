// LessonPage.tsx
import { createServerSupabase } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { completeLesson } from "../action";
import { LessonContent } from "@/components/LessonContent";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string }> }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { courseId } = await params;

  if (!user) redirect("/login-signup");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, content")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  const { data: progress } = await supabase
    .from("student_progress")
    .select("lesson_completed, status")
    .eq("student_id", student?.id)
    .eq("course_id", course.id)
    .single();

  if (!progress) {
    redirect(`/academy/courses/${course.id}`); 
  }

  const testPassed = progress.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="max-w-5xl mx-auto w-full">
        <Link href={`/academy/courses/${course.id}`} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Details
        </Link>
      </div>

      <LessonContent html={course.content} title={course.title} />

      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white border border-ink/10 rounded-site p-6 flex flex-col items-center gap-4">
          {testPassed ? (
            <Link 
              href={`/academy/courses/${course.id}`}
              className="w-full max-w-xs bg-paper text-ink font-bold py-3 rounded-site hover:bg-ink/10 transition-colors text-sm flex items-center justify-center gap-2 border border-ink/10"
            >
              <CheckCircle className="w-4 h-4 text-emerald" /> Done Reviewing
            </Link>
          ) : progress.lesson_completed ? (
            <Link 
              href={`/academy/courses/${course.id}/test`}
              className="w-full max-w-xs bg-ink text-white font-bold py-3 rounded-site hover:bg-forest transition-colors text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Take Assessment
            </Link>
          ) : (
            <form action={completeLesson.bind(null, course.id)} className="w-full max-w-xs">
              <button 
                type="submit" 
                className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm"
              >
                I&apos;ve Finished — Mark Lesson Complete
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}