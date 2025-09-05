import { Archive, BarChart3 } from "lucide-react";

export function EmailDetails({ email }) {
  return (
    <div className="mt-6 pt-6 border-t border-slate-200 animate-in slide-in-from-top duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <Archive className="w-4 h-4 mr-2" />
            Email Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Category:</span>
              <span className="font-medium">
                {email.category || "Not categorized"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Contact Phone:</span>
              <span className="font-medium">
                {email.contact_phone || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Alternate Email:</span>
              <span className="font-medium">
                {email.alternate_email || "Not provided"}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Sentiment Analysis
          </h4>
          <p className="text-sm text-slate-700">
            {email.sentiment_indicators || "Not analyzed yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
