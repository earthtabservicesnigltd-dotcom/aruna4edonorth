"use server";

import { createServerSupabase } from "@/lib/server"; // Using @/lib/server
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Enroll in a course (with linear progression check)
export async function enrollCourse(courseId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect("/login-signup");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!student) throw new Error("Student profile not found.");

  // Check if previous course in the school is completed
  const { data: course } = await supabase
    .from("courses")
    .select("order, programme_id")
    .eq("id", courseId)
    .single();

  if (course && course.order > 1) {
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
        .eq("student_id", student.id)
        .eq("course_id", prevCourse.id)
        .single();

      if (!prevProgress || prevProgress.status !== 'completed') {
        throw new Error("Complete the previous course in this school first.");
      }
    }
  }

  // Unlock the course for the student
  const { error } = await supabase
    .from("student_progress")
    .upsert({
      student_id: student.id,
      course_id: courseId,
      status: 'unlocked',
    }, { onConflict: "student_id,course_id" });

  if (error) throw new Error(error.message);
  
  revalidatePath(`/academy/courses/${courseId}`);
}

// Mark Lesson as Completed
export async function completeLesson(courseId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect("/login-signup");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!student) throw new Error("Student profile not found.");

  const { error } = await supabase
    .from("student_progress")
    .update({ lesson_completed: true })
    .eq("student_id", student.id)
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);
  
  revalidatePath(`/academy/courses/${courseId}/learn`);
}

// Submit Test and Grade
export async function submitTest(courseId: string, formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect("/login-signup");

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!student) throw new Error("Student profile not found.");

  // 1. Fetch the correct answers securely
  const { data: questions } = await supabase
    .from("questions")
    .select("id, correct_option_index")
    .eq("course_id", courseId);

  if (!questions || questions.length === 0) throw new Error("No questions found for this course.");

  // 2. Grade the test
  let score = 0;
  questions.forEach((q) => {
    const userAnswer = formData.get(q.id);
    if (parseInt(userAnswer as string) === q.correct_option_index) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 75;

  // 3. Update student progress
  const { data: course } = await supabase.from("courses").select("programme_id").eq("id", courseId).single();
  
  const { error } = await supabase
    .from("student_progress")
    .update({
      status: passed ? 'completed' : 'unlocked',
      score: percentage,
      completed_at: passed ? new Date().toISOString() : null,
    })
    .eq("student_id", student.id)
    .eq("course_id", courseId);

  if (error) throw new Error(error.message);

  // 4. Issue certificate if all courses in school are passed
  if (passed && course?.programme_id) {
    const { data: schoolCourses } = await supabase
      .from("courses")
      .select("id")
      .eq("programme_id", course.programme_id);

    const courseIds = schoolCourses?.map(c => c.id) || [];

    const { data: passedCourses } = await supabase
      .from("student_progress")
      .select("course_id")
      .eq("student_id", student.id)
      .in("course_id", courseIds)
      .eq("status", "completed");

    if (passedCourses && passedCourses.length === courseIds.length) {
      const certId = `MAI-${course.programme_id}-${student.id.slice(0, 8)}`;
      
      await supabase
        .from("certificates")
        .upsert({
          student_id: student.id,
          programme_id: course.programme_id,
          certificate_id: certId,
          status: "Issued",
        }, { onConflict: "student_id,programme_id" });
    }
  }

  revalidatePath(`/academy/courses/${courseId}/test`);
}