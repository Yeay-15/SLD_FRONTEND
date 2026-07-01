import React, { useState, useEffect } from "react";
import { Search, UserPlus, X } from "lucide-react";
import axios from "axios";

const ClassUserManagement = ({ classData, onClose, onUpdate }) => {
  const [unregisteredUsers, setUnregisteredUsers] = useState([]);
  const [searchUnregistered, setSearchUnregistered] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sdlbackend-production.up.railway.app/api/v1/users", {
        headers: { Authorization: token },
      });
      const users = response.data.data.users || [];

      const notEnrolledUsers = users.filter(
        (user) =>
          !user.class ||
          !Array.isArray(user.class) ||
          user.class.length === 0 ||
          !user.class.some((cls) => cls.id === classData.id)
      );
      setUnregisteredUsers(notEnrolledUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleAddUserToClass = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sdlbackend-production.up.railway.app/api/v1/users/add-to-class",
        { userId, classId: classData.id },
        { headers: { Authorization: token } }
      );
      fetchUsers();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding user to class:", error);
      alert(error.response?.data?.err || "Error adding user to class");
    }
  };

  const filteredUnregisteredUsers = unregisteredUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUnregistered.toLowerCase()) ||
      user.nim.toLowerCase().includes(searchUnregistered.toLowerCase())
  );

  const getClassesCount = (user) => {
    if (!user.class || !Array.isArray(user.class)) {
      return 0;
    }
    return user.class.length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Kelola Mahasiswa - {classData.kelas} ({classData.matakuliah})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-50 p-4 border-b rounded-t-lg">
          <h3 className="font-medium mb-2">Siswa Tersedia</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchUnregistered}
              onChange={(e) => setSearchUnregistered(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border border-t-0 rounded-b-lg">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : filteredUnregisteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Tidak ada mahasiswa yang belum terdaftar</div>
          ) : (
            <div className="divide-y">
              {filteredUnregisteredUsers.map((user) => {
                const classesCount = getClassesCount(user);
                return (
                  <div key={user.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">NIM: {user.nim}</div>
                      {classesCount > 0 && (
                        <div className="text-xs text-blue-600 mt-1">Terdaftar di {classesCount} kelas lainnya</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddUserToClass(user.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="Tambahkan ke Kelas"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassUserManagement;