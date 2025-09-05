import sql from "@/app/api/utils/sql";

// Get list of emails with filtering and sorting
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const priority = url.searchParams.get('priority');
    const sentiment = url.searchParams.get('sentiment');
    const processed = url.searchParams.get('processed');
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    
    // Build dynamic query
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;
    
    if (priority) {
      whereConditions.push(`e.priority = $${paramIndex}`);
      params.push(priority);
      paramIndex++;
    }
    
    if (sentiment) {
      whereConditions.push(`e.sentiment = $${paramIndex}`);
      params.push(sentiment);
      paramIndex++;
    }
    
    if (processed !== null && processed !== undefined) {
      whereConditions.push(`e.processed = $${paramIndex}`);
      params.push(processed === 'true');
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? 
      'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Add limit and offset to params
    params.push(limit, offset);
    
    const query = `
      SELECT 
        e.*,
        ei.contact_phone,
        ei.alternate_email,
        ei.customer_requirements,
        ei.sentiment_indicators,
        ei.metadata,
        r.response_text,
        r.sent as response_sent,
        r.reviewed as response_reviewed
      FROM emails e
      LEFT JOIN extracted_info ei ON e.id = ei.email_id
      LEFT JOIN responses r ON e.id = r.email_id
      ${whereClause}
      ORDER BY 
        CASE WHEN e.priority = 'urgent' THEN 1 ELSE 2 END,
        e.received_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const emails = await sql(query, params);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM emails e
      ${whereClause}
    `;
    
    const countResult = await sql(countQuery, params.slice(0, -2)); // Remove limit and offset
    const total = parseInt(countResult[0].total);
    
    return Response.json({
      success: true,
      emails: emails,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch emails'
    }, { status: 500 });
  }
}