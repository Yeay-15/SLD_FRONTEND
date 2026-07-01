import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Users, ClipboardList, UserPlus } from "lucide-react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import ClassDetailModal from "./ClassDetailModal";
import AttendanceView from "./AttendanceView";
import ClassUserManagement from "./ClassUserManagement";
import AddClassModal from "./AddClassModal";

const formatDateTime = (dateTimeStr) => {
  try {
    const date = parseISO(dateTimeStr);
    return format(date, "d MMMM yyyy, HH:mm", { locale: id });
  } catch (error) {
    return dateTimeStr;
  }
};

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sdlbackend-production.up.railway.app/api/v1/class", {
        headers: { Authorization: token },
      });
      setClasses(response.data.data.classes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Apakah anda yakin ingin menghapus kelas ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://sdlbackend-production.up.railway.app/api/v1/class/${classId}`, {
          headers: { Authorization: token },
        });
        fetchClasses();
      } catch (error) {
        console.error("Error deleting class:", error);
        alert(error.response?.data?.err || "Error deleting class");
      }
    }
  };

  const handleViewDetails = (classData) => {
    setSelectedClass(classData);
    setShowDetailModal(true);
  };

  const handleViewAttendance = (classData) => {
    setSelectedClass(classData);
    setShowAttendanceView(true);
  };

  const handleManageUsers = (classData) => {
    setSelectedClass(classData);
    setShowUserManagement(true);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.kelas.toLowerCase().includes(search.toLowerCase()) ||
      cls.matakuliah.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari kelas..."
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            type="button"
          >
            <Plus size={20} className="mr-2" />
            Tambah Kelas
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50 border-b">
            <div>KELAS</div>
            <div>MATA KULIAH</div>
            <div>WAKTU MULAI</div>
            <div>WAKTU SELESAI</div>
            <div>JUMLAH MAHASISWA</div>
            <div>AKSI</div>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : filteredClasses.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Tidak ada data kelas</div>
            ) : (
              filteredClasses.map((cls) => (
                <div key={cls.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] gap-4 p-4 items-center hover:bg-gray-50">
                  <div>{cls.kelas}</div>
                  <div>{cls.matakuliah}</div>
                  <div>{formatDateTime(cls.startTime)}</div>
                  <div>{formatDateTime(cls.endTime)}</div>
                  <div className="flex items-center">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <span>{cls.users?.length || 0}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleViewDetails(cls)} title="Edit Kelas" type="button">
                      <Edit size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800" onClick={() => handleViewAttendance(cls)} title="Lihat Absensi" type="button">
                      <ClipboardList size={16} />
                    </button>
                    <button className="text-purple-600 hover:text-purple-800" onClick={() => handleManageUsers(cls)} title="Kelola Mahasiswa" type="button">
                      <UserPlus size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteClass(cls.id)} title="Hapus Kelas" type="button">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAddModal && <AddClassModal onClose={() => setShowAddModal(false)} onAdd={fetchClasses} />}
      {showDetailModal && selectedClass && (
        <ClassDetailModal
          classData={selectedClass}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedClass(null);
          }}
          onUpdate={fetchClasses}
        />
      )}
      {showAttendanceView && selectedClass && (
        <AttendanceView
          classData={selectedClass}
          onClose={() => {
            setShowAttendanceView(false);
            setSelectedClass(null);
          }}
        />
      )}
      {showUserManagement && selectedClass && (
        <ClassUserManagement
          classData={selectedClass}
          onClose={() => {
            setShowUserManagement(false);
            setSelectedClass(null);
          }}
          onUpdate={fetchClasses}
        />
      )}
    </div>
  );
};

export default ClassManagement;