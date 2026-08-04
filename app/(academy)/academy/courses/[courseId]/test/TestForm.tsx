"use client";

import { useState } from "react";
import { submitTest } from "../action";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export function TestForm({ questions, courseId }: { questions: Question[]; courseId: string }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Create the Server Action wrapper
    const action = submitTest.bind(null, courseId);
    
    try {
      await action(formData);
      // The server action will revalidate the page, which will show the "Passed" state automatically!
    } catch (error: any) {
      alert(error.message || "Failed to submit test.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <p className="text-slate text-sm">Answer all {questions.length} questions. You need 75% to pass.</p>
      
      {questions.map((q, index) => (
        <div key={q.id} className="pb-6 border-b border-ink/10 last:border-0">
          <p className="font-semibold text-ink text-sm mb-3">{index + 1}. {q.question_text}</p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, optIndex) => (
              <label 
                key={optIndex} 
                className="flex items-center gap-3 text-left px-4 py-2.5 rounded-site border text-sm transition-colors cursor-pointer hover:border-orange hover:bg-orange/5 has-[:checked]:border-orange has-[:checked]:bg-orange/10 has-[:checked]:font-medium"
              >
                <input 
                  type="radio" 
                  name={q.id} 
                  value={optIndex} 
                  required 
                  className="accent-orange w-4 h-4"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button 
        type="submit" 
        disabled={submitting}
        className="w-full bg-orange text-white font-bold py-3 rounded-site hover:bg-orange-dark transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Grading...</> : "Submit Assessment"}
      </button>
    </form>
  );
}