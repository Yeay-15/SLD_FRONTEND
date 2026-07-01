import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AttendanceView = ({ classData, onClose }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    fetchAttendance();
  }, [classData.id, dateRange]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sdlbackend-production.up.railway.app/api/v1/class/${classData.id}/attendance`,
        {
          params: dateRange,
          headers: { Authorization: token },
        }
      );
      setAttendance(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  const handleExport = async (formatType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://sdlbackend-production.up.railway.app/api/v1/class/${classData.id}/attendance/export`,
        {
          params: { ...dateRange },
          headers: { Authorization: token },
        }
      );
      const exportData = response.data.data;

      if (formatType === "pdf") {
        generatePDF(exportData);
      } else if (formatType === "excel") {
        generateExcel(exportData);
      }
    } catch (error) {
      console.error("Error exporting attendance:", error);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    const colors = {
      primary: [41, 64, 82],
      secondary: [84, 123, 162],
      accent: [95, 173, 251],
      light: [240, 242, 245],
      text: [50, 50, 50],
    };

    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("LAPORAN KEHADIRAN MAHASISWA", pageWidth / 2, 25, { align: "center" });

    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(1);
    doc.line(margin, 42, pageWidth - margin, 42);

    doc.setFillColor(...colors.light);
    doc.roundedRect(margin, 50, pageWidth - margin * 2, 40, 3, 3, "F");

    doc.setTextColor(...colors.primary);
    doc.setFontSize(14);
    doc.text("INFORMASI KELAS", margin + 5, 60);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin + 5, 63, margin + 70, 63);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...colors.text);

    doc.text("Mata Kuliah:", margin + 10, 73);
    doc.text("Kelas:", margin + 10, 83);
    doc.setFont("helvetica", "normal");
    doc.text(data.classInfo.matakuliah, margin + 55, 73);
    doc.text(data.classInfo.kelas, margin + 55, 83);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...colors.secondary);
    doc.text(
      `Dicetak: ${format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id })}`,
      pageWidth - margin,
      83,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.primary);
    doc.text("DATA KEHADIRAN", margin + 5, 105);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin + 5, 108, margin + 70, 108);

    const tableData = data.attendance.map((record, idx) => [
      idx + 1,
      record.nim,
      record.nama,
      format(new Date(record.waktu), "dd/MM/yyyy", { locale: id }),
      format(new Date(record.waktu), "HH:mm", { locale: id }),
    ]);

    doc.autoTable({
      startY: 115,
      head: [["No", "NIM", "Nama", "Tanggal", "Waktu"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: colors.secondary,
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        fontSize: 11,
        cellPadding: 5,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { cellWidth: 40 },
        2: { cellWidth: 70 },
        3: { halign: "center", cellWidth: 30 },
        4: { halign: "center", cellWidth: 25 },
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    const finalY = doc.lastAutoTable.finalY || 115;
    doc.setFillColor(...colors.light);
    doc.roundedRect(margin, finalY + 15, pageWidth - margin * 2, 25, 3, 3, "F");

    doc.setFillColor(...colors.secondary);
    doc.circle(margin + 15, finalY + 27, 5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.text(`Total Kehadiran: ${data.total} mahasiswa`, margin + 30, finalY + 30);

    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(1);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...colors.secondary);
    doc.text("Smart Door Lock - Sistem Presensi Otomatis", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`kehadiran_${data.classInfo.kelas}_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  const generateExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const headers = [
      [{ v: "LAPORAN KEHADIRAN MAHASISWA", t: "s" }],
      [],
      ["Informasi Kelas"],
      [`Mata Kuliah: ${data.classInfo.matakuliah}`],
      [`Kelas: ${data.classInfo.kelas}`],
      [],
      ["Data Kehadiran"],
      ["No", "NIM", "Nama", "Tanggal", "Waktu"]
    ];

    const rows = data.attendance.map((record, idx) => [
      idx + 1,
      record.nim,
      record.nama,
      format(new Date(record.waktu), "dd/MM/yyyy", { locale: id }),
      format(new Date(record.waktu), "HH:mm", { locale: id }),
    ]);

    rows.push(
      [],
      [`Total Kehadiran: ${data.total} mahasiswa`],
      [],
      [`Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}`]
    );

    const ws = XLSX.utils.aoa_to_sheet([...headers, ...rows]);
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 4 } },
    ];
    ws["!cols"] = [{ wch: 8 }, { wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 10 }];

    XLSX.utils.book_append_sheet(wb, ws, "Kehadiran");
    XLSX.writeFile(wb, `kehadiran_${data.classInfo.kelas}_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Data Kehadiran</h2>
            <p className="text-sm text-gray-500">{classData.matakuliah} - Kelas {classData.kelas}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b">
          <div className="flex justify-end space-x-4">
            <div className="flex space-x-2">
              {attendance.length > 0 && (
                <>
                  <button onClick={() => handleExport("pdf")} className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    <Download size={16} className="mr-2" /> PDF
                  </button>
                  <button onClick={() => handleExport("excel")} className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
                    <Download size={16} className="mr-2" /> Excel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px] gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50 border-b">
              <div>FOTO</div>
              <div>NAMA</div>
              <div>NIM</div>
              <div>RFID</div>
              <div>WAKTU</div>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : attendance.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Tidak ada data kehadiran</div>
              ) : (
                attendance.map((record) => (
                  <div key={record.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_100px] gap-4 p-4 items-center">
                    <div>
                      <img src={record.photoUrl} alt={`Foto ${record.user.name}`} className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div>{record.user.name}</div>
                    <div>{record.user.nim}</div>
                    <div>{record.user.rfidUid}</div>
                    <div>{format(new Date(record.timestamp), "HH:mm", { locale: id })}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">Total Kehadiran: {attendance.length} Mahasiswa</div>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;