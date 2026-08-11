"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Loader2, Save, Trash2, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminCourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!courseId) return;
    fetchData();
  }, [courseId]);

  async function fetchData() {
    setLoading(true);
    
    // 1. Fetch Course Details
    const { data: courseData, error: courseErr } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();
      
    if (courseErr || !courseData) {
      toast.error("Course not found");
      router.push("/admin/academy/courses");
      return;
    }
    setCourse(courseData);
    setVideoUrl(courseData.intro_video_url || "");
    setContent(courseData.content || "");

    // 2. Fetch Assessment
    const { data: assessData } = await supabase
      .from("assessments")
      .select("*")
      .eq("course_id", courseId)
      .single();
      
    if (assessData) {
      setAssessment(assessData);
      // 3. Fetch Questions
      const { data: quesData } = await supabase
        .from("questions")
        .select("*")
        .eq("assessment_id", assessData.id)
        .order("created_at", { ascending: true });
      setQuestions(quesData || []);
    }
    
    setLoading(false);
  }

  async function handleSaveCourseDetails() {
    const { error } = await supabase
      .from("courses")
      .update({ 
        content: content, 
        intro_video_url: videoUrl 
      })
      .eq("id", courseId);
      
    if (error) return toast.error("Failed to save course details.");
    toast.success("Course details saved!");
  }

  async function handleSaveQuestion(qId: string, updatedQ: any) {
    const { error } = await supabase
      .from("questions")
      .update({
        question_text: updatedQ.question_text,
        options: updatedQ.options,
        correct_option_index: updatedQ.correct_option_index
      })
      .eq("id", qId);
      
    if (error) return toast.error("Failed to save question.");
    toast.success("Question saved!");
  }
  
  async function handleDeleteQuestion(qId: string) {
    if (!confirm("Are you sure you want to delete this question?")) return;
    const { error } = await supabase.from("questions").delete().eq("id", qId);
    if (error) return toast.error("Failed to delete question.");
    toast.success("Question deleted.");
    setQuestions(prev => prev.filter(q => q.id !== qId));
  }
  
  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options];
      newOptions[optIndex] = value;
      updated[qIndex].options = newOptions;
      return updated;
    });
  };

  if (loading || !course) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  // Extract YouTube video ID for embed preview
  const getYouTubeID = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : null;
  };
  const videoId = getYouTubeID(videoUrl);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/academy/courses" className="inline-flex items-center gap-2 text-[12px] text-slate hover:text-orange mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>
        <h1 className="font-display font-semibold text-[22px] text-ink">{course.title}</h1>
        <p className="text-[13.5px] text-slate mt-1">Edit content, videos, and assessments.</p>
      </div>

      {/* Section 1: Intro Video & Content */}
      <div className="bg-white border border-ink/10 rounded-site p-6 space-y-6">
        <h2 className="font-display font-semibold text-[17px] text-ink border-b border-ink/10 pb-3">Course Content</h2>
        
        <div>
          <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">YouTube Link (Intro Video)</label>
          <input 
            type="text" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2.5 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
          />
          {videoId && (
            <div className="mt-4 aspect-video bg-paper rounded-site overflow-hidden">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube preview" allowFullScreen></iframe>
            </div>
          )}
        </div>

        <div>
          <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Course HTML Content</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-ink/10 rounded-site text-[12.5px] bg-paper outline-none focus:border-orange font-mono"
            placeholder="<p>Enter HTML content here...</p>"
          />
        </div>

        <button 
          onClick={handleSaveCourseDetails} 
          className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Course Details
        </button>
      </div>

      {/* Section 2: Assessment Manager */}
      <div className="bg-white border border-ink/10 rounded-site p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-3">
          <h2 className="font-display font-semibold text-[17px] text-ink">Assessment Questions</h2>
          {assessment && (
            <span className="font-mono text-[10.5px] uppercase bg-orange/10 text-orange-dark px-2.5 py-1 rounded-site">
              {questions.length} Questions
            </span>
          )}
        </div>

        {!assessment ? (
          <p className="text-slate text-sm text-center py-4">No assessment created for this course yet.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="border border-ink/10 rounded-site p-4 space-y-4 bg-paper/50">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[12px] text-orange pt-2.5 shrink-0">Q{qIndex + 1}</span>
                  <textarea
                    value={q.question_text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIndex].question_text = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-3 py-2 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange resize-none"
                    rows={2}
                  />
                  <button onClick={() => handleDeleteQuestion(q.id)} className="text-slate/40 hover:text-red-500 p-1.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                  {q.options?.map((opt: string, optIndex: number) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        checked={q.correct_option_index === optIndex}
                        onChange={() => {
                          const updated = [...questions];
                          updated[qIndex].correct_option_index = optIndex;
                          setQuestions(updated);
                        }}
                        className="accent-orange w-4 h-4"
                      />
                      <input 
                        type="text" 
                        value={opt} 
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-site text-[13px] bg-white outline-none focus:border-orange ${
                          q.correct_option_index === optIndex ? 'border-emerald text-emerald font-medium' : 'border-ink/10'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleSaveQuestion(q.id, q)} 
                  className="text-[12px] text-forest hover:text-orange font-semibold flex items-center gap-1.5 ml-8"
                >
                  <Save className="w-3.5 h-3.5" /> Save Question
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}