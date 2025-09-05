"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export function useEmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sortBy, setSortBy] = useState("received_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Don"t set loading to true on auto-refresh, only on initial load
      if (!analytics) {
        setLoading(true);
      }
      const [emailsResponse, analyticsResponse] = await Promise.all([
        fetch("/api/emails/list"),
        fetch("/api/analytics"),
      ]);

      if (!emailsResponse.ok) throw new Error("Failed to fetch emails");
      if (!analyticsResponse.ok) throw new Error("Failed to fetch analytics");

      const emailsData = await emailsResponse.json();
      const analyticsData = await analyticsResponse.json();

      setEmails(emailsData.emails || []);
      setAnalytics(analyticsData.analytics);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [analytics]);

  const fetchSampleEmails = useCallback(async () => {
    try {
      setProcessing(true);
      const response = await fetch("/api/emails/fetch", { method: "POST" });
      if (!response.ok) throw new Error("Failed to fetch emails");
      await fetchData();
      showNotification("New emails fetched successfully!");
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails");
    } finally {
      setProcessing(false);
    }
  }, [fetchData, showNotification]);

  const rawProcessEmail = useCallback(async (emailId) => {
    // This function is for bulk processing, so it throws errors for the caller to handle.
    setProcessing(true);
    try {
      const analyzeResponse = await fetch("/api/emails/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
      });
      if (!analyzeResponse.ok) throw new Error("Analysis failed");

      const generateResponse = await fetch("/api/emails/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
      });
      if (!generateResponse.ok) throw new Error("Response generation failed");
    } catch (e) {
      throw e;
    } finally {
      setProcessing(false);
    }
  }, []);

  const processEmail = useCallback(
    async (emailId) => {
      // This function is for single email processing, with self-contained error handling.
      try {
        setProcessing(true);
        await rawProcessEmail(emailId);
        await fetchData();
        showNotification("Email processed and response generated!");
      } catch (error) {
        console.error("Error processing email:", error);
        setError("Failed to process email");
      } finally {
        setProcessing(false);
      }
    },
    [rawProcessEmail, fetchData, showNotification],
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const sortedEmails = useMemo(() => {
    const filtered = emails.filter((email) => {
      let passesFilter = true;
      if (filter === "urgent") passesFilter = email.priority === "urgent";
      if (filter === "pending") passesFilter = !email.processed;
      if (filter === "resolved") passesFilter = email.processed;
      if (filter === "positive") passesFilter = email.sentiment === "positive";
      if (filter === "negative") passesFilter = email.sentiment === "negative";

      const lowerSearchTerm = searchTerm.toLowerCase();
      const passesSearch =
        !searchTerm ||
        email.subject.toLowerCase().includes(lowerSearchTerm) ||
        email.sender_email.toLowerCase().includes(lowerSearchTerm) ||
        email.body.toLowerCase().includes(lowerSearchTerm);

      return passesFilter && passesSearch;
    });

    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "priority":
          aVal = a.priority === "urgent" ? 1 : 0;
          bVal = b.priority === "urgent" ? 1 : 0;
          break;
        case "sentiment":
          const sentimentOrder = { negative: 0, neutral: 1, positive: 2 };
          aVal = sentimentOrder[a.sentiment] || 1;
          bVal = sentimentOrder[b.sentiment] || 1;
          break;
        case "sender_email":
          aVal = a.sender_email.toLowerCase();
          bVal = b.sender_email.toLowerCase();
          break;
        default:
          aVal = new Date(a.received_at);
          bVal = new Date(b.received_at);
      }

      if (sortOrder === "desc") {
        return aVal < bVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
  }, [emails, filter, searchTerm, sortBy, sortOrder]);

  return {
    emails,
    analytics,
    loading,
    processing,
    error,
    notification,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    sortedEmails,
    fetchData,
    fetchSampleEmails,
    processEmail,
    rawProcessEmail,
    showNotification,
  };
}
