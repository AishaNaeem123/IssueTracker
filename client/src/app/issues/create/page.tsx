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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2F3E27] font-medium flex flex-col">
      {/* Header */}
      <header className="bg-[#8CA68A] text-white py-6 px-8 shadow-md flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Issue</h1>
        <button
          onClick={() => router.push("/issues")}
          className="bg-white text-[#4B5D49] font-medium px-5 py-2 rounded-lg hover:bg-[#F0EFE9] transition cursor-pointer"
        >
          ← Back to Issues
        </button>
      </header>

      {/* Form Section */}
      <main className="flex-1 flex justify-center items-start py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl border border-[#EDEBE6] p-8 w-full max-w-lg"
        >
          <h2 className="text-xl font-semibold text-[#4B5D49] mb-6">Issue Details</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Title</label>
            <input
              placeholder="Enter issue title"
              className="border border-[#DAD7CD] p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8CA68A] outline-none transition text-[15px]"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Description</label>
            <textarea
              placeholder="Describe the issue..."
              className="border border-[#DAD7CD] p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8CA68A] outline-none transition text-[15px]"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Priority</label>
            <div className="relative">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="border border-[#DAD7CD] bg-white px-4 py-3 rounded-lg text-[15px] focus:ring-2 focus:ring-[#8CA68A] outline-none transition appearance-none w-full pr-10"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
                ▼
              </span>
            </div>
          </div>

          {/* Assignee */}
          <div className="mb-4">
            <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Assignee</label>
            <div className="relative">
              <select
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="border border-[#DAD7CD] bg-white px-4 py-3 rounded-lg text-[15px] focus:ring-2 focus:ring-[#8CA68A] outline-none transition appearance-none w-full pr-10"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
                ▼
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#8CA68A] text-white py-3 rounded-lg hover:bg-[#7A9577] transition font-semibold text-lg shadow-md cursor-pointer"
          >
            {loading ? "Creating..." : "Create Issue"}
          </button>
        </form>
      </main>
    </div>
  );
}
