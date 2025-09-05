import sql from "@/app/api/utils/sql";

// AI-powered email analysis for sentiment and priority
export async function POST(request) {
  try {
    const { emailId } = await request.json();
    
    // Get the email from database
    const emailResult = await sql`
      SELECT * FROM emails WHERE id = ${emailId} AND processed = false
    `;
    
    if (emailResult.length === 0) {
      return Response.json({
        success: false,
        error: 'Email not found or already processed'
      }, { status: 404 });
    }
    
    const email = emailResult[0];
    
    // Use ChatGPT for sentiment analysis and priority detection
    const analysisResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes customer support emails. Analyze the following email and provide:
            1. Sentiment: positive, negative, or neutral
            2. Priority: urgent or normal (urgent if contains words like "immediately", "critical", "cannot access", "urgent", "asap", "emergency")
            3. Category: support, query, request, or help
            4. Extract key information like contact details, requirements, and sentiment indicators
            
            Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Subject: ${email.subject}\n\nBody: ${email.body}\n\nSender: ${email.sender_email}`
          }
        ],
        json_schema: {
          name: "email_analysis",
          schema: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"]
              },
              priority: {
                type: "string", 
                enum: ["urgent", "normal"]
              },
              category: {
                type: "string",
                enum: ["support", "query", "request", "help"]
              },
              extracted_info: {
                type: "object",
                properties: {
                  contact_phone: { type: ["string", "null"] },
                  alternate_email: { type: ["string", "null"] },
                  customer_requirements: { type: "string" },
                  sentiment_indicators: { type: "string" },
                  account_number: { type: ["string", "null"] },
                  product_mentioned: { type: ["string", "null"] }
                },
                required: ["customer_requirements", "sentiment_indicators"],
                additionalProperties: false
              }
            },
            required: ["sentiment", "priority", "category", "extracted_info"],
            additionalProperties: false
          }
        }
      })
    });
    
    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze email with AI');
    }
    
    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);
    
    // Update email with analysis results
    await sql`
      UPDATE emails 
      SET sentiment = ${analysis.sentiment},
          priority = ${analysis.priority},
          category = ${analysis.category},
          processed = true
      WHERE id = ${emailId}
    `;
    
    // Store extracted information
    await sql`
      INSERT INTO extracted_info (
        email_id, contact_phone, alternate_email, customer_requirements, 
        sentiment_indicators, metadata
      ) VALUES (
        ${emailId}, 
        ${analysis.extracted_info.contact_phone},
        ${analysis.extracted_info.alternate_email},
        ${analysis.extracted_info.customer_requirements},
        ${analysis.extracted_info.sentiment_indicators},
        ${JSON.stringify({
          account_number: analysis.extracted_info.account_number,
          product_mentioned: analysis.extracted_info.product_mentioned
        })}
      )
    `;
    
    return Response.json({
      success: true,
      analysis: analysis,
      message: 'Email analyzed successfully'
    });
    
  } catch (error) {
    console.error('Error analyzing email:', error);
    return Response.json({
      success: false,
      error: 'Failed to analyze email'
    }, { status: 500 });
  }
}