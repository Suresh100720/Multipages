import { useMemo, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Dropdown, message, Modal } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ColumnsToolPanelModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule, ColumnsToolPanelModule]);

import { exportToExcel } from "../../utils/exportExcel";
import { deleteCandidate } from "../../services/api";

const { confirm } = Modal;
const LS_KEY = "aggridColumnState";

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] || "#94a3b8";

/* ── Custom Cell Renderers ── */
const CandidateCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center gap-2 h-100">
    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm flex-shrink-0"
         style={{ width: 28, height: 28, background: avatarColor(value), fontSize: 10 }}>
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

/**
 * Dashboard Grid with AG Grid v35 Integration.
 * Refined with Row-level Actions and Fixed Sidebar Sync.
 */
const DashboardGrid = ({ rowData, onAddCandidate, refreshData }) => {
  const gridRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);

  /* ── Actions Helper ── */
  const handleDelete = useCallback((id) => {
    confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to remove this candidate from the dashboard?",
      okType: "danger", okText: "Delete", centered: true,
      onOk: async () => {
        try {
          await deleteCandidate(id);
          message.success("Candidate removed.");
          if (refreshData) refreshData();
        } catch {
          message.error("Failed to delete candidate.");
        }
      },
    });
  }, [refreshData]);

  const ActionsCellRenderer = useCallback(({ data }) => {
    const items = [
      { key: "delete", icon: <DeleteOutlined />, label: "Delete", danger: true, onClick: () => handleDelete(data._id) },
    ];
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button type="text" shape="circle" icon={<MoreOutlined className="text-secondary" />} />
        </Dropdown>
      </div>
    );
  }, [handleDelete]);

  /* ── Sidebar Config ── */
  const sideBar = useMemo(() => ({
    toolPanels: ["columns"],
  }), []);

  /* ── Column Defs ── */
  const columnDefs = useMemo(() => [
    {
      field: "name",
      headerName: "Name",
      cellRenderer: CandidateCellRenderer,
      minWidth: 160,
      flex: 1.5,
      sortable: false
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1.5,
      sortable: false
    },
    {
      field: "role",
      headerName: "Role",
      cellRenderer: RoleCellRenderer,
      minWidth: 150,
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 1
    },
    {
      field: "experience",
      headerName: "Experience",
      minWidth: 120,
      flex: 1
    },
    {
      field: "country",
      headerName: "Country",
      minWidth: 110,
      flex: 1
    },
    {
      field: "state",
      headerName: "State",
      minWidth: 110,
      flex: 1
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      width: 80,
      pinned: "right",
      sortable: false,
      resizable: false,
      suppressHeaderMenuButton: true
    },
  ], [ActionsCellRenderer]);

  /* ── Grid Ready - Restore Column State ── */
  const onGridReady = useCallback(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && gridRef.current?.api) {
      try {
        const columnState = JSON.parse(saved);
        gridRef.current.api.applyColumnState({
          state: columnState,
          applyOrder: true
        });
      } catch (error) {
        console.error('Failed to restore column state:', error);
      }
    }
  }, []);

  /* ── Save Column State on Changes ── */
  const saveColumnState = useCallback(() => {
    if (!gridRef.current?.api) return;
    const columnState = gridRef.current.api.getColumnState();
    localStorage.setItem(LS_KEY, JSON.stringify(columnState));
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selected = gridRef.current.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  const handleExport = () => {
    if (selectedRows.length === 0) {
      return message.warning("Please select at least one candidate to export");
    }
    exportToExcel(selectedRows);
    message.success(`Exported ${selectedRows.length} candidates`);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 className="mb-0 fw-bold text-slate-800 d-flex align-items-center gap-2" style={{ fontSize: "16px" }}>
          <span>📋</span> All Candidates
        </h5>

        <div className="d-flex gap-2">
          {selectedRows.length > 0 && (
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              className="d-flex align-items-center border-success text-success bg-success-subtle"
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Export Selected ({selectedRows.length})
            </Button>
          )}

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddCandidate}
            className="d-flex align-items-center border-0 shadow"
            style={{ borderRadius: 8, background: "#1890ff", fontWeight: 600 }}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ width: "100%", height: "600px" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onColumnVisible={saveColumnState}
          onColumnResized={saveColumnState}
          onColumnMoved={saveColumnState}
          sideBar={sideBar}
          rowSelection={{
            mode: 'multiRow',
            headerCheckbox: true,
            checkboxes: true,
            enableClickSelection: false
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          onSelectionChanged={onSelectionChanged}
          defaultColDef={{
            resizable: true,
            sortable: true,
            minWidth: 100
          }}
        />
      </div>
    </div>
  );
};

export default DashboardGrid;
 