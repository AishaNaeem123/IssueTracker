"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = await apiPost("/login", { name, email });
    setUser(user);
    router.push("/issues");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section — Branding */}
      <div className="md:w-1/2 flex flex-col justify-center items-center bg-[#91A48A] text-white p-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          IssueFlow
        </h1>
        <p className="text-xl md:text-2xl max-w-md text-center text-white/95 leading-relaxed">
          Simplify your workflow.  
          Track, assign, and resolve — beautifully.
        </p>
      </div>

      {/* Right Section — Login Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-[#FAF9F6]">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-md border border-[#E9E8E3]"
        >
          <h2 className="text-3xl font-bold text-center text-[#4B5D49] mb-8">
            Welcome Back 
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-[#4B5D49] mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#D1D1C7] p-3 rounded-lg focus:ring-2 focus:ring-[#91A48A] outline-none transition text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-[#4B5D49] mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#D1D1C7] p-3 rounded-lg focus:ring-2 focus:ring-[#91A48A] outline-none transition text-lg"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#91A48A] text-white py-3 rounded-lg hover:bg-[#7E9577] transition font-semibold text-lg shadow-md cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
