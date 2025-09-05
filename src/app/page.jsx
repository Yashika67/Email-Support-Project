"use client";

import { useState, useCallback, useRef } from "react";
import { AlertTriangle } from "lucide-react";

import { LoadingScreen } from "@/components/EmailDashboard/LoadingScreen";
import { Notification } from "@/components/EmailDashboard/Notification";
import { DashboardHeader } from "@/components/EmailDashboard/DashboardHeader";
import { AnalyticsCards } from "@/components/EmailDashboard/AnalyticsCards";
import { SentimentAnalytics } from "@/components/EmailDashboard/SentimentAnalytics";
import { FilterBar } from "@/components/EmailDashboard/FilterBar";
import { EmailList } from "@/components/EmailDashboard/EmailList";

import Papa from "papaparse";

export default function EmailSupportDashboard() {
  const [emails, setEmails] = useState([]); // 📂 store CSV emails
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedEmails, setSelectedEmails] = useState([]);

  // hidden file input
  const fileInputRef = useRef(null);

  // ✅ Notification helper
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Trigger CSV picker
  const loadSampleData = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // ✅ Handle CSV Upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const csvData = results.data.map((row, index) => ({
          id: `csv-${index}`,
          subject: row.subject || "No Subject",
          sender: row.sender || "Unknown",
          body: row.body || "",
          date: row.date || new Date().toISOString(),
          processed: false,
        }));

        setEmails(csvData);
        setLoading(false);

        showNotification(`📂 Loaded ${csvData.length} emails from CSV`, "success");
      },
      error: () => {
        setError("Failed to parse CSV file");
        setLoading(false);
      },
    });
  };

  // ✅ Sort + Filter Emails
  const filteredEmails = emails
    .filter((email) => {
      if (filter === "processed") return email.processed;
      if (filter === "unprocessed") return !email.processed;
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

  // ✅ Bulk process simulation
  const bulkProcessEmails = async () => {
    const unprocessedSelected = selectedEmails.filter((id) => {
      const email = emails.find((e) => e.id === id);
      return email && !email.processed;
    });

    if (unprocessedSelected.length === 0) {
      showNotification("No unprocessed emails selected", "warning");
      return;
    }

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1000)); // fake delay

    const updated = emails.map((email) =>
      unprocessedSelected.includes(email.id)
        ? { ...email, processed: true }
        : email
    );

    setEmails(updated);
    setProcessing(false);
    setSelectedEmails([]);
    showNotification(`✅ Processed ${unprocessedSelected.length} emails!`, "success");
  };

  if (loading && emails.length === 0) {
    return <LoadingScreen />;
  }

  // ✅ Analytics object for SentimentAnalytics
  const analyticsData = {
    total_emails: emails.length,
    processed_emails: emails.filter((e) => e.processed).length,
    unprocessed_emails: emails.filter((e) => !e.processed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Notification notification={notification} />

      <DashboardHeader
        onFetchEmails={() => {}} // not used
        onRefresh={() => {}} // not used
        onBulkProcess={bulkProcessEmails}
        onLoadSampleData={loadSampleData}
        processing={processing}
        loading={loading}
        selectedCount={selectedEmails.length}
      />

      {/* hidden input for CSV */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* analytics cards */}
        <AnalyticsCards analytics={{ total: emails.length }} />

        {/* fixed SentimentAnalytics */}
        <SentimentAnalytics analytics={analyticsData} />

        <FilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
          emails={emails}
        />

        <EmailList
          emails={filteredEmails}
          totalEmailCount={emails.length}
          selectedEmails={selectedEmails}
          onEmailSelectionChange={setSelectedEmails}
          onProcessEmail={(id) =>
            setEmails((prev) =>
              prev.map((e) =>
                e.id === id ? { ...e, processed: true } : e
              )
            )
          }
          processing={processing}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
