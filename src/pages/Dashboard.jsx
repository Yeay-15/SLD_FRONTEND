// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { classService } from "../services/class.service";
import ScheduleView from "../components/dashboard/ScheduleView";

const Dashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await classService.getSchedule();
        setSchedule(response.data.schedule || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ScheduleView schedule={schedule} />
    </div>
  );
};

export default Dashboard;