const [category, setCategory] = useState("all");

// ✅ Updated filtering
const filteredEmails = emails
  .filter((email) => {
    if (filter === "processed") return email.processed;
    if (filter === "unprocessed") return !email.processed;
    return true;
  })
  .filter((email) => {
    if (category === "positive") return email.sentiment === "positive";
    if (category === "neutral") return email.sentiment === "neutral";
    if (category === "negative") return email.sentiment === "negative";
    if (category === "high") return email.priority === "high";
    if (category === "medium") return email.priority === "medium";
    if (category === "low") return email.priority === "low";
    return true;
  })
  .filter((email) =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    }
    if (sortBy === "subject") {
      return sortOrder === "desc"
        ? b.subject.localeCompare(a.subject)
        : a.subject.localeCompare(b.subject);
    }
    return 0;
  });
