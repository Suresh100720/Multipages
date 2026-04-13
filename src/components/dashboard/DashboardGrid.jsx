import { useMemo, useRef, useState, useCallback } from "react";
import { Button, Dropdown, message, Modal, Tooltip, Typography } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import AgGridTable from "../ui/AgGridTable";
import { exportToExcel } from "../../utils/exportExcel";
import { deleteCandidate, bulkDelete } from "../../services/api";

const { confirm } = Modal;
const LS_KEY = "aggridColumnState";
const GRID_ID = "dashboardCandidateGrid";

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || "#94a3b8";

/* ── Custom Cell Renderers ── */
const CandidateCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center gap-2 h-100">
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm flex-shrink-0"
      style={{ width: 28, height: 28, background: avatarColor(value), fontSize: 10 }}
    >
      {value?.charAt(0).toUpperCase()}
    </div>
    <span className="fw-bold text-dark text-truncate" style={{ fontSize: 13 }}>{value}</span>
  </div>
);

const RoleCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center h-100">
    <span className="text-secondary fw-semibold" style={{ fontSize: 13 }}>
      {value || "N/A"}
    </span>
  </div>
);

const ResumeCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center h-100">
    {value ? (
      <Tooltip title="Download Resume">
        <a 
          href={`http://127.0.0.1:5000/uploads/${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#6366f1", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
        >
          <FilePdfOutlined style={{ fontSize: 16 }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>View</span>
        </a>
      </Tooltip>
    ) : (
      <span className="text-secondary" style={{ fontSize: 13 }}>—</span>
    )}
  </div>
);

/**
 * Dashboard Grid using the modular AgGridTable.
 */
const DashboardGrid = ({ rowData, onAddCandidate, onEditCandidate, refreshData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef();

  /* ── Restore Column State ── */
  const onGridReady = useCallback((params) => {
    gridRef.current = params;
    const saved = localStorage.getItem(LS_KEY);
    if (saved && params.api) {
      try {
        const columnState = JSON.parse(saved);
        params.api.applyColumnState({ state: columnState, applyOrder: true });
      } catch (err) {
        console.error("Failed to restore column state:", err);
      }
    }
  }, []);

  /* ── Save Column State ── */
  const onColumnChanged = useCallback(() => {
    if (!gridRef.current?.api) return;
    const columnState = gridRef.current.api.getColumnState();
    localStorage.setItem(LS_KEY, JSON.stringify(columnState));
  }, []);

  /* ── Single Row Delete ── */
  const handleDelete = useCallback((id, name) => {
    confirm({
      title: "Delete Candidate",
      content: `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      okType: "danger",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteCandidate(id);
          message.success("Candidate deleted successfully.");
          if (refreshData) refreshData();
        } catch {
          message.error("Failed to delete candidate. Please try again.");
        }
      },
    });
  }, [refreshData]);

  /* ── Bulk Delete ── */
  const handleBulkDelete = useCallback(() => {
    if (selectedRows.length === 0) return;
    confirm({
      title: `Delete ${selectedRows.length} Candidate(s)?`,
      content: `You are about to permanently delete ${selectedRows.length} selected candidate(s). This action cannot be undone.`,
      okType: "danger",
      okText: `Delete ${selectedRows.length} Candidates`,
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const ids = selectedRows.map((r) => r._id);
          await bulkDelete(ids);
          message.success(`${selectedRows.length} candidates deleted.`);
          setSelectedRows([]);
          if (refreshData) refreshData();
        } catch {
          message.error("Bulk delete failed. Please try again.");
        }
      },
    });
  }, [selectedRows, refreshData]);

  /* ── Export ── */
  const handleExport = useCallback(() => {
    if (selectedRows.length === 0) {
      return message.warning("Please select at least one candidate to export.");
    }
    confirm({
      title: `Export ${selectedRows.length} Candidate(s)?`,
      content: `This will export the ${selectedRows.length} selected candidate(s) to an Excel file.`,
      okText: "Export",
      cancelText: "Cancel",
      centered: true,
      onOk: () => {
        exportToExcel(selectedRows);
        message.success(`Exported ${selectedRows.length} candidates to Excel.`);
      },
    });
  }, [selectedRows]);

  /* ── Actions Cell Renderer ── */
  const ActionsCellRenderer = useCallback(({ data }) => {
    const items = [
      {
        key: "edit",
        icon: <EditOutlined style={{ color: "#6366f1" }} />,
        label: <span style={{ color: "#6366f1", fontWeight: 600 }}>Edit</span>,
        onClick: () => onEditCandidate && onEditCandidate(data),
      },
      { type: "divider" },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        danger: true,
        onClick: () => handleDelete(data._id, data.name),
      },
    ];

    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined style={{ fontSize: 18, color: "#64748b" }} />}
          />
        </Dropdown>
      </div>
    );
  }, [handleDelete, onEditCandidate]);

  /* ── Column Defs ── */
  const columnDefs = useMemo(() => [
    {
      field: "name",
      headerName: "Name",
      cellRenderer: CandidateCellRenderer,
      minWidth: 160,
      flex: 1.5,
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1.5,
      sortable: true,
    },
    {
      field: "role",
      headerName: "Role",
      cellRenderer: RoleCellRenderer,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "experience",
      headerName: "Experience",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "country",
      headerName: "Country",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "resume",
      headerName: "Resume",
      cellRenderer: ResumeCellRenderer,
      minWidth: 100,
      flex: 1,
      sortable: false,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      width: 90,
      pinned: "right",
      lockPinned: true,
      sortable: false,
      resizable: false,
      suppressHeaderMenuButton: true,
    },
  ], [ActionsCellRenderer]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: 800, color: "#27a2c1ff", fontSize: 20, letterSpacing: "-0.3px" }}>
            All Candidates
          </Typography.Title>
          {selectedRows.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, background: "#ede9fe", color: "#6366f1", padding: "2px 10px", borderRadius: 20 }}>
              {selectedRows.length} selected
            </span>
          )}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {selectedRows.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} style={{ borderRadius: 8, fontWeight: 600 }}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          {selectedRows.length > 0 && (
            <Button icon={<FileExcelOutlined />} onClick={handleExport} style={{ borderRadius: 8, fontWeight: 600, borderColor: "#16a34a", color: "#16a34a" }}>
              Export ({selectedRows.length})
            </Button>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddCandidate} style={{ borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", fontWeight: 600, boxShadow: "0 4px 10px rgba(99,102,241,0.35)" }}>
            Add Candidate
          </Button>
        </div>
      </div>

      <AgGridTable
        gridId={GRID_ID}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onColumnChanged={onColumnChanged}
        onSelectionChanged={() => {
          if (gridRef.current?.api) {
            setSelectedRows(gridRef.current.api.getSelectedRows());
          }
        }}
        sideBar={{ toolPanels: ["columns"] }}
        selectionColumnDef={{
           pinned: "left",
           lockPinned: true,
           lockPosition: "left",
           minWidth: 48,
           maxWidth: 48,
           resizable: false,
        }}
      />
    </div>
  );
};

export default DashboardGrid;