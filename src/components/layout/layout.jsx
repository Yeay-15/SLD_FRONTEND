// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, LogOut } from "lucide-react";
import { authService } from "../../services/auth.service";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Kelas", path: "/classes", icon: BookOpen },
    { name: "Data Mahasiswa", path: "/users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Smart Lock</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="mr-3" size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;