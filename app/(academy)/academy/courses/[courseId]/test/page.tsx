import { createServerSupabase } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { TestForm } from "./TestForm";

export default async function TestPage({ params }: { params: { courseId: string } }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login-signup");

  // 1. Fetch Course & Questions
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", params.courseId)
    .single();

  if (!course) notFound();

  // IMPORTANT: We only select the data needed to display the test. 
  // We DO NOT select the 'correct_option_index' here!
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, options")
    .eq("course_id", course.id);

  // 2. Check if student is allowed to take the test
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  const { data: progress } = await supabase
    .from("student_progress")
    .select("status, score, lesson_completed")
    .eq("student_id", student?.id)
    .eq("course_id", course.id)
    .single();

  if (!progress || !progress.lesson_completed) {
    redirect(`/academy/courses/${course.id}/learn`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/academy/courses/${course.id}/learn`} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Lesson
      </Link>

      <div className="bg-white border border-ink/10 rounded-site p-8">
        <h1 className="font-display font-semibold text-[20px] text-ink mb-1">{course.title} — Assessment</h1>
        
        {progress.status === 'completed' ? (
          <div className="bg-emerald/10 border border-emerald/20 rounded-site p-6 text-center mt-6">
            <CheckCircle className="w-10 h-10 text-emerald mx-auto mb-3" />
            <h2 className="font-display font-semibold text-lg text-ink">You already passed!</h2>
            <p className="text-slate text-sm mt-1">Your score: {progress.score}%</p>
            <Link href="/academy/courses" className="mt-4 inline-block bg-orange text-white font-semibold px-5 py-2 rounded-site text-sm hover:bg-orange-dark transition-colors">
              Go to Next Course
            </Link>
          </div>
        ) : questions && questions.length > 0 ? (
          <TestForm questions={questions} courseId={course.id} />
        ) : (
          <p className="text-slate text-sm mt-4">No assessment questions found for this course.</p>
        )}
      </div>
    </div>
  );
}