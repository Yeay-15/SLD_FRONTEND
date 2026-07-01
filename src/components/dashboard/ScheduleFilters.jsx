// src/components/dashboard/ScheduleFilters.jsx
import React from "react";
import { Calendar, List, Download } from "lucide-react";

const ScheduleFilters = ({ view, setView, dateRange, setDateRange, onExport }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block sm:inline-block sm:mr-2">
              Tampilan:
            </label>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                  view === "list"
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center">
                  <List size={16} className="mr-2" />
                  List
                </span>
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b -ml-px ${
                  view === "calendar"
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Kalender
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block sm:inline-block sm:mr-2">
              Periode:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onExport("pdf")}
            className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <Download size={16} className="mr-2" />
            PDF
          </button>
          <button
            onClick={() => onExport("excel")}
            className="flex items-center px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <Download size={16} className="mr-2" />
            Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilters;