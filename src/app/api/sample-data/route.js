import sql from "@/app/api/utils/sql";

// Create comprehensive sample data for the email support system
export async function POST(request) {
  try {
    const { reset = false } = await request.json();
    
    if (reset) {
      // Clear existing data (optional)
      await sql`DELETE FROM responses`;
      await sql`DELETE FROM extracted_info`;
      await sql`DELETE FROM emails`;
      await sql`DELETE FROM analytics`;
    }

    // Sample emails with diverse scenarios
    const sampleEmails = [
      // Urgent negative emails
      {
        sender: 'frustrated.customer@gmail.com',
        subject: 'URGENT: Account locked for 72 hours - losing money!',
        body: 'This is absolutely ridiculous! My account has been locked for 3 days and I cannot access my business data. I am losing money every hour this continues. Your support team keeps telling me to wait but this is costing me thousands. Fix this NOW or I am switching to your competitor immediately!',
        receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        processed: false,
        sentiment: 'negative',
        priority: 'urgent',
        category: 'technical'
      },
      {
        sender: 'angry.manager@company.com',
        subject: 'Critical bug affecting 50+ users',
        body: 'We discovered a critical bug in the latest update that is preventing our entire team from accessing shared files. This is affecting 50+ users and our productivity has dropped to zero. We need an immediate rollback or hotfix. This is blocking our project deadline!',
        receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        processed: false,
        sentiment: 'negative',
        priority: 'urgent',
        category: 'technical'
      },

      // High priority mixed sentiment
      {
        sender: 'startup.founder@techco.com',
        subject: 'Enterprise migration needed before investor demo',
        body: 'Hi! We love your platform and need to upgrade to enterprise before our Series A demo next Tuesday. We need advanced analytics, white-labeling, and API access. Can we schedule a call today to discuss pricing and timeline? This is crucial for our funding round.',
        receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        processed: false,
        sentiment: 'positive',
        priority: 'urgent',
        category: 'sales'
      },
      {
        sender: 'it.director@hospital.org',
        subject: 'HIPAA compliance verification needed urgently',
        body: 'We are a healthcare organization evaluating your platform for patient data management. We need immediate HIPAA compliance documentation and security certifications for our board review tomorrow. Can you provide these documents today?',
        receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        processed: false,
        sentiment: 'neutral',
        priority: 'urgent',
        category: 'compliance'
      },

      // Positive feedback emails
      {
        sender: 'happy.customer@email.com',
        subject: 'Outstanding support from Maria!',
        body: 'I just had to reach out and praise Maria from your support team. She went above and beyond to help me migrate my data and even provided custom scripts to automate the process. This level of service is why I recommend your platform to everyone!',
        receivedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        processed: true,
        sentiment: 'positive',
        priority: 'normal',
        category: 'feedback'
      },
      {
        sender: 'satisfied.dev@startup.io',
        subject: 'API documentation is excellent!',
        body: 'Your API docs are by far the best I have worked with. Clear examples, interactive testing, and great error handling. The webhook system works perfectly. Keep up the amazing work!',
        receivedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        processed: true,
        sentiment: 'positive',
        priority: 'normal',
        category: 'feedback'
      },

      // Normal priority technical issues
      {
        sender: 'developer@agency.com',
        subject: 'Rate limit questions for client project',
        body: 'Working on a client project that needs to sync data every 15 minutes. Current rate limits show 1000 requests/hour. Will this be sufficient for about 200 users making requests throughout the day? Also, what happens when we hit the limit?',
        receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        processed: false,
        sentiment: 'neutral',
        priority: 'normal',
        category: 'technical'
      },
      {
        sender: 'newbie@learningcode.com',
        subject: 'Help with webhook setup',
        body: 'I am new to webhooks and following your tutorial but getting 404 errors. My endpoint is https://myapp.ngrok.io/webhook and I am testing locally. Do I need to configure anything special for development?',
        receivedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        processed: false,
        sentiment: 'neutral',
        priority: 'normal',
        category: 'technical'
      },

      // Billing and account inquiries
      {
        sender: 'accounting@business.com',
        subject: 'Invoice discrepancy - charged twice?',
        body: 'Our accounting team noticed we were charged twice for the same month. Invoice #12345 and #12348 both show charges for March 2024. Could you please investigate and provide clarification or refund if this was an error?',
        receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        processed: false,
        sentiment: 'neutral',
        priority: 'normal',
        category: 'billing'
      },
      {
        sender: 'student@university.edu',
        subject: 'Student discount application',
        body: 'Hi! I am a computer science student working on my thesis project. I heard you offer student discounts. How can I apply? I have my .edu email and student ID. This would really help with my research project budget.',
        receivedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
        processed: true,
        sentiment: 'positive',
        priority: 'normal',
        category: 'sales'
      },

      // Feature requests
      {
        sender: 'product.manager@saas.com',
        subject: 'Slack integration feature request',
        body: 'Our team would love to see Slack integration where we get notified of important events directly in our workspace. This would improve our workflow significantly. Is this on your roadmap? Would be happy to beta test!',
        receivedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
        processed: false,
        sentiment: 'positive',
        priority: 'normal',
        category: 'feature_request'
      },
      {
        sender: 'designer@creative.studio',
        subject: 'Dark mode theme request',
        body: 'The current interface is great but quite bright for long working sessions. Would you consider adding a dark mode theme? Many of our team members work late hours and would appreciate this feature.',
        receivedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        processed: false,
        sentiment: 'neutral',
        priority: 'normal',
        category: 'feature_request'
      },

      // Recent activity
      {
        sender: 'mobile.user@phone.com',
        subject: 'iOS app sync issues',
        body: 'The iOS app is not syncing with the web version. Changes I make on mobile do not appear online and vice versa. Using iPhone 15 Pro with latest app version. Tried logout/login but issue persists.',
        receivedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        processed: false,
        sentiment: 'negative',
        priority: 'normal',
        category: 'technical'
      },
      {
        sender: 'consultant@firm.com',
        subject: 'Multi-client workspace organization',
        body: 'Managing multiple clients and need advice on best practices for organizing workspaces. Should I create separate accounts or use your team features? What are the permission controls like?',
        receivedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        processed: false,
        sentiment: 'neutral',
        priority: 'normal',
        category: 'consultation'
      },
      {
        sender: 'blogger@lifestyle.com',
        subject: 'Thank you for the quick fix!',
        body: 'Just wanted to say thanks for fixing the image upload issue so quickly yesterday. Back to creating content without any problems. Your response time is impressive!',
        receivedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        processed: true,
        sentiment: 'positive',
        priority: 'normal',
        category: 'feedback'
      }
    ];

    // Insert sample emails
    const insertedEmails = [];
    for (const email of sampleEmails) {
      const result = await sql`
        INSERT INTO emails (sender_email, subject, body, received_at, processed, sentiment, priority, category)
        VALUES (${email.sender}, ${email.subject}, ${email.body}, ${email.receivedAt}, ${email.processed}, ${email.sentiment}, ${email.priority}, ${email.category})
        RETURNING *
      `;
      insertedEmails.push(result[0]);
    }

    // Add extracted info for complex emails
    for (const email of insertedEmails) {
      if (email.priority === 'urgent' || email.category === 'sales') {
        await sql`
          INSERT INTO extracted_info (email_id, contact_phone, alternate_email, customer_requirements, sentiment_indicators, metadata)
          VALUES (
            ${email.id},
            ${email.sender_email.includes('startup') ? '+1-555-0199' : 
              email.sender_email.includes('hospital') ? '+1-555-0299' : 
              email.sender_email.includes('frustrated') ? '+1-555-0399' : null},
            ${email.sender_email.includes('startup') ? 'admin@techco.com' : 
              email.sender_email.includes('hospital') ? 'compliance@hospital.org' : null},
            ${email.priority === 'urgent' ? 
              'Immediate resolution required with high priority escalation and follow-up' : 
              'Standard support with detailed explanation and guidance'},
            ${email.sentiment === 'negative' ? 
              'Frustration, urgency, threatening language, demands immediate action' :
              email.sentiment === 'positive' ? 
              'Appreciation, satisfaction, complimentary language, enthusiasm' :
              'Professional tone, factual inquiries, neutral business communication'},
            ${JSON.stringify({
              urgency_level: email.priority === 'urgent' ? 'critical' : 'normal',
              customer_type: email.sender_email.includes('startup') || email.sender_email.includes('business') ? 'enterprise' :
                            email.sender_email.includes('student') || email.sender_email.includes('university') ? 'education' :
                            'individual',
              follow_up_required: email.priority === 'urgent',
              escalation_needed: email.sentiment === 'negative' && email.priority === 'urgent'
            })}
          )
        `;
      }
    }

    // Add AI responses for processed emails
    const processedEmails = insertedEmails.filter(e => e.processed);
    for (const email of processedEmails) {
      let responseText = '';
      
      if (email.sentiment === 'positive') {
        if (email.subject.includes('support')) {
          responseText = `Thank you so much for your wonderful feedback about Maria! We're thrilled to hear that she provided such exceptional service and went above and beyond to help with your data migration. I'll make sure to share your compliments with Maria and our entire support team - feedback like yours motivates us to continue delivering excellent service. If you need anything else, please don't hesitate to reach out!`;
        } else if (email.subject.includes('API')) {
          responseText = `We're so glad you're finding our API documentation helpful! Our development team puts a lot of effort into making our docs clear and comprehensive. It's wonderful to hear that the examples and webhook system are working well for your projects. Thanks for taking the time to share this feedback!`;
        } else if (email.subject.includes('quick fix')) {
          responseText = `You're very welcome! We're glad we could resolve the image upload issue quickly for you. We know how important it is to keep your content creation workflow smooth. Thanks for the kind words about our response time - we're always working to provide fast, effective support!`;
        } else {
          responseText = `Thank you for your positive feedback! We're delighted to hear about your great experience with our platform. Your success is our priority, and we appreciate you taking the time to share your thoughts with us.`;
        }
      } else {
        if (email.subject.includes('discount')) {
          responseText = `Hi! Thanks for reaching out about our student discount program. We're happy to support students in their academic projects! To apply for our 50% student discount, please email student-verify@company.com with your .edu email address and a photo of your current student ID. Once verified (usually within 24 hours), you'll receive instructions to apply the discount to your account. Good luck with your thesis project!`;
        } else {
          responseText = `Thank you for contacting us! We've received your inquiry and our team has reviewed your request. We'll provide you with a detailed response shortly. If you have any urgent concerns, please don't hesitate to reach out to our priority support line.`;
        }
      }

      await sql`
        INSERT INTO responses (email_id, response_text, sent, reviewed, sent_at)
        VALUES (${email.id}, ${responseText}, true, true, ${new Date(email.received_at.getTime() + 2 * 60 * 60 * 1000)})
      `;
    }

    // Add comprehensive knowledge base
    const knowledgeArticles = [
      {
        title: 'Account Security and Password Management',
        content: 'Account security best practices: 1) Use strong, unique passwords 2) Enable two-factor authentication 3) Regularly review account activity 4) Never share login credentials 5) Log out from shared devices 6) Report suspicious activity immediately 7) Keep recovery information updated',
        tags: ['security', 'password', 'account', '2fa', 'login'],
        category: 'security'
      },
      {
        title: 'API Rate Limits and Best Practices',
        content: 'API usage guidelines: Rate limits vary by plan (Basic: 1000/hour, Pro: 5000/hour, Enterprise: 20000/hour). Implement exponential backoff for 429 errors. Use webhooks instead of polling. Cache responses when possible. Monitor usage in dashboard. Contact support for higher limits.',
        tags: ['api', 'rate-limits', 'webhooks', 'caching'],
        category: 'technical'
      },
      {
        title: 'Billing Cycles and Payment Processing',
        content: 'Billing information: Monthly billing on signup date. Annual plans save 20%. Failed payments retry 3 times. Account suspended after 7 days. Pro-rated changes take effect immediately. Invoices emailed within 24 hours. Tax calculations automatic based on location.',
        tags: ['billing', 'payment', 'invoices', 'taxes'],
        category: 'billing'
      },
      {
        title: 'Mobile App Troubleshooting Guide',
        content: 'Mobile app issues: Update to latest version first. Clear app cache/data. Restart device. Check network connection. Ensure iOS 14+ or Android 8+. For sync issues, try logout/login. Report crashes with device logs. Premium features require active subscription.',
        tags: ['mobile', 'ios', 'android', 'sync', 'troubleshooting'],
        category: 'technical'
      },
      {
        title: 'Enterprise Features and Onboarding',
        content: 'Enterprise benefits: Dedicated account manager, priority support, custom integrations, advanced analytics, bulk user management, SSO/SAML, compliance certifications, SLA guarantees, custom training sessions, white-label options.',
        tags: ['enterprise', 'sso', 'compliance', 'training'],
        category: 'sales'
      },
      {
        title: 'Data Export and Privacy Compliance',
        content: 'Data management: Export all data via Settings > Data Export. GDPR/CCPA compliant. Data encrypted in transit/rest. 90-day retention after cancellation. Request deletion anytime. Audit logs for enterprise. Regular security audits performed.',
        tags: ['data', 'export', 'gdpr', 'privacy', 'compliance'],
        category: 'compliance'
      }
    ];

    for (const article of knowledgeArticles) {
      await sql`
        INSERT INTO knowledge_base (title, content, tags, category)
        VALUES (${article.title}, ${article.content}, ${article.tags}, ${article.category})
        ON CONFLICT (title) DO UPDATE SET
          content = EXCLUDED.content,
          tags = EXCLUDED.tags,
          category = EXCLUDED.category,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    // Add historical analytics
    const analyticsData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseEmails = 20 + Math.floor(Math.random() * 15);
      const resolved = Math.floor(baseEmails * (0.7 + Math.random() * 0.2));
      const urgent = Math.floor(baseEmails * (0.1 + Math.random() * 0.1));
      const positive = Math.floor(baseEmails * (0.4 + Math.random() * 0.2));
      const negative = Math.floor(baseEmails * (0.2 + Math.random() * 0.15));
      const neutral = baseEmails - positive - negative;

      analyticsData.push({
        date: date.toISOString().split('T')[0],
        total: baseEmails,
        resolved,
        pending: baseEmails - resolved,
        urgent,
        positive,
        negative,
        neutral
      });
    }

    for (const analytics of analyticsData) {
      await sql`
        INSERT INTO analytics (date_recorded, total_emails, emails_resolved, emails_pending, urgent_emails, positive_sentiment, negative_sentiment, neutral_sentiment)
        VALUES (${analytics.date}, ${analytics.total}, ${analytics.resolved}, ${analytics.pending}, ${analytics.urgent}, ${analytics.positive}, ${analytics.negative}, ${analytics.neutral})
        ON CONFLICT (date_recorded) DO UPDATE SET
          total_emails = EXCLUDED.total_emails,
          emails_resolved = EXCLUDED.emails_resolved,
          emails_pending = EXCLUDED.emails_pending,
          urgent_emails = EXCLUDED.urgent_emails,
          positive_sentiment = EXCLUDED.positive_sentiment,
          negative_sentiment = EXCLUDED.negative_sentiment,
          neutral_sentiment = EXCLUDED.neutral_sentiment
      `;
    }

    return Response.json({
      success: true,
      message: `Created comprehensive sample data: ${insertedEmails.length} emails, ${knowledgeArticles.length} knowledge articles, and ${analyticsData.length} days of analytics`,
      data: {
        emails: insertedEmails.length,
        knowledge_articles: knowledgeArticles.length,
        analytics_days: analyticsData.length,
        processed_emails: processedEmails.length
      }
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
    return Response.json({
      success: false,
      error: 'Failed to create sample data',
      details: error.message
    }, { status: 500 });
  }
}