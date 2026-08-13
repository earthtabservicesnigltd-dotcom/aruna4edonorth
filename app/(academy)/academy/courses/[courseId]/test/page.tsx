import { createServerSupabase } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { TestForm } from "./TestForm";

export default async function TestPage({ params }: { params: Promise<{ courseId: string }> }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { courseId } = await params;

  if (!user) redirect("/login-signup");

  // 1. Fetch Course Details
  const { data: course } = await supabase
    .from("courses")
    .select("id, title, programme_id, order")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  // 2. Fetch the Assessment ID for this course
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id")
    .eq("course_id", course.id)
    .single();

  // 3. Fetch Questions securely
  let questions: any[] = [];
  if (assessment) {
    const { data: questionsData } = await supabase
      .from("questions")
      .select("id, question_text, options")
      .eq("assessment_id", assessment.id);
    
    questions = questionsData || [];
  }

  // 4. Check if student is allowed to take the test
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

  // --- FIX: Fetch the actual next course ID AND check if programme is complete ---
  let nextCourseId = null;
  let isProgrammeComplete = false;
  
  if (progress?.status === 'completed' && course.programme_id) {
    // Check for next course
    const { data: nextData } = await supabase
      .from("courses")
      .select("id")
      .eq("programme_id", course.programme_id)
      .eq("order", course.order + 1)
      .single();
    if (nextData) nextCourseId = nextData.id;

    // Check if all courses in programme are completed
    const { data: allProgCourses } = await supabase
      .from("courses")
      .select("id")
      .eq("programme_id", course.programme_id);
      
    const { data: completedProgCourses } = await supabase
      .from("student_progress")
      .select("course_id")
      .eq("student_id", student?.id)
      .in("course_id", allProgCourses?.map(c => c.id) || [])
      .eq("status", "completed");
      
    if (allProgCourses && completedProgCourses && allProgCourses.length === completedProgCourses.length) {
      isProgrammeComplete = true;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/academy/courses/${course.id}/learn`} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Lesson
      </Link>

      <div className="bg-white border border-ink/10 rounded-site p-8">
        <h1 className="font-display font-semibold text-[20px] text-ink mb-1">{course.title} — Assessment</h1>
        
        {/* If they already passed, show the success state */}
        {progress.status === 'completed' ? (
          <div className="bg-emerald/10 border border-emerald/20 rounded-site p-6 text-center mt-6">
            <CheckCircle className="w-10 h-10 text-emerald mx-auto mb-3" />
            <h2 className="font-display font-semibold text-lg text-ink">You already passed!</h2>
            <p className="text-slate text-sm mt-1">Your score: {progress.score}%</p>
            
            {/* --- FIX: Dynamic Button based on Programme Completion --- */}
            <Link 
              href={isProgrammeComplete ? "/academy/certificates" : nextCourseId ? `/academy/courses/${nextCourseId}` : "/academy/courses"} 
              className="mt-4 inline-block bg-orange text-white font-semibold px-5 py-2 rounded-site text-sm hover:bg-orange-dark transition-colors"
            >
              {isProgrammeComplete ? "View Certificate" : nextCourseId ? "Continue to Next Course" : "View Programme"}
            </Link>
          </div>
        ) : questions && questions.length > 0 ? (
          // Otherwise, show the test form
          <TestForm questions={questions} courseId={course.id} />
        ) : (
          <p className="text-slate text-sm mt-4">No assessment questions found for this course.</p>
        )}
      </div>
    </div>
  );
}