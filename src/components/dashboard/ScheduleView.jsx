// src/components/dashboard/ScheduleView.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import ScheduleFilters from "./ScheduleFilters";
// import CalendarView from "./CalendarView"; -> Dihapus sementara karena file aslinya tidak ada

const ScheduleView = () => {
  const [view, setView] = useState("list");
  const [dateRange, setDateRange] = useState("all");
  const [schedule, setSchedule] = useState({
    currentClasses: [],
    upcomingClasses: [],
    pastClasses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 300000); 
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = parseISO(dateTimeStr);
      return format(date, "d MMMM yyyy, HH:mm", { locale: id });
    } catch (error) {
      return dateTimeStr;
    }
  };

  const filterClassesByDate = (classes) => {
    if (dateRange === "all") return classes;

    let start, end;
    const now = new Date();

    switch (dateRange) {
      case "today":
        start = startOfToday();
        end = endOfToday();
        break;
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        return classes;
    }

    return classes.filter((cls) => {
      const classStart = parseISO(cls.startTime);
      return isWithinInterval(classStart, { start, end });
    });
  };

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sdlbackend-production.up.railway.app/api/v1/class/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { currentClasses, upcomingClasses, pastClasses } = response.data.data;
      setSchedule({
        currentClasses: currentClasses || [],
        upcomingClasses: upcomingClasses || [],
        pastClasses: pastClasses || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setLoading(false);
    }
  };

  const getFilteredClasses = () => {
    const allClasses = [
      ...schedule.currentClasses,
      ...schedule.upcomingClasses,
      ...schedule.pastClasses,
    ];
    return filterClassesByDate(allClasses);
  };

  const handleExport = (type) => {
    const filteredClasses = getFilteredClasses();
    const periodText = {
      all: "Semua Periode",
      today: "Hari Ini",
      week: "Minggu Ini",
      month: "Bulan Ini",
    }[dateRange];

    const exportData = filteredClasses.map((cls) => ({
      Kelas: cls.kelas,
      "Mata Kuliah": cls.matakuliah,
      "Waktu Mulai": formatDateTime(cls.startTime),
      "Waktu Selesai": formatDateTime(cls.endTime),
      "Jumlah Mahasiswa": cls.users?.length || 0,
    }));

    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Jadwal Kelas");
      XLSX.writeFile(wb, `jadwal-kelas-${dateRange}.xlsx`);
    } else if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("Jadwal Kelas", 14, 15);
      doc.setFontSize(12);
      doc.text(`Periode: ${periodText}`, 14, 25);
      doc.autoTable({
        startY: 35,
        head: [["Kelas", "Mata Kuliah", "Waktu Mulai", "Waktu Selesai", "Jumlah Mahasiswa"]],
        body: exportData.map(Object.values),
      });
      doc.save(`jadwal-kelas-${dateRange}.pdf`);
    }
  };

  const TableSection = ({ title, classes, icon: Icon, iconColor }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon className={iconColor} />
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Kuliah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Mulai</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Mahasiswa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada kelas</td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cls.kelas}</td>
                  <td className="px-6 py-4">{cls.matakuliah}</td>
                  <td className="px-6 py-4">{formatDateTime(cls.startTime)}</td>
                  <td className="px-6 py-4">{formatDateTime(cls.endTime)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Users size={18} className="text-gray-400" />
                      <span>{cls.users?.length || 0} Mahasiswa</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ScheduleFilters view={view} setView={setView} dateRange={dateRange} setDateRange={setDateRange} onExport={handleExport} />
      {view === "list" ? (
        <div className="space-y-6">
          <TableSection title="Kelas Berlangsung" classes={filterClassesByDate(schedule.currentClasses)} icon={Clock} iconColor="text-blue-600" />
          <TableSection title="Jadwal Mendatang" classes={filterClassesByDate(schedule.upcomingClasses)} icon={Calendar} iconColor="text-green-600" />
          <TableSection title="Kelas Selesai" classes={filterClassesByDate(schedule.pastClasses)} icon={Calendar} iconColor="text-gray-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Tampilan Kalender Belum Tersedia</h2>
          <p>Fitur kalender saat ini tidak ditemukan dari sumber kode aslinya.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;