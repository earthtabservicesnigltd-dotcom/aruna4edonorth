import { createServerSupabase } from "@/lib/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, PlayCircle, CheckCircle, FileText } from "lucide-react";
import { enrollCourse } from "./action";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login-signup");

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: student } = await supabase
    .from("students")
    .select("id, programme_id")
    .eq("email", user.email)
    .single();

  const { data: progress } = await supabase
    .from("student_progress")
    .select("*")
    .eq("student_id", student?.id)
    .eq("course_id", course.id)
    .single();

  // Fetch all courses in this programme for the Roadmap
  const { data: programmeCourses } = await supabase
    .from("courses")
    .select("id, title, order")
    .eq("programme_id", course.programme_id)
    .order("order", { ascending: true });

  // Fetch progress for ALL those courses
  let courseProgressMap: Record<string, string> = {};
  if (student && programmeCourses) {
    const courseIds = programmeCourses.map(c => c.id);
    const { data: allProgress } = await supabase
      .from("student_progress")
      .select("course_id, status")
      .eq("student_id", student.id)
      .in("course_id", courseIds);
    
    allProgress?.forEach(p => courseProgressMap[p.course_id] = p.status);
  }

  // Lock Logic for the CURRENT course
  let isLocked = false;
  let lockReason = "";

  if (course.order > 1 && course.programme_id) {
    const prevCourse = programmeCourses?.find(c => c.order === course.order - 1);
    if (prevCourse) {
      if (courseProgressMap[prevCourse.id] !== 'completed') {
        isLocked = true;
        lockReason = "Complete the previous course in this school first.";
      }
    }
  }

  // Fetch the NEXT course in the sequence
  let nextCourse = null;
  if (course.programme_id) {
    const { data: nc } = await supabase
      .from("courses")
      .select("id")
      .eq("programme_id", course.programme_id)
      .eq("order", course.order + 1)
      .single();
    nextCourse = nc;
  }

  const isEnrolled = !!progress; 
  const lessonDone = progress?.lesson_completed;
  const testPassed = progress?.status === 'completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/academy/courses" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Programme
      </Link>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="bg-ink text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 90% 20%, rgba(1,112,61,0.45), transparent 45%)" }} />
          <div className="relative z-10">
            <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">COURSE {course.order}</span>
            <h1 className="font-display font-semibold text-[clamp(24px,3vw,34px)] leading-tight">{course.title}</h1>
          </div>
        </div>

        {course.intro_video_url && (
          <div className="mb-6 aspect-video bg-paper rounded-site overflow-hidden border border-ink/10">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${course.intro_video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/)?.[1]}`} 
              title="Course Introduction" 
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="p-8 space-y-6">
          <p className="text-slate leading-relaxed">{course.description || "Course description coming soon."}</p>

          {/* School Roadmap UI */}
          {programmeCourses && programmeCourses.length > 0 && (
            <div className="bg-paper rounded-site p-5 border border-ink/5">
              <h3 className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate mb-4 flex items-center gap-2">
                Programme Roadmap
              </h3>
              <div className="space-y-3">
                {programmeCourses.map((c: any) => {
                  const cStatus = courseProgressMap[c.id] || 'locked';
                  const isActive = c.id === courseId;
                  const canVisit = cStatus === 'completed' || cStatus === 'unlocked';

                  return (
                    <div key={c.id} className={`flex items-center gap-3 p-2 rounded-site transition-colors ${isActive ? 'bg-white shadow-sm' : ''}`}>
                      <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 border-2 ${
                        cStatus === 'completed' ? 'bg-emerald border-emerald text-white' :
                        cStatus === 'unlocked' ? 'border-orange text-orange' : 'border-slate/30 text-slate/40'
                      }`}>
                        {cStatus === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                         cStatus === 'unlocked' ? <PlayCircle className="w-3.5 h-3.5" /> : 
                         <Lock className="w-3 h-3" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] font-medium leading-tight ${isActive ? 'text-ink' : cStatus === 'completed' ? 'text-emerald' : 'text-slate'}`}>
                          {c.title}
                        </div>
                      </div>

                      {canVisit && !isActive && (
                        <Link 
                          href={`/academy/courses/${c.id}`}
                          className="text-[11px] font-mono uppercase tracking-wide text-orange hover:underline"
                        >
                          View
                        </Link>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-mono uppercase tracking-wide bg-orange/10 text-orange px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
              <p className="text-slate text-xs mt-1">You can review this lesson anytime, or proceed to the next course.</p>
            </div>
          )}

          {/* Action Buttons Logic */}
          {!isLocked && (
            <div className="space-y-3">
              {!isEnrolled ? (
                <form action={enrollCourse.bind(null, course.id)}>
                  <button type="submit" className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm">
                    Start This Course
                  </button>
                </form>
              ) : testPassed ? (
                <div className="flex flex-col gap-2">
                  {/* Continue to Next Course Button */}
                  {nextCourse ? (
                    <Link href={`/academy/courses/${nextCourse.id}`} className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm flex items-center justify-center gap-2">
                      Continue to Next Course <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link href="/academy/courses" className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm flex items-center justify-center gap-2">
                      View Programme Progress <CheckCircle className="w-4 h-4" />
                    </Link>
                  )}
                  {/* Review Lesson Button */}
                  <Link href={`/academy/courses/${courseId}/learn`} className="w-full bg-white border border-ink/20 text-ink font-bold py-3 rounded-site hover:bg-paper transition-colors text-sm flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Review Lesson
                  </Link>
                </div>
              ) : !lessonDone ? (
                <Link href={`/academy/courses/${courseId}/learn`} className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Continue Lesson
                </Link>
              ) : (
                <Link href={`/academy/courses/${courseId}/test`} className="w-full bg-ink text-white font-bold py-3 rounded-site hover:bg-forest transition-colors text-sm flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Take Assessment
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}