export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "text-emerald-700 bg-emerald-100 border-emerald-200";
    case "negative":
      return "text-red-700 bg-red-100 border-red-200";
    case "neutral":
      return "text-slate-700 bg-slate-100 border-slate-200";
    default:
      return "text-slate-700 bg-slate-100 border-slate-200";
  }
};

export const getPriorityColor = (priority) => {
  return priority === "urgent"
    ? "text-red-700 bg-red-100 border-red-200"
    : "text-blue-700 bg-blue-100 border-blue-200";
};
