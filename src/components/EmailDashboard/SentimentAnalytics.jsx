
export function SentimentAnalytics({ analytics }) {
  const totalEmails = analytics?.total_emails ?? 0;
  const processedEmails = analytics?.processed_emails ?? 0;
  const unprocessedEmails = analytics?.unprocessed_emails ?? 0;

  return (
    <div className="sentiment-analytics mb-6">
      <h2>Sentiment Analytics</h2>
      <div>Total Emails: {totalEmails}</div>
      <div>Processed Emails: {processedEmails}</div>
      <div>Unprocessed Emails: {unprocessedEmails}</div>
    </div>
  );
}
