"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Trash2, Repeat } from "lucide-react";

interface Donation {
  id: string;
  donor: string;
  amount: number;
  method: string;
  date: string;
  status: string;
  created_at: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [donor, setDonor] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Received");

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("date", { ascending: false });
    if (data) setDonations(data);
    setLoading(false);
  }

  async function addDonation(e: React.FormEvent) {
    e.preventDefault();
    if (!donor || !amount) return;

    const supabase = createClient();
    const { error } = await supabase.from("donations").insert([{
      donor, amount: Number(amount), method,
      date: date || new Date().toISOString().slice(0, 10), status,
    }]);

    if (error) {
      alert("Error: " + error.message);
      console.error("Insert error:", error);
      return;
    }

    setDonor(""); setAmount(""); setDate(""); setShowForm(false);
    loadDonations();
  }


  async function toggleStatus(id: string, current: string) {
    const newStatus = current === "Received" ? "Pending" : "Received";
    const supabase = createClient();
    await supabase.from("donations").update({ status: newStatus }).eq("id", id);
    loadDonations();
  }

  async function deleteDonation(id: string) {
    if (!confirm("Delete this donation record?")) return;
    const supabase = createClient();
    await supabase.from("donations").delete().eq("id", id);
    loadDonations();
  }

  function naira(n: number) {
    return "₦" + n.toLocaleString("en-NG");
  }

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
          Accountability
        </span>
        <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
          Donations Ledger
        </h1>
        <p className="text-[13.5px] text-slate mt-1">
          Every contribution logged before it&apos;s spent.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h3 className="font-display font-semibold text-[16px]">
            Donations
            <span className="font-mono text-[11.5px] text-slate ml-2 font-normal">
              {donations.length} record{donations.length !== 1 && "s"}
            </span>
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            + Log Donation
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={addDonation} className="px-5 py-4 bg-paper border-b border-ink/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Donor Name</label>
                <input
                  value={donor}
                  onChange={(e) => setDonor(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  required
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  <option>Bank Transfer</option>
                  <option>Card</option>
                  <option>Cash</option>
                  <option>Wire</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  <option>Received</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark">
                  Save
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-ink/13 px-5 py-2.5 rounded-site text-[13px] font-semibold text-slate hover:bg-paper">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">💰</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">No donations yet</div>
            <div className="text-[12.5px] text-slate">Use &apos;Log Donation&apos; to add the first entry.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Donor</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.id} className="border-b border-ink/6 hover:bg-orange/[0.02]">
                    <td className="px-5 py-3.5 font-mono text-[12px] text-slate">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-5 py-3.5 text-[13.5px]">{d.donor}</td>
                    <td className="px-5 py-3.5 font-mono font-semibold">{naira(d.amount)}</td>
                    <td className="px-5 py-3.5 text-[13px]">{d.method}</td>
                    <td className="px-5 py-3.5 font-mono text-[12px]">
                      {new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                        d.status === "Received"
                          ? "bg-emerald/10 text-emerald"
                          : "bg-orange/12 text-orange-dark"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleStatus(d.id, d.status)}
                          className="p-1.5 text-slate hover:text-orange transition-colors"
                          title="Toggle status"
                        >
                          <Repeat className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDonation(d.id)}
                          className="p-1.5 text-slate hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
