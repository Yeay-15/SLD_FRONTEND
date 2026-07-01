import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const ClassDetailModal = ({ classData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    kelas: "",
    matakuliah: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classData) {
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const pad = (n) => String(n).padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        kelas: classData.kelas,
        matakuliah: classData.matakuliah,
        startTime: formatDateForInput(classData.startTime),
        endTime: formatDateForInput(classData.endTime),
      });
    }
  }, [classData]);

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };
      await axios.put(
        `https://sdlbackend-production.up.railway.app/api/v1/class/${classData.id}`,
        payload,
        {
          headers: { Authorization: token },
        }
      );
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error updating class:", error);
      alert(error.response?.data?.err || "Error updating class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Kelas</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdateClass} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kelas</label>
            <input
              type="text"
              value={formData.kelas}
              onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
            <input
              type="text"
              value={formData.matakuliah}
              onChange={(e) => setFormData({ ...formData, matakuliah: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Mulai</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Selesai</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassDetailModal;