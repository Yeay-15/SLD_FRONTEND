// src/components/dashboard/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { UserPlus, Edit, Trash2, Search, X } from "lucide-react";
import axios from "axios";

// Komponen modal tambah user
const AddUserModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    rfidUid: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sdlbackend-production.up.railway.app/api/v1/users", formData, {
        headers: { Authorization: token },
      });
      onAdd();
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.err || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Mahasiswa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIM</label>
            <input
              type="text"
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RFID UID</label>
            <input
              type="text"
              value={formData.rfidUid}
              onChange={(e) => setFormData({ ...formData, rfidUid: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
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

// Komponen modal edit user
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    rfidUid: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        nim: user.nim,
        rfidUid: user.rfidUid,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://sdlbackend-production.up.railway.app/api/v1/users/${user.id}`, formData, {
        headers: { Authorization: token },
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.response?.data?.err || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Mahasiswa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIM</label>
            <input
              type="text"
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RFID UID</label>
            <input
              type="text"
              value={formData.rfidUid}
              onChange={(e) => setFormData({ ...formData, rfidUid: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
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
              {loading ? "Menyimpan..." : "Perbarui"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen utama
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sdlbackend-production.up.railway.app/api/v1/users", {
        headers: { Authorization: token },
      });
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Apakah anda yakin ingin menghapus mahasiswa ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://sdlbackend-production.up.railway.app/api/v1/users/${userId}`, {
          headers: { Authorization: token },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.response?.data?.err || "Error deleting user");
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.nim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
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
            <UserPlus size={20} className="mr-2" />
            Tambah Mahasiswa
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RFID UID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">Tidak ada data mahasiswa</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.nim}</td>
                    <td className="px-6 py-4">{user.rfidUid}</td>
                    <td className="px-6 py-4">{user.class?.map((c) => c.kelas).join(", ") || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(user)}
                          title="Edit Mahasiswa"
                          type="button"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Hapus Mahasiswa"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={fetchUsers} />}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;