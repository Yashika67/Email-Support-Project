import { Mail, Download } from "lucide-react";
import { EmailListItem } from "./EmailListItem";

export function EmailList({
  emails,
  totalEmailCount,
  selectedEmails,
  onEmailSelectionChange,
  onProcessEmail,
  processing,
  searchTerm,
}) {
  const handleToggleSelect = (emailId) => {
    const newSelection = selectedEmails.includes(emailId)
      ? selectedEmails.filter((id) => id !== emailId)
      : [...selectedEmails, emailId];
    onEmailSelectionChange(newSelection);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Support Emails
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-600">
              {emails.length} of {totalEmailCount} emails
            </span>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
      {emails.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Mail className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No emails found
          </h3>
          <p>
            {searchTerm
              ? "Try adjusting your search terms or filters."
              : 'Click "Fetch Emails" to load sample data.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {emails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              isSelected={selectedEmails.includes(email.id)}
              onToggleSelect={() => handleToggleSelect(email.id)}
              onProcess={onProcessEmail}
              processing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
