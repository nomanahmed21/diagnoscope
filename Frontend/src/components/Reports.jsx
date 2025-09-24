import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import './Report.css'

const Reports = () => {
  const userData = useSelector((state) => state.user.user);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReport = async (userId) => {
    const response = await fetch("http://localhost:5000/api/reports/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  };

  useEffect(() => {
    const loadReports = async () => {
      if (userData?.userId) {
        try {
          const data = await fetchReport(userData.userId);
          setReports(data);
        } catch (error) {
          console.error("Error loading reports:", error);
        }
      }
    };
    loadReports();
  }, [userData]);

  const downloadPDF = (report) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Medical Report", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    doc.setFontSize(12);
    doc.text(`Name: ${userData.firstName} ${userData.lastName}`, 14, 40);
    doc.text(`Age: ${userData.age}`, 14, 50);
    doc.text(`Gender: ${userData.gender}`, 14, 60);
    doc.text(`Phone: ${userData.phone}`, 14, 70);
    doc.text(`Email: ${userData.email}`, 14, 80);
    doc.text(`Report ID: ${report.reportId}`, 14, 90);

    doc.text(`Test Name: ${report.testname}`, 14, 110);
    doc.text(`Result: ${report.result}`, 14, 120);
    doc.text(`Chance: ${report.chance}%`, 14, 130);
    doc.text(`Date: ${new Date(report.timestamp).toLocaleString()}`, 14, 140);

    const symptomEntries = Object.entries(report.symptoms).map(([k, v]) => [k, v]);
    autoTable(doc, {
      head: [["Symptom", "Value"]],
      body: symptomEntries,
      startY: 150,
      styles: { halign: "center" },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`report-${report.reportId}.pdf`);
  };

  return (
    <div className="reports-container">
      <h1 className="page-title">Reports</h1>

      {reports.map((report) => (
        <div key={report.reportId} className="report-card">
          <p className="report-test">{report.testname}</p>
          <p className="report-date">
            {new Date(report.timestamp).toLocaleDateString()}
          </p>
          <p
            className={`report-result ${
              report.result.toLowerCase() === "positive"
                ? "positive"
                : "negative"
            }`}
          >
            {report.result}
          </p>

          <div className="card-actions">
            <button
              onClick={() => setSelectedReport(report)}
              className="btn view-btn"
            >
              <Eye size={18} /> View
            </button>

            <button
              onClick={() => downloadPDF(report)}
              className="btn download-btn"
            >
              Download PDF
            </button>
          </div>
        </div>
      ))}

      {selectedReport && (
        <div className="modal-overlay">
          <div
            className="modal-backdrop"
            onClick={() => setSelectedReport(null)}
          ></div>

          <div className="modal-box">
            <h2 className="modal-title">Patient Details</h2>
            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Age:</strong> {userData.age}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Report ID:</strong> {selectedReport.reportId}</p>

            <h3 className="section-title">Report Summary</h3>
            <p><strong>Test:</strong> {selectedReport.testname}</p>
            <p><strong>Result:</strong> {selectedReport.result}</p>
            <p><strong>Chance:</strong> {selectedReport.chance}%</p>
            <p><strong>Date:</strong> {new Date(selectedReport.timestamp).toLocaleString()}</p>

            <h3 className="section-title">Symptoms</h3>
            <ul className="symptoms-list">
              {Object.entries(selectedReport.symptoms).map(([symptom, value]) => (
                <li key={symptom}>
                  {symptom}: <span className="highlight">{value}</span>
                </li>
              ))}
            </ul>

            <div className="modal-actions">
              <button
                onClick={() => setSelectedReport(null)}
                className="btn close-btn"
              >
                Close
              </button>
              <button
                onClick={() => downloadPDF(selectedReport)}
                className="btn download-btn"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
