import sql from "@/app/api/utils/sql";

// Generate AI-powered responses using RAG (Retrieval-Augmented Generation)
export async function POST(request) {
  try {
    const { emailId } = await request.json();
    
    // Get email and extracted info
    const emailData = await sql`
      SELECT e.*, ei.customer_requirements, ei.sentiment_indicators, ei.metadata
      FROM emails e
      LEFT JOIN extracted_info ei ON e.id = ei.email_id
      WHERE e.id = ${emailId}
    `;
    
    if (emailData.length === 0) {
      return Response.json({
        success: false,
        error: 'Email not found'
      }, { status: 404 });
    }
    
    const email = emailData[0];
    
    // Search knowledge base for relevant information (RAG)
    const knowledgeResults = await sql`
      SELECT title, content, category
      FROM knowledge_base
      WHERE 
        category ILIKE '%' || ${email.category} || '%' OR
        content ILIKE '%' || ${email.category} || '%' OR
        ${email.subject} ILIKE ANY(SELECT '%' || unnest(tags) || '%' FROM knowledge_base)
      LIMIT 3
    `;
    
    // Build context from knowledge base
    const knowledgeContext = knowledgeResults.map(kb => 
      `${kb.title}: ${kb.content}`
    ).join('\n\n');
    
    // Generate response using ChatGPT with RAG
    const responseGeneration = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a professional customer support representative. Generate a helpful, empathetic, and context-aware response to the customer email.

Guidelines:
- Maintain a professional and friendly tone
- If the customer seems frustrated (negative sentiment), acknowledge their frustration empathetically
- Use the knowledge base information to provide accurate answers
- Be specific and helpful
- If urgent, prioritize immediate assistance
- Include relevant details mentioned in the email
- Keep responses concise but complete

Knowledge Base Information:
${knowledgeContext}

Customer Information:
- Sentiment: ${email.sentiment}
- Priority: ${email.priority}
- Requirements: ${email.customer_requirements}
- Sentiment Indicators: ${email.sentiment_indicators}`
          },
          {
            role: 'user',
            content: `Customer Email:
From: ${email.sender_email}
Subject: ${email.subject}
Body: ${email.body}

Please generate an appropriate response.`
          }
        ]
      })
    });
    
    if (!responseGeneration.ok) {
      throw new Error('Failed to generate response');
    }
    
    const responseData = await responseGeneration.json();
    const generatedResponse = responseData.choices[0].message.content;
    
    // Store the generated response
    const responseResult = await sql`
      INSERT INTO responses (email_id, response_text)
      VALUES (${emailId}, ${generatedResponse})
      RETURNING *
    `;
    
    return Response.json({
      success: true,
      response: responseResult[0],
      message: 'Response generated successfully'
    });
    
  } catch (error) {
    console.error('Error generating response:', error);
    return Response.json({
      success: false,
      error: 'Failed to generate response'
    }, { status: 500 });
  }
}