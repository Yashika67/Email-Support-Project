import {
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const Card = ({ title, value, changeText, icon, color }) => {
  const Icon = icon;
  const colorClasses = {
    blue: {
      gradient: "from-white to-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
      bg: "bg-blue-100",
      value: "text-slate-900",
    },
    red: {
      gradient: "from-white to-red-50",
      border: "border-red-100",
      text: "text-red-600",
      bg: "bg-red-100",
      value: "text-red-600",
    },
    emerald: {
      gradient: "from-white to-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-600",
      bg: "bg-emerald-100",
      value: "text-emerald-600",
    },
    amber: {
      gradient: "from-white to-amber-50",
      border: "border-amber-100",
      text: "text-amber-600",
      bg: "bg-amber-100",
      value: "text-amber-600",
    },
  };
  const classes = colorClasses[color];

  return (
    <div
      className={`bg-gradient-to-br ${classes.gradient} p-6 rounded-xl shadow-sm border ${classes.border} hover:shadow-md transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`text-3xl font-bold ${classes.value} mt-1`}>{value}</p>
          <div className={`text-sm ${classes.text} mt-1 flex items-center`}>
            {changeText}
          </div>
        </div>
        <div className={`p-3 ${classes.bg} rounded-xl`}>
          <Icon className={`w-6 h-6 ${classes.text}`} />
        </div>
      </div>
    </div>
  );
};

export function AnalyticsCards({ analytics }) {
  const totalEmails = analytics?.total_emails ?? 0;
  const processedEmails = analytics?.processed_emails ?? 0;
  const unprocessedEmails = analytics?.unprocessed_emails ?? 0;

  return (
    <div className="analytics-cards grid grid-cols-3 gap-4 mb-6">
      <div className="card bg-white p-4 rounded-lg shadow">
        <h3>Total Emails</h3>
        <p>{totalEmails}</p>
      </div>
      <div className="card bg-white p-4 rounded-lg shadow">
        <h3>Processed Emails</h3>
        <p>{processedEmails}</p>
      </div>
      <div className="card bg-white p-4 rounded-lg shadow">
        <h3>Unprocessed Emails</h3>
        <p>{unprocessedEmails}</p>
      </div>
    </div>
  );
}

