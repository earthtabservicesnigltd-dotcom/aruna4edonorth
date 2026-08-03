"use client";

const assignments = [
  { title: "Personal Estate Management Reflection Sheet", type: "Individual", due: "Mon", status: "Submitted", course: "Monday · Individual" },
  { title: "Community Property Assessment Report", type: "Group", due: "Tue", status: "Submitted", course: "Tuesday · Group" },
  { title: "Individual Property Management Plan", type: "Individual", due: "Wed", status: "Submitted", course: "Wednesday · Individual" },
  { title: "Group Real Estate Development Strategy", type: "Group", due: "Thu", status: "Submitted", course: "Thursday · Group" },
  { title: "Final Capstone Project Document", type: "Group", due: "Today", status: "Due today", course: "Friday · Capstone" },
];

export default function AssignmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">ESTATE MANAGEMENT · WEEK 28</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Assignments</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Individual tasks land Monday and Wednesday, group work Tuesday and Thursday, and the capstone submission on Friday.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left font-mono text-[10.5px] uppercase tracking-wide text-slate bg-paper border-b border-ink/10">
              <th className="px-5 py-3.5 font-medium">Task</th>
              <th className="px-5 py-3.5 font-medium">Type</th>
              <th className="px-5 py-3.5 font-medium">Due</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-b border-ink/5 last:border-0 hover:bg-orange/[0.02]">
                <td className="px-5 py-4">
                  <div className="font-semibold text-[14px] text-ink">{a.title}</div>
                  <div className="text-[12px] text-slate mt-0.5">{a.course}</div>
                </td>
                <td className="px-5 py-4 text-[13px] text-slate">{a.type}</td>
                <td className="px-5 py-4 font-mono text-[12px] text-ink">{a.due}</td>
                <td className="px-5 py-4">
                  <span className={`font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-site ${
                    a.status === 'Submitted' ? 'bg-emerald/10 text-emerald' : 'bg-orange/12 text-orange-dark'
                  }`}>{a.status}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  {a.status === 'Submitted' ? (
                    <button className="px-4 py-2 border border-ink/10 rounded-site text-[13px] font-semibold text-ink hover:border-orange hover:text-orange transition-colors">View</button>
                  ) : (
                    <button className="px-4 py-2 bg-orange text-white rounded-site text-[13px] font-semibold hover:bg-orange-dark transition-colors">Upload</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}