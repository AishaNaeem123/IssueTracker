"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";

export default function IssueDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [issue, setIssue] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // local editable fields
  const [status, setStatus] = useState<string>("Open");
  const [assignee, setAssignee] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [iss, team] = await Promise.all([apiGet(`/issues/${id}`), apiGet(`/users`)]);
        setIssue(iss);
        setUsers(team);
        setStatus(iss.status);
        setAssignee(iss.assignee?._id || "");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isDirty = useMemo(() => {
    if (!issue) return false;
    const originalAssignee = issue.assignee?._id || "";
    return status !== issue.status || assignee !== originalAssignee;
  }, [issue, status, assignee]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const patch: Record<string, any> = {};
      if (issue.status !== status) patch.status = status;
      const originalAssignee = issue.assignee?._id || "";
      if (originalAssignee !== assignee) patch.assignee = assignee || "";
      if (Object.keys(patch).length > 0) {
        await apiPatch(`/issues/${id}`, patch);
      }
      router.push("/issues");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8CA68A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#2F3E27] p-8">
        <p className="text-center text-gray-600">Issue not found.</p>
      </div>
    );
  }

  const selectClass =
    "border border-[#DAD7CD] bg-white text-base leading-normal h-11 px-4 pr-10 rounded-lg " +
    "focus:ring-2 focus:ring-[#8CA68A] outline-none transition appearance-none w-full " +
    "cursor-pointer shadow-sm";

  const SelectWrap = ({ children }: { children: React.ReactNode }) => (
    <div className="relative inline-block w-full">
      {children}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D49] pointer-events-none text-sm">
        ▼
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2F3E27] font-medium flex flex-col">
      {/* Header */}
      <header className="bg-[#8CA68A] text-white py-6 px-8 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Issue Details</h1>
          <p className="text-white/90 text-sm mt-1">Update status or reassign this issue.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/issues")}
            className="bg-white text-[#4B5D49] font-medium px-5 py-2 rounded-lg hover:bg-[#F0EFE9] transition cursor-pointer"
          >
            ← Back
          </button>
          
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl border border-[#EDEBE6] p-8">
          {/* Title + Meta */}
          <div className="mb-6">
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#2F3E27]">{issue.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-[13px] text-gray-500">
              <span className="px-2 py-1 rounded-full bg-[#F2F1EC] text-[#4B5D49]">
                Created: {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              {issue.updatedAt && (
                <span className="px-2 py-1 rounded-full bg-[#F2F1EC] text-[#4B5D49]">
                  Updated: {new Date(issue.updatedAt).toLocaleDateString()}
                </span>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  issue.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : issue.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                Priority: {issue.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {issue.description && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#4B5D49] mb-2">Description</h3>
              <p className="text-[15px] leading-relaxed text-[#475247] bg-[#FAF9F6] border border-[#EEEDE8] rounded-xl p-4">
                {issue.description}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Status</label>
              <SelectWrap>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClass}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </SelectWrap>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm text-[#4B5D49] mb-2 font-medium">Assignee</label>
              <SelectWrap>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className={selectClass}
                >
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </div>
          </div>

          {/* Bottom Save */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`px-6 py-3 rounded-lg font-semibold transition shadow-sm ${
                !isDirty || saving
                  ? "bg-[#C9D5C7] text-white cursor-not-allowed"
                  : "bg-[#8CA68A] text-white hover:bg-[#7A9577] cursor-pointer"
              }`}
            >
              {saving ? "Saving..." : "Save & Close"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
