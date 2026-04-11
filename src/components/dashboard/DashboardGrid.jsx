import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Dropdown, Checkbox, message, Modal } from "antd";
import {
  PlusOutlined,
  FileExcelOutlined,
  SettingOutlined,
  DeleteOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { exportToExcel } from "../../utils/exportExcel";
import { deleteCandidate } from "../../services/api";

const { confirm } = Modal;
const LS_KEY = "dashboardGridState_v35_final_v2"; // Increment version for new schema

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

const ALL_COLUMNS = [
  { field: "name", label: "Name", cellRenderer: CandidateCellRenderer, minWidth: 160, flex: 1.5 },
  { field: "email", label: "Email", minWidth: 200, flex: 1.5 },
  { field: "role", label: "Role", cellRenderer: RoleCellRenderer, minWidth: 150 },
  { field: "status", label: "Status", minWidth: 120 },
  { field: "experience", label: "Experience", minWidth: 120 },
  { field: "country", label: "Country", minWidth: 110 },
  { field: "state", label: "State", minWidth: 110 },
];

/**
 * Dashboard Grid with AG Grid v35 Integration.
 * Refined with Row-level Actions and Fixed Sidebar Sync.
 */
const DashboardGrid = ({ rowData, onAddCandidate, refreshData }) => {
  const gridRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleCols, setVisibleCols] = useState(() => ALL_COLUMNS.map(c => c.field));
  
  // Load saved state for initialState
  const initialState = useMemo(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return undefined;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return undefined;
    }
  }, []);

  // Effect to sync visibility on mount if initialState exists
  useEffect(() => {
    if (initialState?.columnVisibility) {
      const visible = ALL_COLUMNS.map(c => c.field).filter(f => initialState.columnVisibility[f] !== false);
      setVisibleCols(visible);
    }
  }, [initialState]);

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

  /* ── Column Defs ── */
  const columnDefs = useMemo(() => [
    ...ALL_COLUMNS.map((col) => ({
      field: col.field,
      headerName: col.label,
      cellRenderer: col.cellRenderer,
      minWidth: col.minWidth,
      flex: col.flex || 1
    })),
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

  /* ── State Change Handler ── */
  const onStateUpdated = useCallback((params) => {
    const state = params.api.getState();
    localStorage.setItem(LS_KEY, JSON.stringify(state));

    if (state.columnVisibility) {
      const currentlyVisible = ALL_COLUMNS.map(c => c.field).filter(f => state.columnVisibility[f] !== false);
      setVisibleCols(currentlyVisible);
    }
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

  const toggleColumn = useCallback((field, checked) => {
    if (!gridRef.current?.api) return;
    gridRef.current.api.setColumnsVisible([field], checked);
  }, []);

  const colPickerMenu = {
    items: ALL_COLUMNS.map(({ field, label }) => ({
      key: field,
      label: (
        <Checkbox
          checked={visibleCols.includes(field)}
          onChange={(e) => toggleColumn(field, e.target.checked)}
          className="w-100 py-1"
        >
          {label}
        </Checkbox>
      ),
    })),
    styles: { root: { minWidth: 180, padding: '8px', borderRadius: '8px' } } 
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-slate-800 d-flex align-items-center gap-2">
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
            style={{ borderRadius: 8, background: "#1e293b", fontWeight: 600 }}
          >
            Add Candidate
          </Button>
        </div>
      </div>

      <div className="position-relative d-flex" style={{ height: 450 }}>
        <div className="ag-theme-alpine flex-grow-1" style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            initialState={initialState}
            onStateUpdated={onStateUpdated}
            rowSelection={{
              mode: 'multiRow',
              headerCheckbox: true,
              checkboxes: true,
              enableClickSelection: false
            }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[5, 10, 20, 30]}
            onSelectionChanged={onSelectionChanged}
            defaultColDef={{
              resizable: true,
              sortable: true,
              minWidth: 100
            }}
          />
        </div>

        {/* Sidebar Column Toggle */}
        <div 
          className="border-start bg-light-subtle d-flex flex-column align-items-center py-4 shadow-sm" 
          style={{ width: 48, cursor: "pointer" }}
        >
          <Dropdown
            menu={colPickerMenu}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <div 
              className="text-uppercase fw-bolder text-secondary d-flex flex-column align-items-center gap-3"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontSize: 10,
                letterSpacing: 1.5,
              }}
            >
              <SettingOutlined style={{ transform: "rotate(90deg)", fontSize: 16 }} />
              Columns
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;
