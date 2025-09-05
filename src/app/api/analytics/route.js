import sql from "@/app/api/utils/sql";

// Get analytics data for dashboard
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days")) || 7;

    // Get current stats for today
    const today = new Date().toISOString().split("T")[0];

    // Get email counts by category
    const emailStats = await sql`
      SELECT 
        COUNT(*) as total_emails,
        COUNT(CASE WHEN processed = true THEN 1 END) as emails_resolved,
        COUNT(CASE WHEN processed = false THEN 1 END) as emails_pending,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_emails,
        COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_sentiment,
        COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_sentiment,
        COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_sentiment
      FROM emails 
      WHERE DATE(received_at) >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    // Get daily breakdown for the chart
    const dailyStats = await sql`
      SELECT 
        DATE(received_at) as date,
        COUNT(*) as total_emails,
        COUNT(CASE WHEN processed = true THEN 1 END) as resolved,
        COUNT(CASE WHEN processed = false THEN 1 END) as pending,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent
      FROM emails 
      WHERE DATE(received_at) >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(received_at)
      ORDER BY date DESC
    `;

    // Get response time analytics
    const responseTimeStats = await sql`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (r.created_at - e.received_at))/3600) as avg_response_time_hours,
        COUNT(r.id) as total_responses,
        COUNT(CASE WHEN r.sent = true THEN 1 END) as sent_responses
      FROM emails e
      LEFT JOIN responses r ON e.id = r.email_id
      WHERE DATE(e.received_at) >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    // Get category breakdown
    const categoryStats = await sql`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_count,
        COUNT(CASE WHEN processed = true THEN 1 END) as resolved_count,
        ROUND(AVG(CASE 
          WHEN sentiment = 'positive' THEN 1
          WHEN sentiment = 'negative' THEN -1
          ELSE 0
        END)::numeric, 2) as avg_sentiment_score
      FROM emails 
      WHERE DATE(received_at) >= CURRENT_DATE - INTERVAL '${days} days'
        AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `;

    // Check if today's analytics already exist
    const existingAnalytics = await sql`
      SELECT id FROM analytics WHERE date_recorded = ${today}
    `;

    // Update or insert today's analytics
    if (existingAnalytics.length > 0) {
      await sql`
        UPDATE analytics SET
          total_emails = ${emailStats[0].total_emails},
          emails_resolved = ${emailStats[0].emails_resolved},
          emails_pending = ${emailStats[0].emails_pending},
          urgent_emails = ${emailStats[0].urgent_emails},
          positive_sentiment = ${emailStats[0].positive_sentiment},
          negative_sentiment = ${emailStats[0].negative_sentiment},
          neutral_sentiment = ${emailStats[0].neutral_sentiment}
        WHERE date_recorded = ${today}
      `;
    } else {
      await sql`
        INSERT INTO analytics (
          date_recorded, total_emails, emails_resolved, emails_pending, 
          urgent_emails, positive_sentiment, negative_sentiment, neutral_sentiment
        ) VALUES (
          ${today}, 
          ${emailStats[0].total_emails},
          ${emailStats[0].emails_resolved},
          ${emailStats[0].emails_pending},
          ${emailStats[0].urgent_emails},
          ${emailStats[0].positive_sentiment},
          ${emailStats[0].negative_sentiment},
          ${emailStats[0].neutral_sentiment}
        )
      `;
    }

    // Get historical analytics for trends
    const historicalData = await sql`
      SELECT 
        date_recorded,
        total_emails,
        emails_resolved,
        emails_pending,
        urgent_emails,
        positive_sentiment,
        negative_sentiment,
        neutral_sentiment
      FROM analytics 
      ORDER BY date_recorded DESC 
      LIMIT 30
    `;

    return Response.json({
      success: true,
      analytics: {
        overview: {
          total_emails: parseInt(emailStats[0].total_emails),
          emails_resolved: parseInt(emailStats[0].emails_resolved),
          emails_pending: parseInt(emailStats[0].emails_pending),
          urgent_emails: parseInt(emailStats[0].urgent_emails),
          positive_sentiment: parseInt(emailStats[0].positive_sentiment),
          negative_sentiment: parseInt(emailStats[0].negative_sentiment),
          neutral_sentiment: parseInt(emailStats[0].neutral_sentiment),
          resolution_rate:
            emailStats[0].total_emails > 0
              ? Math.round(
                  (emailStats[0].emails_resolved / emailStats[0].total_emails) *
                    100,
                )
              : 0,
          avg_response_time_hours: responseTimeStats[0].avg_response_time_hours
            ? Math.round(
                parseFloat(responseTimeStats[0].avg_response_time_hours) * 10,
              ) / 10
            : 0,
        },
        daily_breakdown: dailyStats.map((row) => ({
          date: row.date,
          total_emails: parseInt(row.total_emails),
          resolved: parseInt(row.resolved),
          pending: parseInt(row.pending),
          urgent: parseInt(row.urgent),
        })),
        response_times: {
          avg_response_time_hours: responseTimeStats[0].avg_response_time_hours
            ? parseFloat(responseTimeStats[0].avg_response_time_hours).toFixed(
                1,
              )
            : "0.0",
          total_responses: parseInt(responseTimeStats[0].total_responses || 0),
          sent_responses: parseInt(responseTimeStats[0].sent_responses || 0),
        },
        categories: categoryStats.map((row) => ({
          category: row.category,
          count: parseInt(row.count),
          urgent_count: parseInt(row.urgent_count),
          resolved_count: parseInt(row.resolved_count),
          resolution_rate:
            row.count > 0
              ? Math.round((row.resolved_count / row.count) * 100)
              : 0,
          avg_sentiment_score: parseFloat(row.avg_sentiment_score || 0),
        })),
        historical: historicalData.map((row) => ({
          date: row.date_recorded,
          total_emails: parseInt(row.total_emails),
          emails_resolved: parseInt(row.emails_resolved),
          emails_pending: parseInt(row.emails_pending),
          urgent_emails: parseInt(row.urgent_emails),
          positive_sentiment: parseInt(row.positive_sentiment),
          negative_sentiment: parseInt(row.negative_sentiment),
          neutral_sentiment: parseInt(row.neutral_sentiment),
        })),
        period_days: days,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch analytics",
      },
      { status: 500 },
    );
  }
}

// Update analytics manually
export async function POST(request) {
  try {
    // This endpoint can be called to refresh analytics data
    const response = await fetch(new URL("/api/analytics", request.url), {
      method: "GET",
    });

    return Response.json({
      success: true,
      message: "Analytics updated successfully",
    });
  } catch (error) {
    console.error("Error updating analytics:", error);
    return Response.json({
      success: false,
      error: "Failed to update analytics",
    });
  }
}
