import { RefreshCw } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
        </div>
        <p className="text-slate-600 font-medium">Loading dashboard...</p>
        <p className="text-slate-400 text-sm mt-1">
          Getting your latest emails
        </p>
      </div>
    </div>
  );
}
