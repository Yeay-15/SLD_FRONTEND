import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddClassModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    kelas: "",
    matakuliah: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sdlbackend-production.up.railway.app/api/v1/class", formData, {
        headers: { Authorization: token },
      });
      if (onAdd) {
        onAdd();
      }
      onClose();
    } catch (error) {
      console.error("Error adding class:", error);
      alert(error.response?.data?.err || "Error adding class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Kelas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleAddClass} className="space-y-4">
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

export default AddClassModal;