"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiGet } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

export default function CreateIssue() {
  const router = useRouter();
  const { user } = useUserStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
    assignee: "",
  });

  useEffect(() => {
    if (!user) router.push("/");
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await apiGet("/users");
    setUsers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await apiPost("/issues", form);
    router.push("/issues");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "#E74C3C";
      case "Medium": return "#F39C12";
      case "Low": return "#27AE60";
      default: return "#8CA68A";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAF9F6] to-[#F0EFE9] text-[#2F3E27] font-medium flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-linear-to-r from-[#8CA68A] to-[#7A9577] text-white py-8 px-8 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Issue</h1>
            <p className="text-white/80 text-sm mt-1">Add a new task to your project tracker</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/issues")}
          className="bg-white/20 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 cursor-pointer border border-white/30 flex items-center space-x-2 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Issues</span>
        </button>
      </header>

      {/* Enhanced Form Section */}
      <main className="flex-1 flex justify-center items-start py-12 px-4">
        <div className="relative w-full max-w-2xl">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#8CA68A]/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#7A9577]/10 rounded-full blur-xl"></div>
          
          <form
            onSubmit={handleSubmit}
            className="relative bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/60 p-8 w-full transform hover:shadow-xl transition-all duration-300"
          >
            {/* Form Header */}
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-[#EDEBE6]">
              <div className="p-2 bg-linear-to-r from-[#8CA68A] to-[#7A9577] rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#4B5D49]">Issue Details</h2>
                <p className="text-[#6B7A66] text-sm mt-1">Fill in the details for the new issue</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-[#4B5D49] mb-3  items-center space-x-2">
                  <span>Title</span>
                  <span className="text-[#E74C3C]">*</span>
                </label>
                <input
                  placeholder="What's the issue about?"
                  className="border-2 border-[#EDEBE6] bg-white/50 p-4 w-full rounded-xl focus:ring-2 focus:ring-[#8CA68A] focus:border-[#8CA68A] outline-none transition-all duration-300 text-[15px] placeholder-[#9CA3AF] group-hover:border-[#8CA68A]/50"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-[#4B5D49] mb-3">Description</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  className="border-2 border-[#EDEBE6] bg-white/50 p-4 w-full rounded-xl focus:ring-2 focus:ring-[#8CA68A] focus:border-[#8CA68A] outline-none transition-all duration-300 text-[15px] placeholder-[#9CA3AF] resize-none group-hover:border-[#8CA68A]/50"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="flex justify-between text-xs text-[#6B7A66] mt-2">
                  <span>Provide as much detail as possible</span>
                  <span>{form.description.length}/500</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div className="group">
                  <label className="block text-sm font-semibold text-[#4B5D49] mb-3">Priority</label>
                  <div className="relative">
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="border-2 border-[#EDEBE6] bg-white/50 px-4 py-3.5 rounded-xl text-[15px] focus:ring-2 focus:ring-[#8CA68A] focus:border-[#8CA68A] outline-none transition-all duration-300 appearance-none w-full pr-12 group-hover:border-[#8CA68A]/50"
                      
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
                      ▼
                    </span>
                  
                  </div>
                </div>

                {/* Assignee */}
                <div className="group">
                  <label className="block text-sm font-semibold text-[#4B5D49] mb-3">Assignee</label>
                  <div className="relative">
                    <select
                      value={form.assignee}
                      onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                      className="border-2 border-[#EDEBE6] bg-white/50 px-4 py-3.5 rounded-xl text-[15px] focus:ring-2 focus:ring-[#8CA68A] focus:border-[#8CA68A] outline-none transition-all duration-300 appearance-none w-full pr-12 group-hover:border-[#8CA68A]/50"
                    >
                      <option value="">Select assignee</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
                      ▼
                    </span>
                   
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-linear-to-r from-[#8CA68A] to-[#7A9577] text-white py-4 rounded-xl hover:from-[#7A9577] hover:to-[#6A8567] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Issue...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Create Issue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}