import { useEffect, useState } from "react";
import { Radio, Modal } from "antd";

import StatCards from "../../components/dashboard/StatCards";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import CandidateFormModal from "../../components/ui/CandidateFormModal";
import AgGridTable from "../../components/ui/AgGridTable";

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

  /* ── Modal Column Definitions ── */
  const modalColumnDefs = [
    { field: "name", headerName: "Name", flex: 2, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 1.5, minWidth: 120 },
    { field: "experience", headerName: "Exp.", flex: 1, minWidth: 80 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
  ];

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
        width={1000}
        centered
        title={
          <span style={{ fontSize: "20px", fontWeight: 800, color: darkMode ? "#f1f5f9" : "#1e293b" }}>
            {statCardModal.type === "applied"
              ? "Applied Candidates"
              : `${statCardModal.type?.charAt(0).toUpperCase()}${statCardModal.type?.slice(1)} Candidates`}
          </span>
        }
        styles={{
          body: { padding: "0 24px 24px 24px", background: darkMode ? "#1e293b" : "#fff" },
          mask: { backdropFilter: "blur(4px)" }
        }}
      >
        <div style={{ marginTop: 16 }}>
          <AgGridTable
            rowData={statCardModal.data}
            columnDefs={modalColumnDefs}
            gridId={`stat-${statCardModal.type}`}
            paginationPageSize={10}
            theme={darkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
            enableCheckboxes={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;