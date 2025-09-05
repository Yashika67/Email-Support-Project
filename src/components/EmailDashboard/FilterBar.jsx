
// import { Search, Filter, ArrowUpDown } from "lucide-react";

// export function FilterBar({
//   searchTerm,
//   onSearchTermChange,
//   filter,
//   onFilterChange,
//   sortBy,
//   onSortByChange,
//   sortOrder,
//   onSortOrderChange,
//   emails = [],
// }) {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//       {/* 🔍 Search Box */}
//       <div className="flex items-center w-full sm:w-1/3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
//         <Search className="w-5 h-5 text-slate-400 mr-2" />
//         <input
//           type="text"
//           placeholder="Search emails..."
//           value={searchTerm}
//           onChange={(e) => onSearchTermChange(e.target.value)}
//           className="bg-transparent outline-none w-full"
//         />
//       </div>

//       {/* ⚙️ Filters & Sorting */}
//       <div className="flex items-center gap-3">
//         {/* Filter Dropdown */}
//         <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
//           <Filter className="w-4 h-4 text-slate-400 mr-2" />
//           <select
//             value={filter}
//             onChange={(e) => onFilterChange(e.target.value)}
//             className="bg-transparent outline-none"
//           >
//             <option value="all">All Emails ({emails.length})</option>
//             <option value="processed">
//               Processed ({emails.filter((e) => e.processed).length})
//             </option>
//             <option value="unprocessed">
//               Unprocessed ({emails.filter((e) => !e.processed).length})
//             </option>
//           </select>
//         </div>

//         {/* Sort Controls */}
//         <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
//           <ArrowUpDown className="w-4 h-4 text-slate-400 mr-2" />
//           <select
//             value={sortBy}
//             onChange={(e) => onSortByChange(e.target.value)}
//             className="bg-transparent outline-none"
//           >
//             <option value="date">Date</option>
//             <option value="subject">Subject</option>
//           </select>
//           <button
//             onClick={onSortOrderChange}
//             className="ml-2 text-sm text-blue-600 hover:underline"
//           >
//             {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }








"use client";

import { Search } from "lucide-react";

export function FilterBar({
  searchTerm,
  onSearchTermChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  emails,
  category,
  onCategoryChange, // ✅ new
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* 🔍 Search */}
      <div className="flex items-center w-full md:w-1/3">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by subject or sender..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 📂 Processed/Unprocessed */}
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Emails ({emails.length})</option>
          <option value="processed">Processed</option>
          <option value="unprocessed">Unprocessed</option>
        </select>

        {/* 🏷️ Category (Sentiment + Priority) */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>

          {/* Sentiment */}
          <optgroup label="Sentiment">
            <option value="positive">😊 Positive</option>
            <option value="neutral">😐 Neutral</option>
            <option value="negative">😠 Negative</option>
          </optgroup>

          {/* Priority */}
          <optgroup label="Priority">
            <option value="high">⬆️ High</option>
            <option value="medium">⬅️ Medium</option>
            <option value="low">⬇️ Low</option>
          </optgroup>
        </select>

        {/* 📅 Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="subject">Sort by Subject</option>
        </select>

        <button
          onClick={onSortOrderChange}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
        >
          {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
        </button>
      </div>
    </div>
  );
}
