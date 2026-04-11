import {
  TeamOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const StatCards = ({ data = [] }) => {
  const total = data.length;
  const hired = data.filter((d) => d.status === "Hired").length;
  const active = data.filter((d) => d.status === "Active").length;
  const roles = [...new Set(data.map((d) => d.role).filter(Boolean))].length;

  const cardStyle = (bgColor, textColor) => ({
    background: bgColor,
    padding: "24px",
    borderRadius: "12px",
    flex: 1,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    border: `1px solid ${textColor}20`,
  });

  const labelStyle = (textColor) => ({
    fontSize: "18px",
    fontWeight: "600",
    color: textColor,
    margin: 0,
  });

  const valueStyle = (textColor) => ({
    fontSize: "36px",
    fontWeight: "700",
    color: textColor,
    margin: 0,
  });

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
      {/* Total Candidates */}
      <div style={cardStyle("#eef2ff", "#4338ca")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#4338ca")}>Total Candidates</h3>
          <TeamOutlined style={{ fontSize: "24px", opacity: 0.5 }} />
        </div>
        <p style={valueStyle("#4338ca")}>{total}</p>
      </div>

      {/* Hired Candidates */}
      <div style={cardStyle("#f0fdf4", "#15803d")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#15803d")}>Hired Candidates</h3>
          <TrophyOutlined style={{ fontSize: "24px", opacity: 0.5 }} />
        </div>
        <p style={valueStyle("#15803d")}>{hired}</p>
      </div>

      {/* Active Candidates */}
      <div style={cardStyle("#f5f3ff", "#6d28d9")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#6d28d9")}>Active Candidates</h3>
          <CheckCircleOutlined style={{ fontSize: "24px", opacity: 0.5 }} />
        </div>
        <p style={valueStyle("#6d28d9")}>{active}</p>
      </div>

      {/* Unique Roles */}
      <div style={cardStyle("#fffbeb", "#b45309")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#b45309")}>Unique Roles</h3>
          <AppstoreOutlined style={{ fontSize: "24px", opacity: 0.5 }} />
        </div>
        <p style={valueStyle("#b45309")}>{roles}</p>
      </div>
    </div>
  );
};

export default StatCards;
