"use client";

const scheduleData = [
  { day: "Mon", type: "Individual", events: [{ time: "9:00 AM", title: "Foundations of Estate Management (recorded)", live: false }, { time: "TASK", title: "Reflection sheet + quizzes", live: false }] },
  { day: "Tue", type: "Group", events: [{ time: "10:00 AM · LIVE", title: "Property Identification & Market Analysis", live: true }, { time: "TASK", title: "Community assessment report", live: false }] },
  { day: "Wed", type: "Individual", events: [{ time: "9:00 AM", title: "Property Management & Client Relations", live: false }, { time: "TASK", title: "Management plan", live: false }] },
  { day: "Thu", type: "Group", events: [{ time: "10:00 AM · LIVE", title: "Development & Project Planning", live: true }, { time: "TASK", title: "Group development strategy", live: false }] },
  { day: "Fri", type: "Capstone", isToday: true, events: [{ time: "10:00 AM · LIVE", title: "Capstone project & housing solutions", live: true }, { time: "DUE", title: "Final capstone document", live: false }] },
  { day: "Sat", type: "Graduation", events: [{ time: "12:00 PM", title: "Capstone presentations", live: false }, { time: "4:00 PM · LIVE", title: "Virtual graduation & awards", live: true }] },
];

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">COHORT WEEK 28</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Weekly Schedule</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Every cohort follows the same rhythm: learn, collaborate, practise, build, prove, then graduate. All classes run on Google Meet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 bg-ink/10 border border-ink/10 rounded-site overflow-hidden">
        {scheduleData.map((d) => (
          <div key={d.day} className="bg-white flex flex-col">
            <div className={`p-4 text-center border-b border-ink/10 ${d.isToday ? 'bg-ink' : 'bg-paper'}`}>
              <strong className={`block font-display font-semibold text-[15px] ${d.isToday ? 'text-white' : 'text-ink'}`}>{d.day}</strong>
              <span className={`font-mono text-[9.5px] tracking-wide uppercase ${d.isToday ? 'text-orange' : 'text-slate'}`}>{d.type}</span>
            </div>
            <div className="p-4 flex-1 space-y-3">
              {d.events.map((e, i) => (
                <div key={i} className={`p-3 rounded-site ${e.live ? 'bg-orange/10' : 'bg-paper'}`}>
                  <div className="font-mono text-[10px] text-orange tracking-wide">{e.time}</div>
                  <div className="text-[12.5px] font-medium mt-1 leading-tight text-ink">{e.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}