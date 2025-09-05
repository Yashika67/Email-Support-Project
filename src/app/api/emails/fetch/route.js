import sql from "@/app/api/utils/sql";

// Simulated email fetching - in production, you'd integrate with Gmail/Outlook APIs
export async function POST(request) {
  try {
    const { emailProvider, credentials } = await request.json();
    
    // For demo purposes, we'll create some sample emails
    // In production, you'd use IMAP/Gmail API/Outlook API here
    const sampleEmails = [
      {
        sender: "customer1@example.com",
        subject: "Support Request - Cannot access my account",
        body: "Hi, I'm having trouble logging into my account. I've tried resetting my password but I'm not receiving the email. This is urgent as I need to access my files for a presentation tomorrow. Please help immediately!",
        receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        sender: "user2@example.com", 
        subject: "Query about billing charges",
        body: "Hello, I noticed an unexpected charge on my account. Could you please explain what this is for? I'm quite frustrated as this wasn't mentioned anywhere. My account number is 12345.",
        receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        sender: "client3@example.com",
        subject: "Help with product features",
        body: "Good morning! I'm really enjoying your product so far. Could you help me understand how to use the advanced features? Specifically, I'm interested in the reporting functionality. Thank you!",
        receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        sender: "support@example.com",
        subject: "Request for demo",
        body: "Hi there, we're interested in scheduling a demo of your enterprise solution. We have about 500 employees and need a comprehensive solution. When would be a good time to connect?",
        receivedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ];

    // Filter emails based on support keywords
    const supportKeywords = ['support', 'query', 'request', 'help'];
    const filteredEmails = sampleEmails.filter(email => 
      supportKeywords.some(keyword => 
        email.subject.toLowerCase().includes(keyword)
      )
    );

    // Store filtered emails in database
    const insertedEmails = [];
    for (const email of filteredEmails) {
      const result = await sql`
        INSERT INTO emails (sender_email, subject, body, received_at)
        VALUES (${email.sender}, ${email.subject}, ${email.body}, ${email.receivedAt})
        RETURNING *
      `;
      insertedEmails.push(result[0]);
    }

    return Response.json({
      success: true,
      message: `Fetched and filtered ${insertedEmails.length} support emails`,
      emails: insertedEmails
    });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch emails'
    }, { status: 500 });
  }
}