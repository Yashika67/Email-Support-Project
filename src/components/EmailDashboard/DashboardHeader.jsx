import { Mail, RefreshCw, MessageSquare, Database } from "lucide-react";

export function DashboardHeader({
  onFetchEmails,
  onRefresh,
  onBulkProcess,
  onLoadSampleData,
  processing,
  loading,
  selectedCount,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Email Support Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and analyze customer support emails
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {selectedCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 font-medium">
                  {selectedCount} selected
                </span>
                <button
                  onClick={onBulkProcess}
                  disabled={processing}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Process Selected</span>
                </button>
              </div>
            )}
            <button
              onClick={onLoadSampleData}
              disabled={processing}
              className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 flex items-center space-x-2 shadow-md transition-all transform hover:scale-105"
            >
              <Database className="w-4 h-4" />
              <span>Load Sample Data</span>
            </button>
            <button
              onClick={onFetchEmails}
              disabled={processing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center space-x-2 shadow-md transition-all transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Fetch Emails</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="bg-white/80 backdrop-blur-sm text-slate-700 px-4 py-2.5 rounded-lg hover:bg-white border border-slate-200 disabled:opacity-50 flex items-center space-x-2 shadow-sm transition-all"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
