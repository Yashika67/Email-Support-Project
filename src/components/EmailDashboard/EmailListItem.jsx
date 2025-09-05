"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  Star,
  MessageSquare,
  Send,
  Eye,
  CheckCircle,
  Clock,
  MoreVertical,
} from "lucide-react";
import { getPriorityColor, getSentimentColor } from "@/utils/colors";
import { EmailDetails } from "./EmailDetails";

export function EmailListItem({
  email,
  isSelected,
  onToggleSelect,
  onProcess,
  processing,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`p-6 hover:bg-slate-50/50 transition-all ${
        isSelected ? "bg-blue-50/50 border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {email.subject}
              </h3>
              {email.priority && (
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                    email.priority,
                  )}`}
                >
                  {email.priority}
                </span>
              )}
              {email.sentiment && (
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getSentimentColor(
                    email.sentiment,
                  )}`}
                >
                  {email.sentiment}
                </span>
              )}
              {email.processed ? (
                <div className="flex items-center space-x-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Resolved</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-amber-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Pending</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm text-slate-600">
              <p className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{email.sender_email}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(email.received_at).toLocaleString()}</span>
              </p>
            </div>
            <p className="text-slate-700 mb-4 line-clamp-2">{email.body}</p>
            {email.customer_requirements && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-1" /> Customer Requirements:
                </p>
                <p className="text-sm text-blue-800">
                  {email.customer_requirements}
                </p>
              </div>
            )}
            {email.response_text && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-emerald-900 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" /> AI Generated
                  Response:
                </p>
                <p className="text-sm text-emerald-800 mb-3">
                  {email.response_text}
                </p>
                <div className="flex items-center space-x-3">
                  {email.response_sent ? (
                    <span className="text-xs text-emerald-600 flex items-center bg-emerald-100 px-2 py-1 rounded">
                      <Send className="w-3 h-3 mr-1" /> Sent
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600 flex items-center bg-slate-100 px-2 py-1 rounded">
                      <Eye className="w-3 h-3 mr-1" /> Draft
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {!email.processed && (
            <button
              onClick={() => onProcess(email.id)}
              disabled={processing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-sm font-medium shadow-sm transition-all transform hover:scale-105"
            >
              Process Email
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 border border-slate-200 text-sm font-medium transition-all"
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isExpanded && <EmailDetails email={email} />}
    </div>
  );
}
