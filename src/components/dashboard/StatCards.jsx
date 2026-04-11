import {
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const StatCards = ({ data = [], onCardClick }) => {
  const total = data.length;
  const inactive = data.filter((d) => d.status === "Inactive").length;
  const active = data.filter((d) => d.status === "Active").length;
  const roles = [...new Set(data.map((d) => d.role).filter(Boolean))].length;

  const cardStyle = (bgColor, textColor, isClickable = false) => ({
    ...{
      cursor: isClickable ? "pointer" : "default",
      transition: isClickable ? "all 0.3s ease" : "none",
    },
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
    fontSize: "40px",
    fontWeight: "800",
    color: textColor,
    margin: 0,
  });

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
      {/* Total Candidates */}
      <div 
        style={cardStyle("#eef2ff", "#4338ca", true)}
        onClick={() => onCardClick && onCardClick("total")}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(67, 56, 202, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#4338ca")}>Total Candidates</h3>
          <TeamOutlined style={{ fontSize: "24px", opacity: 0.6, color: "#4338ca" }} />
        </div>
        <p style={valueStyle("#4338ca")}>{total}</p>
      </div>

      {/* Inactive Candidates */}
      <div 
        style={cardStyle("#fef2f2", "#dc2626", true)}
        onClick={() => onCardClick && onCardClick("inactive")}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(220, 38, 38, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#dc2626")}>Inactive Candidates</h3>
          <StopOutlined style={{ fontSize: "24px", opacity: 0.6, color: "#dc2626" }} />
        </div>
        <p style={valueStyle("#dc2626")}>{inactive}</p>
      </div>

      {/* Active Candidates */}
      <div 
        style={cardStyle("#f5f3ff", "#6d28d9", true)}
        onClick={() => onCardClick && onCardClick("active")}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(109, 40, 217, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#6d28d9")}>Active Candidates</h3>
          <CheckCircleOutlined style={{ fontSize: "24px", opacity: 0.6, color: "#6d28d9" }} />
        </div>
        <p style={valueStyle("#6d28d9")}>{active}</p>
      </div>

      {/* Unique Roles */}
      <div 
        style={cardStyle("#fffbeb", "#b45309", true)}
        onClick={() => onCardClick && onCardClick("roles")}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 20px -4px rgba(180, 83, 9, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={labelStyle("#b45309")}>Unique Roles</h3>
          <AppstoreOutlined style={{ fontSize: "24px", opacity: 0.6, color: "#b45309" }} />
        </div>
        <p style={valueStyle("#b45309")}>{roles}</p>
      </div>
    </div>
  );
};

export default StatCards;
