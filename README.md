Email Support Dashboard
A React-based dashboard for managing support emails. The app allows you to:
Upload emails from a CSV file
Filter emails (processed/unprocessed)
Search emails by subject/sender
Sort by date or subject (ascending/descending)
View analytics (total, processed, unprocessed emails)
Track sentiment analytics (optional extension)

 Features
Email Upload: Import emails from a CSV file.
Smart Filtering: View only processed, unprocessed, or all emails.
Search & Sort: Search by subject/sender and sort emails by date/subject.
Analytics Cards: Quick overview of email counts.
Sentiment Analytics: (Future feature) Show sentiment breakdown of emails.

⚙️ Installation
Clone the repository:
git clone https://github.com/your-username/email-support-dashboard.git
cd email-support-dashboard

Install dependencies:
npm install


Start development server:
npm run dev


Open in browser:
http://localhost:4000

CSV Format
Your uploaded CSV file should have columns like:
subject,sender,date,body,processed
"Support needed","customer@example.com","2025-09-05","Please help with login issue",true
"Query about pricing","info@example.com","2025-09-06","What are the updated plans?",false

Tech Stack
Frontend: React + Vite
Styling: Tailwind CSS + shadcn/ui components
Icons: lucide-react

 Next Improvements
 Add real IMAP/Gmail API integration
 Implement sentiment analysis using NLP
 Export filtered emails as CSV
 Add user authentication

License
MIT License © 2025
