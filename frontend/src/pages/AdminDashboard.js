import { useState, useEffect } from "react";
import { API_URL } from "../config";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import * as XLSX from "xlsx";

export default function AdminDashboard({ setToken }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  // ================= FETCH FEEDBACK =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/feedback`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // If unauthorized logout automatically
        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          return;
        }

        const data = await res.json();

        setFeedbacks(Array.isArray(data) ? data : []);

      } catch (err) {
        console.log(err);
        setFeedbacks([]);
      }
    };

    fetchData();
  }, [setToken]);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "-";

    return `${d.getUTCFullYear()}-${String(
      d.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getUTCDate()
    ).padStart(2, "0")}`;
  };

  // ================= DATE FILTER =================
  const isWithinDateRange = (date) => {
    if (!date) return true;

    const item = new Date(date)
      .toISOString()
      .split("T")[0];

    if (fromDate && item < fromDate) return false;
    if (toDate && item > toDate) return false;

    return true;
  };

  // ================= FILTERED DATA =================
  const filtered = feedbacks.filter((f) => {
    const id = (f?.customerId || "").toLowerCase();

    return (
      id.includes(filterId.toLowerCase()) &&
      (
        filterRating === "" ||
        Number(f.rating) === Number(filterRating)
      ) &&
      isWithinDateRange(f.createdAt)
    );
  });

  const total = filtered.length;

  // ================= PIE DATA =================
  const pieData = [1, 2, 3, 4, 5].map((r) => {
    const count = filtered.filter(
      (f) => Number(f.rating) === r
    ).length;

    return {
      name: `${r} Star`,
      value:
        total > 0
          ? Number(((count / total) * 100).toFixed(1))
          : 0
    };
  });

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#4f46e5"
  ];

  // ================= PAGINATION =================
  const indexOfLast = currentPage * rowsPerPage;

  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentRows = filtered.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages =
    Math.ceil(filtered.length / rowsPerPage) || 1;

  // ================= RESET FILTERS =================
  const resetFilters = () => {
    setFilterId("");
    setFilterRating("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ================= CHANGE PASSWORD =================
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/admin/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            username: "admin",
            oldPassword: oldPass,
            newPassword: newPass
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Password change failed");
        return;
      }

      alert("Password updated successfully");

      setOldPass("");
      setNewPass("");
      setShowModal(false);

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  // ================= RATING STATS =================
  const ratingStats = [5, 4, 3, 2, 1].map((r) => {
    const count = filtered.filter(
      (f) => Number(f.rating) === r
    ).length;

    return {
      rating: r,
      count,
      percent:
        total > 0
          ? ((count / total) * 100).toFixed(1)
          : 0
    };
  });

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const excelData = filtered.map((f) => ({
      CustomerID: f.customerId,
      Rating: f.rating,
      Comment: f.comment,
      Date: formatDate(f.createdAt)
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Feedback"
    );

    XLSX.writeFile(
      workbook,
      "feedback-report.xlsx"
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Admin Dashboard
        </h2>

        <div style={styles.headerBtns}>
          <button
            style={styles.primaryBtn}
            onClick={() => setShowModal(true)}
          >
            🔐 Change Password
          </button>

          <button
            style={styles.dangerBtn}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.filters}>
          <input
            style={styles.input}
            placeholder="Customer ID"
            value={filterId}
            onChange={(e) =>
              setFilterId(e.target.value)
            }
          />

          <input
            style={styles.input}
            placeholder="Rating"
            value={filterRating}
            onChange={(e) =>
              setFilterRating(e.target.value)
            }
          />

          <input
            style={styles.input}
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />

          <input
            style={styles.input}
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
          />

          <button
            onClick={resetFilters}
            style={styles.resetBtn}
          >
            Reset
          </button>

          <button
            onClick={exportExcel}
            style={styles.excelBtn}
          >
            Export Excel
          </button>
        </div>

        <div style={styles.tile}>
          <h3>📊 Rating Distribution</h3>

          <div style={styles.tileGrid}>
            {ratingStats.map((r) => (
              <div
                key={r.rating}
                style={styles.tileBox}
              >
                <strong>{r.rating} ⭐</strong>

                <div>{r.count} Reviews</div>

                <div>{r.percent}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartWrap}>
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label={({ value }) =>
                  `${value}%`
                }
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(v) =>
                  `${v}%`
                }
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  Customer ID
                </th>

                <th style={styles.th}>
                  Rating
                </th>

                <th style={styles.th}>
                  Comment
                </th>

                <th style={styles.th}>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length ? (
                currentRows.map((f, i) => (
                  <tr key={i}>
                    <td style={styles.td}>
                      {f.customerId}
                    </td>

                    <td style={styles.td}>
                      {f.rating}
                    </td>

                    <td style={styles.td}>
                      {f.comment}
                    </td>

                    <td style={styles.td}>
                      {formatDate(f.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={styles.noData}
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
{/* ================= PAGINATION ================= */}
<div style={styles.pagination}>
  <button
    style={styles.pageBtn}
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage((prev) => prev - 1)
    }
  >
    ⬅ Previous
  </button>

  <span>
    {currentPage} / {totalPages}
  </span>

  <button
    style={styles.pageBtn}
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage((prev) => prev + 1)
    }
  >
    Next ➡
  </button>
</div>
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Change Password</h3>

            <input
              style={styles.input}
              type="password"
              placeholder="Old Password"
              value={oldPass}
              onChange={(e) =>
                setOldPass(e.target.value)
              }
            />

            <input
              style={styles.input}
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) =>
                setNewPass(e.target.value)
              }
            />

            <div style={styles.modalBtns}>
              <button
                style={styles.primaryBtn}
                onClick={changePassword}
              >
                Update
              </button>

              <button
                style={styles.dangerBtn}
                onClick={() =>
                  setShowModal(false)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* KEEP YOUR ORIGINAL STYLES EXACTLY */
const styles = {
  page: {
    padding: 20,
    background: "#f4f6f8",
    minHeight: "100vh"
  },

  title: {
    margin: 0
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  headerBtns: {
    display: "flex",
    gap: 10
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },

  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20
  },

  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 8,
    minWidth: 150
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },

  dangerBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },

  resetBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },

  excelBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer"
  },

  tile: {
    marginTop: 10,
    marginBottom: 20,
    background: "#f8fafc",
    padding: 15,
    borderRadius: 10
  },

  tileGrid: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  },

  tileBox: {
    flex: 1,
    minWidth: 100,
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    textAlign: "center",
    border: "1px solid #e5e7eb"
  },

  chartWrap: {
    width: "100%",
    height: 320,
    marginTop: 20
  },

  tableWrap: {
    marginTop: 20,
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  },

  th: {
    background: "#e2e8f0",
    padding: 12,
    textAlign: "left",
    borderBottom: "1px solid #cbd5e1"
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    wordBreak: "break-word"
  },

  noData: {
    padding: 20,
    textAlign: "center"
  },

  pagination: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },

  pageBtn: {
    background: "#0ea5e9",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  modalBtns: {
    display: "flex",
    gap: 10,
    marginTop: 10
  }
};