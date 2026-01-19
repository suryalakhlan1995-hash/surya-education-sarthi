import React from "react";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/my-classes"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          My Classes
        </Link>
        <Link
          to="/exam-management"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          Exam Management
        </Link>
        <Link
          to="/student-attendance"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          Student Attendance
        </Link>
        <Link
          to="/profile"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}