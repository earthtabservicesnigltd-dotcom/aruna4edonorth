import { createServerSupabase } from "@/lib/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, PlayCircle, CheckCircle, FileText } from "lucide-react";
import { enrollCourse } from "./action";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  // 1. Await params to get courseId (Next.js 15 requirement)
  const { courseId } = await params;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login-signup");

  // 2. Fetch Course Details using courseId
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  // 3. Fetch Student Profile
  const { data: student } = await supabase
    .from("students")
    .select("id, programme_id")
    .eq("email", user.email)
    .single();

  // 4. Fetch Progress for THIS course
  const { data: progress } = await supabase
    .from("student_progress")
    .select("*")
    .eq("student_id", student?.id)
    .eq("course_id", course.id)
    .single();

  // 5. Lock Logic (Check previous course in the same school)
  let isLocked = false;
  let lockReason = "";

  if (course.order > 1 && course.programme_id) {
    const { data: prevCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("programme_id", course.programme_id)
      .eq("order", course.order - 1)
      .single();

    if (prevCourse) {
      const { data: prevProgress } = await supabase
        .from("student_progress")
        .select("status")
        .eq("student_id", student?.id)
        .eq("course_id", prevCourse.id)
        .single();

      if (!prevProgress || prevProgress.status !== 'completed') {
        isLocked = true;
        lockReason = "Complete the previous course in this school first.";
      }
    }
  }

  // 6. Determine UI State
  const isEnrolled = !!progress; 
  const lessonDone = progress?.lesson_completed;
  const testPassed = progress?.status === 'completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/academy/courses" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
      </Link>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        {/* Course Header */}
        <div className="bg-ink text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 90% 20%, rgba(1,112,61,0.45), transparent 45%)" }} />
          <div className="relative z-10">
            <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">COURSE {course.order}</span>
            <h1 className="font-display font-semibold text-[clamp(24px,3vw,34px)] leading-tight">{course.title}</h1>
            <p className="text-white/70 text-sm mt-2">{course.duration}</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-slate leading-relaxed">{course.description || "Course description coming soon."}</p>

          {/* Lock State UI */}
          {isLocked && !isEnrolled && (
            <div className="bg-amber-50 border border-amber-100 rounded-site p-4 text-center">
              <Lock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-amber-700 font-semibold text-sm">Course Locked</p>
              <p className="text-amber-600 text-xs mt-1">{lockReason}</p>
            </div>
          )}

          {/* Passed State UI */}
          {testPassed && (
            <div className="bg-emerald/10 border border-emerald/20 rounded-site p-4 text-center">
              <CheckCircle className="w-6 h-6 text-emerald mx-auto mb-2" />
              <p className="text-emerald font-semibold text-sm">Course Passed!</p>
              <p className="text-slate text-xs mt-1">You can now proceed to the next course.</p>
            </div>
          )}

          {/* Action Buttons Logic */}
          {!isLocked && !testPassed && (
            <div className="space-y-3">
              {!isEnrolled ? (
                <form action={enrollCourse.bind(null, course.id)}>
                  <button type="submit" className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm">
                    Start This Course
                  </button>
                </form>
              ) : !lessonDone ? (
                <Link href={`/academy/courses/${courseId}/learn`} className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Continue Lesson
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href={`/academy/courses/${courseId}/test`} className="w-full bg-ink text-white font-bold py-3 rounded-site hover:bg-forest transition-colors text-sm flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Take Assessment
                  </Link>
                  <p className="text-center text-xs text-slate">Score 75% or higher to unlock the next course.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}