import React from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/my-courses"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          My Courses
        </Link>
        <Link
          to="/my-exams"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          My Exams
        </Link>
        <Link
          to="/attendance"
          className="p-4 border rounded hover:shadow-lg text-center"
        >
          Attendance
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