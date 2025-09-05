import sql from "@/app/api/utils/sql";

// Send email response (in production, this would integrate with email sending service)
export async function POST(request) {
  try {
    const { responseId } = await request.json();
    
    // Get response and email details
    const responseData = await sql`
      SELECT r.*, e.sender_email, e.subject
      FROM responses r
      JOIN emails e ON r.email_id = e.id
      WHERE r.id = ${responseId} AND r.sent = false
    `;
    
    if (responseData.length === 0) {
      return Response.json({
        success: false,
        error: 'Response not found or already sent'
      }, { status: 404 });
    }
    
    const response = responseData[0];
    
    // In production, you would integrate with email service here
    // For demo purposes, we'll just mark it as sent
    console.log('Sending email response:', {
      to: response.sender_email,
      subject: `Re: ${response.subject}`,
      body: response.response_text
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mark response as sent
    await sql`
      UPDATE responses 
      SET sent = true, sent_at = CURRENT_TIMESTAMP
      WHERE id = ${responseId}
    `;
    
    // Update analytics
    await sql`
      UPDATE analytics 
      SET emails_resolved = emails_resolved + 1,
          emails_pending = emails_pending - 1
      WHERE date_recorded = CURRENT_DATE
    `;
    
    return Response.json({
      success: true,
      message: 'Response sent successfully'
    });
    
  } catch (error) {
    console.error('Error sending response:', error);
    return Response.json({
      success: false,
      error: 'Failed to send response'
    }, { status: 500 });
  }
}

// Update response text before sending
export async function PUT(request) {
  try {
    const { responseId, responseText } = await request.json();
    
    if (!responseText || responseText.trim().length === 0) {
      return Response.json({
        success: false,
        error: 'Response text is required'
      }, { status: 400 });
    }
    
    // Update response text
    const result = await sql`
      UPDATE responses 
      SET response_text = ${responseText}, reviewed = true
      WHERE id = ${responseId} AND sent = false
      RETURNING *
    `;
    
    if (result.length === 0) {
      return Response.json({
        success: false,
        error: 'Response not found or already sent'
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      response: result[0],
      message: 'Response updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating response:', error);
    return Response.json({
      success: false,
      error: 'Failed to update response'
    }, { status: 500 });
  }
}