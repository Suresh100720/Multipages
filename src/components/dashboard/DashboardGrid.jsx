import { useMemo, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Dropdown, message, Modal, Tooltip, Typography } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ColumnsToolPanelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule, ColumnsToolPanelModule]);

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

const StatusCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center h-100">
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: value === "Active" ? "#d1fae5" : "#fee2e2",
      color: value === "Active" ? "#065f46" : "#7f1d1d",
    }}>
      {value}
    </span>
  </div>
);

/**
 * Dashboard Grid with AG Grid v35 Integration.
 * - autoHeight layout (no fixed height, no blank space)
 * - Row Edit + Delete actions
 * - Bulk Delete + Export on selection
 * - Confirmation modals for all destructive actions
 */
const DashboardGrid = ({ rowData, onAddCandidate, onEditCandidate, refreshData }) => {
  const gridRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);


  /* ── Auto Height on Grid Ready ── */
  const onGridReady = useCallback(() => {
    // Set domLayout to autoHeight so the grid expands to fit content
    gridRef.current.api.setGridOption("domLayout", "autoHeight");
    const el = document.getElementById(GRID_ID);
    if (el) el.style.height = "";

    // Restore saved column state
    const saved = localStorage.getItem(LS_KEY);
    if (saved && gridRef.current?.api) {
      try {
        const columnState = JSON.parse(saved);
        gridRef.current.api.applyColumnState({ state: columnState, applyOrder: true });
      } catch (err) {
        console.error("Failed to restore column state:", err);
      }
    }
  }, []);

  /* ── Save Column State on Changes ── */
  const saveColumnState = useCallback(() => {
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

  /* ── Export with Confirmation ── */
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

  /* ── Add Candidate (direct, no popup) ── */
  const handleAddCandidate = useCallback(() => {
    if (onAddCandidate) onAddCandidate();
  }, [onAddCandidate]);

  /* ── Row Actions Cell Renderer ── */
  const ActionsCellRenderer = useCallback(({ data }) => {
    const items = [
      {
        key: "edit",
        icon: <EditOutlined style={{ color: "#6366f1" }} />,
        label: <span style={{ color: "#6366f1", fontWeight: 600 }}>Edit</span>,
        onClick: () => {
          // Open edit form directly — confirmation is inside the form on Save/Cancel
          if (onEditCandidate) onEditCandidate(data);
        },
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

  /* ── Sidebar Config ── */
  const sideBar = useMemo(() => ({ toolPanels: ["columns"] }), []);

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
      cellRenderer: StatusCellRenderer,
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
      field: "state",
      headerName: "State",
      minWidth: 110,
      flex: 1,
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

  const onSelectionChanged = useCallback(() => {
    const selected = gridRef.current.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* ── Toolbar ── */}
      <div
        style={{
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              fontWeight: 800,
              color: "#27a2c1ff",
              fontSize: 20,
              letterSpacing: "-0.3px",
            }}
          >
            All Candidates
          </Typography.Title>
          {selectedRows.length > 0 && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                background: "#ede9fe",
                color: "#6366f1",
                padding: "2px 10px",
                borderRadius: 20,
              }}
            >
              {selectedRows.length} selected
            </span>
          )}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {/* Bulk Delete – only visible when rows are selected */}
          {selectedRows.length > 0 && (
            <Tooltip title={`Delete ${selectedRows.length} selected`}>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                style={{ borderRadius: 8, fontWeight: 600 }}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            </Tooltip>
          )}

          {/* Export – only visible when rows are selected */}
          {selectedRows.length > 0 && (
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                borderColor: "#16a34a",
                color: "#16a34a",
              }}
            >
              Export ({selectedRows.length})
            </Button>
          )}

          {/* Add Candidate */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCandidate}
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(99,102,241,0.35)",
            }}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      {/* ── AG Grid – autoHeight (no fixed height wrapper) ── */}
      <div id={GRID_ID} className="ag-theme-alpine" style={{ width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onColumnVisible={saveColumnState}
          onColumnResized={saveColumnState}
          onColumnMoved={saveColumnState}
          sideBar={sideBar}
          domLayout="autoHeight"
          rowSelection={{
            mode: "multiRow",
            headerCheckbox: true,
            checkboxes: true,
            enableClickSelection: false,
          }}
          selectionColumnDef={{
            pinned: "left",
            lockPinned: true,
            lockPosition: "left",
            minWidth: 48,
            maxWidth: 48,
            resizable: false,
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          onSelectionChanged={onSelectionChanged}
          defaultColDef={{
            resizable: true,
            sortable: true,
            minWidth: 100,
          }}
          rowHeight={52}
          headerHeight={48}
        />
      </div>
    </div>
  );
};

export default DashboardGrid;