import { useEffect, useState } from "react";
import { Radio } from "antd";

import StatCards from "../../components/dashboard/StatCards";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import DashboardGrid from "../../components/dashboard/DashboardGrid";
import CandidateFormModal from "../Candidates/CandidateFormModal";

import { fetchCandidates } from "../../services/api";

const Dashboard = () => {
  const [view, setView] = useState("role");
  const [chartData, setChartData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [open, setOpen] = useState(false);

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
  const roles = [...new Set(rowData.map((r) => r.role))].length;

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* ── Summary Cards ── */}
      <StatCards data={rowData} />

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
          roles={roles}
        />
      </div>

      {/* ── Table Area ── */}
      <DashboardGrid
        rowData={rowData}
        onAddCandidate={() => setOpen(true)}
        refreshData={loadData}
      />

      {/* ── Add Candidate Modal ── */}
      <CandidateFormModal
        open={open}
        setOpen={setOpen}
        refresh={loadData}
        clearEdit={() => {}} // No edit mode here
      />
    </div>
  );
};

export default Dashboard;