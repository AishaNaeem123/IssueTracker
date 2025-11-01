"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { apiGet } from "@/lib/api";

export default function IssuesPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) router.push("/");
    fetchIssues();
  }, [status, priority]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      let query = "";
      if (status || priority) {
        query = `?${status ? `status=${status}` : ""}${priority ? `&priority=${priority}` : ""}`;
      }
      const data = await apiGet(`/issues${query}`);
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2F3E27] font-medium">
      {/* Header */}
      <header className="bg-[#8CA68A] text-white py-6 px-8 flex flex-col md:flex-row md:items-center md:justify-between shadow-md">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight">Issue Dashboard</h1>
          <p className="text-white/90 text-3xl mt-1">
            Welcome back, <span className="font-semibold">{user?.name}</span> 
          </p>
        </div>
        <button
          onClick={() => router.push("/issues/create")}
          className="mt-4 md:mt-0 bg-white text-[#4B5D49] font-medium px-6 py-2 rounded-lg hover:bg-[#F0EFE9] transition cursor-pointer"
        >
          + Create Issue
        </button>
      </header>

      {/* Filters */}
      <section className="p-6 flex flex-wrap gap-3 justify-start items-center bg-white/70 backdrop-blur-sm border-b border-[#E9E8E3]">
       {/* Status Filter */}
<div className="relative">
  <select
    onChange={(e) => setStatus(e.target.value)}
    value={status}
    className="border border-[#DAD7CD] bg-white px-4 py-3 rounded-lg text-[15px] focus:ring-2 focus:ring-[#8CA68A] outline-none transition min-w-[180px] appearance-none shadow-sm pr-10"
  >
    <option value="">All Statuses</option>
    <option>Open</option>
    <option>In Progress</option>
    <option>Resolved</option>
  </select>
  {/* Custom arrow */}
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
    ▼
  </span>
</div>

{/* Priority Filter */}
<div className="relative">
  <select
    onChange={(e) => setPriority(e.target.value)}
    value={priority}
    className="border border-[#DAD7CD] bg-white px-4 py-3 rounded-lg text-[15px] focus:ring-2 focus:ring-[#8CA68A] outline-none transition min-w-[180px] appearance-none shadow-sm pr-10"
  >
    <option value="">All Priorities</option>
    <option>Low</option>
    <option>Medium</option>
    <option>High</option>
  </select>
  {/* Custom arrow */}
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
    ▼
  </span>
</div>


        <button
          onClick={() => {
            setStatus("");
            setPriority("");
          }}
          className="text-[#4B5D49] underline text-[14px] hover:text-[#8CA68A] transition cursor-pointer"
        >
          Clear Filters
        </button>
      </section>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[#8CA68A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="p-8 flex justify-center">
          <div className="w-full max-w-7xl">
            {issues.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg font-medium">No issues found.</p>
                <p className="text-sm text-gray-400">Try changing filters or create a new issue.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-sm bg-white border border-[#EDEBE6]">
                <table className="w-full border-collapse text-[15px]">
                  <thead className="bg-[#F2F1EC] text-[#4B5D49] uppercase text-[13px] tracking-wide">
                    <tr>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Priority</th>
                      <th className="p-3 text-left">Assignee</th>
                      <th className="p-3 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((i) => (
                      <tr
                        key={i._id}
                        onClick={() => router.push(`/issues/${i._id}`)}
                        className="border-t border-[#EFEFEA] hover:bg-[#F9F8F5] transition cursor-pointer"
                      >
                        <td className="p-3 font-medium text-[#2F3E27]">{i.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              i.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : i.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {i.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              i.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : i.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {i.priority}
                          </span>
                        </td>
                        <td className="p-3">{i.assignee?.name || "Unassigned"}</td>
                        <td className="p-3 text-[13px] text-gray-500">
                          {new Date(i.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
