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
    <div className="min-h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-linear-to-br from-[#91A48A] to-[#7E9577] text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-lg"></div>
          <div className="absolute bottom-20 right-16 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rotate-45"></div>
        </div>
        
        <div className="relative z-10 text-center w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-5xl xl:text-6xl font-bold mb-4 tracking-tight bg-linear-to-r from-white to-white/90 bg-clip-text text-transparent">
              IssueFlow
            </h1>
            <div className="w-20 h-1 bg-white/60 rounded-full mx-auto"></div>
          </div>
          
          <p className="text-lg xl:text-xl max-w-md text-white/90 leading-relaxed mb-8 mx-auto">
            Simplify your workflow.  
            Track, assign, and resolve — beautifully.
          </p>

          <div className="space-y-3 text-left max-w-sm mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span className="text-white/85 text-sm">Real-time issue tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span className="text-white/85 text-sm">Team collaboration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
              <span className="text-white/85 text-sm">Advanced analytics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-linear-to-br from-[#FAF9F6] to-[#F0EFEB] p-4 lg:p-6">
        <div className="w-full max-w-sm mx-auto my-auto">
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-[#4B5D49]">IssueFlow</h1>
            <div className="w-12 h-0.5 bg-[#91A48A] rounded-full mx-auto mt-2"></div>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-white/60"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-[#4B5D49] mb-1">
                Welcome Back
              </h2>
              <p className="text-[#6B7A67] text-sm">
                Sign in to continue your work
              </p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-medium text-[#4B5D49] mb-2 uppercase tracking-wide text-opacity-80">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-[#E9E8E3] bg-white/80 p-3 rounded-lg focus:ring-2 focus:ring-[#91A48A]/30 focus:border-[#91A48A] outline-none transition-all duration-200 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-[#4B5D49] mb-2 uppercase tracking-wide text-opacity-80">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#E9E8E3] bg-white/80 p-3 rounded-lg focus:ring-2 focus:ring-[#91A48A]/30 focus:border-[#91A48A] outline-none transition-all duration-200 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#91A48A] to-[#7E9577] cursor-pointer text-white py-3 rounded-lg hover:shadow-md transition-all duration-200 font-medium text-sm shadow-sm hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    "Login to Dashboard"
                  )}
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-[#7E9577] to-[#6A8064] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}