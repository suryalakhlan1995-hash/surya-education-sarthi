import React from "react";
import { Link } from "react-router-dom";

export default function SchoolManagementPanel() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">School Management Panel</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/students"
          className="p-6 bg-green-100 hover:bg-green-200 rounded shadow text-center"
        >
          Manage Students
        </Link>
        <Link
          to="/teachers"
          className="p-6 bg-yellow-100 hover:bg-yellow-200 rounded shadow text-center"
        >
          Manage Teachers
        </Link>
        <Link
          to="/exams"
          className="p-6 bg-blue-100 hover:bg-blue-200 rounded shadow text-center"
        >
          Exams
        </Link>
        <Link
          to="/fees"
          className="p-6 bg-purple-100 hover:bg-purple-200 rounded shadow text-center"
        >
          Fees & Payments
        </Link>
      </div>
    </div>
  );
}