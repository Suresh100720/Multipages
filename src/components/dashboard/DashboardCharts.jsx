import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Tag } from "antd";
import {
  PieChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const PALETTE = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const StatBadge = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{label}</span>
    <Tag color={color} style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{value}</Tag>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.92)", borderRadius: 10, padding: "8px 14px",
      color: "#f1f5f9", fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    }}>
      {label && <p style={{ margin: 0, fontWeight: 700, color: "#a5b4fc" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0 }}>
          <span style={{ color: p.color || "#6366f1" }}>●</span>{" "}
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const DashboardCharts = ({ chartData, total, active, roles }) => {
  const chartCards = [
    {
      title: "Distribution",
      icon: <PieChartOutlined />,
      badge: { label: "Total", value: total, color: "purple" },
      chart: (
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={38}
            outerRadius={62}
            paddingAngle={3}
            strokeWidth={0}
          >
            {chartData.map((_, j) => (
              <Cell key={j} fill={PALETTE[j % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: "#475569" }}>{v}</span>}
          />
        </PieChart>
      ),
    },
    {
      title: "Count by Group",
      icon: <BarChartOutlined />,
      badge: { label: "Active", value: active, color: "cyan" },
      chart: (
        <BarChart data={chartData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
        </BarChart>
      ),
    },
    {
      title: "Trend",
      icon: null,
      badge: { label: "Roles", value: roles, color: "green" },
      chart: (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#areaGrad)"
            dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#f43f5e" }}
          />
        </AreaChart>
      ),
    },
    {
      title: "Radar View",
      icon: null,
      badge: { label: "Groups", value: chartData.length, color: "orange" },
      chart: (
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius={60}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: "#cbd5e1" }} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            fill="#6366f1"
            fillOpacity={0.25}
            dot={{ r: 4, fill: "#6366f1" }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {chartCards.map(({ title, badge, chart }, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "16px 18px 12px",
            boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
            border: "1px solid #f1f5f9",
            transition: "box-shadow .2s, transform .2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.18)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.6 }}>
              {title}
            </p>
            <StatBadge label={badge.label} value={badge.value} color={badge.color} />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            {chart}
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default DashboardCharts;
