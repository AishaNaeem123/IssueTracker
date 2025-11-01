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
    <div className="min-h-screen bg-linear-to-br from-[#FAF9F6] to-[#F0EFEB] text-[#2F3E27] font-medium">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-[#E9E8E3] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left Section - Branding & User Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-linear-to-r from-[#8CA68A] to-[#7A9577] rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">IF</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#2F3E27]">Issue Dashboard</h1>
                  <p className="text-[#6B7A67] text-sm">
                    Welcome, <span className="font-semibold text-[#4B5D49]">{user?.name}</span>
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4 pl-4 border-l border-[#E9E8E3]">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#4B5D49]">{issues.length}</div>
                  <div className="text-xs text-[#6B7A67] uppercase tracking-wide">Total</div>
                </div>
                <div className="w-px h-8 bg-[#E9E8E3]"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#8CA68A]">
                    {issues.filter(i => i.status === 'Open').length}
                  </div>
                  <div className="text-xs text-[#6B7A67] uppercase tracking-wide">Open</div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Create Issue Button */}
              <button
                onClick={() => router.push("/issues/create")}
                className="bg-linear-to-r from-[#8CA68A] to-[#7A9577] text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-[1.02] shadow-md cursor-pointer flex items-center space-x-2 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">+</span>
                <span className="text-sm">Create Issue</span>
              </button>

              {/* User Avatar */}
              <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-[#E9E8E3]">
                <div className="w-8 h-8 bg-linear-to-r from-[#8CA68A] to-[#7A9577] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-sm font-medium text-[#2F3E27]">{user?.name}</div>
                  <div className="text-xs text-[#6B7A67]">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Filters Section */}
      <section className="bg-linear-to-r from-[#F8FBF8] to-[#F2F7F2] border-b border-[#E9E8E3] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-[#4B5D49]">Filters</h2>
              <div className="w-px h-6 bg-[#8CA68A]/30 hidden sm:block"></div>
              <div className="text-sm text-[#6B7A67] hidden lg:block">
                Refine your issue list
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              {/* Status Filter */}
              <div className="relative z-50 inline-block min-w-[140px]">
  <select
    onChange={(e) => setStatus(e.target.value)}
    value={status}
    className="w-full border border-[#8CA68A]/30 bg-white px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#8CA68A]/40 focus:border-[#8CA68A] outline-none transition-all duration-200 appearance-none shadow-sm pr-8 cursor-pointer hover:border-[#8CA68A]/60 text-[#4B5D49]"
  >
    <option value="">All Statuses</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
  {/* Custom arrow */}
  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8CA68A] text-xs">
    ▼
  </span>
</div>


              {/* Priority Filter */}
              <div className="relative">
                <select
                  onChange={(e) => setPriority(e.target.value)}
                  value={priority}
                  className="border border-[#8CA68A]/30 bg-white px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-[#8CA68A]/40 focus:border-[#8CA68A] outline-none transition-all duration-200 min-w-[140px] appearance-none shadow-sm pr-8 cursor-pointer hover:border-[#8CA68A]/60 text-[#4B5D49]"
                >
                  <option value="">All Priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8CA68A] pointer-events-none text-xs">
                  ▼
                </span>
              </div>

              {(status || priority) && (
                <button
                  onClick={() => {
                    setStatus("");
                    setPriority("");
                  }}
                  className="text-[#6B7A67] font-medium px-3 py-2.5 rounded-lg hover:text-[#8CA68A] transition-all duration-200 hover:bg-[#F8FBF8] cursor-pointer text-sm border border-[#8CA68A]/30 hover:border-[#8CA68A]/50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#8CA68A] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#6B7A67] font-medium">Loading issues...</p>
          </div>
        </div>
      ) : (
        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {issues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#E9E8E3]">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-linear-to-r from-[#F8FBF8] to-[#F2F7F2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#8CA68A]/20">
                    <div className="w-8 h-8 bg-[#8CA68A] rounded-full opacity-30"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#4B5D49] mb-2">No issues found</h3>
                  <p className="text-[#6B7A67] mb-6">Try adjusting your filters or create a new issue to get started</p>
                  <button
                    onClick={() => router.push("/issues/create")}
                    className="bg-linear-to-r from-[#8CA68A] to-[#7A9577] text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-[1.02] shadow-md cursor-pointer"
                  >
                    Create New Issue
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#E9E8E3] overflow-hidden">
                {/* Table Header */}
                <div className="bg-linear-to-r from-[#8CA68A] to-[#7A9577] text-white px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-[13px] uppercase tracking-wide font-semibold">
                    <div className="col-span-5 pl-2">Issue Details</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center">Priority</div>
                    <div className="col-span-2 text-center">Assignee</div>
                    <div className="col-span-1 text-center">Date</div>
                  </div>
                </div>

                {/* Issue List */}
                <div className="divide-y divide-[#F0EFEA]">
                  {issues.map((issue) => (
                    <div
                      key={issue._id}
                      onClick={() => router.push(`/issues/${issue._id}`)}
                      className="px-6 py-4 hover:bg-linear-to-r hover:from-[#F8FBF8] hover:to-[#F2F7F2] transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-[#8CA68A]"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Issue Details */}
                        <div className="col-span-5">
                          <h3 className="font-semibold text-[#2F3E27] group-hover:text-[#4B5D49] transition-colors mb-1">
                            {issue.title}
                          </h3>
                          {issue.description && (
                            <p className="text-sm text-[#6B7A67] line-clamp-1">
                              {issue.description}
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 min-w-[100px] text-center border ${
                              issue.status === "Resolved"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : issue.status === "In Progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {issue.status}
                          </span>
                        </div>

                        {/* Priority */}
                        <div className="col-span-2 flex justify-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 min-w-20 text-center border ${
                              issue.priority === "High"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : issue.priority === "Medium"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {issue.priority}
                          </span>
                        </div>

                   {/* Assignee */}
            <div className="col-span-2 flex ">
            <div className="flex  space-x-2 max-w-full">
                <div className="w-8 h-8 bg-linear-to-r from-[#8CA68A] to-[#7A9577] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                {issue.assignee?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-[#4B5D49] font-medium truncate max-w-[100px]">
                {issue.assignee?.name || "Unassigned"}
                </span>
            </div>
            </div>

                        {/* Date */}
                        <div className="col-span-1 flex justify-center">
                          <span className="text-xs text-[#6B7A67] font-medium">
                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          </div>
        </main>
      )}
    </div>
  );
}