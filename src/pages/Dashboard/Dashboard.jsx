import { useEffect, useState } from "react";
import { Radio, Modal } from "antd";

import StatCards from "../../components/dashboard/StatCards";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import CandidateFormModal from "../../components/ui/CandidateFormModal";

import { fetchCandidates } from "../../services/api";

const Dashboard = ({ darkMode = false }) => {
  const [view, setView] = useState("role");
  const [chartData, setChartData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [statCardModal, setStatCardModal] = useState({ open: false, type: null, data: [] });

  /* ── Load Data ── */
  const loadData = async () => {
    try {
      const res = await fetchCandidates();
      const data = res.data || [];
      setRowData(data);

      // Process for charts
      const map = {};
      data.forEach((c) => {
        const key = view === "role" ? c.role : c.status;
        map[key] = (map[key] || 0) + 1;
      });
      setChartData(Object.keys(map).map((k) => ({ name: k, value: map[k] })));
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [view]);

  /* ── Derived Stats ── */
  const total = rowData.length;
  const active = rowData.filter((r) => r.status === "Active").length;
  const inactive = rowData.filter((r) => r.status === "Inactive").length;
  // Applied candidates = those who have a role set (came via job apply form)
  const appliedCandidates = rowData.filter((r) => r.role && r.role.trim() !== "");
  const appliedCount = appliedCandidates.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* ── Summary Cards ── */}
      <StatCards 
        data={rowData}
        appliedCount={appliedCount}
        onCardClick={(type) => {
          let filteredData = rowData;
          if (type === "active") {
            filteredData = rowData.filter((d) => d.status === "Active");
          } else if (type === "inactive") {
            filteredData = rowData.filter((d) => d.status === "Inactive");
          } else if (type === "applied") {
            filteredData = appliedCandidates;
          }
          setStatCardModal({ open: true, type, data: filteredData });
        }}
      />

      {/* ── Visual Controls & Charts ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Radio.Group
            value={view}
            onChange={(e) => setView(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="role">By Role</Radio.Button>
            <Radio.Button value="status">By Status</Radio.Button>
          </Radio.Group>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
            Visualizing data by {view}
          </span>
        </div>

        <DashboardCharts
          chartData={chartData}
          total={total}
          active={active}
          roles={appliedCount}
        />
      </div>

      {/* ── Table Area ── */}
      <DashboardGrid
        rowData={rowData}
        onAddCandidate={() => {
          setEditData(null);
          setOpen(true);
        }}
        onEditCandidate={(candidate) => {
          setEditData(candidate);
          setOpen(true);
        }}
        refreshData={loadData}
      />

      {/* ── Add/Edit Candidate Modal ── */}
      <CandidateFormModal
        open={open}
        setOpen={setOpen}
        editData={editData}
        refresh={loadData}
        clearEdit={() => setEditData(null)}
        darkMode={darkMode}
      />

      {/* ── StatCard Candidates Modal ── */}
      <Modal
        open={statCardModal.open}
        onCancel={() => setStatCardModal({ ...statCardModal, open: false })}
        footer={null}
        width={920}
        centered
        title={
          <span style={{ fontSize: "18px", fontWeight: 700, color: darkMode ? "#f1f5f9" : "#1e293b" }}>
            {statCardModal.type === "applied"
              ? "Applied Candidates"
              : `${statCardModal.type?.charAt(0).toUpperCase()}${statCardModal.type?.slice(1)} Candidates`}
          </span>
        }
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto", padding: "0", background: darkMode ? "#1e293b" : "#f8fafc" }}
        style={{ background: darkMode ? "#1e293b" : "#fff" }}
      >
        {statCardModal.data && statCardModal.data.length > 0 ? (
          <div style={{ background: darkMode ? "#1e293b" : "#f8fafc" }}>
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.2fr",
                gap: "12px",
                padding: "16px",
                background: darkMode ? "#0f172a" : "#fff",
                borderBottom: `2px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                fontWeight: 700,
                fontSize: "13px",
                color: darkMode ? "#cbd5e1" : "#64748b",
                textTransform: "uppercase",
              }}
            >
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Experience</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {statCardModal.data.map((candidate, idx) => (
                <div
                  key={candidate._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.2fr",
                    gap: "12px",
                    padding: "16px",
                    background: darkMode 
                      ? (idx % 2 === 0 ? "#1e293b" : "#0f172a") 
                      : (idx % 2 === 0 ? "#f8fafc" : "#fff"),
                    borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? "#334155" : "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = darkMode 
                      ? (idx % 2 === 0 ? "#1e293b" : "#0f172a") 
                      : (idx % 2 === 0 ? "#f8fafc" : "#fff");
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, margin: "0", color: darkMode ? "#f1f5f9" : "#1e293b", fontSize: "14px" }}>
                      {candidate.name}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", color: darkMode ? "#cbd5e1" : "#64748b", margin: "0" }}>{candidate.email}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", color: darkMode ? "#cbd5e1" : "#64748b", margin: "0" }}>{candidate.role}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", color: darkMode ? "#cbd5e1" : "#64748b", margin: "0" }}>{candidate.experience}</p>
                  </div>
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: candidate.status === "Active" ? "#d1fae5" : "#fee2e2",
                        color: candidate.status === "Active" ? "#065f46" : "#7f1d1d",
                      }}
                    >
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 24px", color: darkMode ? "#cbd5e1" : "#94a3b8" }}>
            <p style={{ fontSize: "16px", fontWeight: 500 }}>No candidates found</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;