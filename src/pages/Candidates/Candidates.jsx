import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Input, Select, Modal, message, Button, Dropdown, Checkbox } from "antd";
import {
  PlusOutlined, FileExcelOutlined, DeleteOutlined,
  EditOutlined, SearchOutlined, MoreOutlined, SettingOutlined
} from "@ant-design/icons";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgGridReact } from "ag-grid-react";

import CandidateFormModal from "./CandidateFormModal";
import { exportToExcel } from "../../utils/exportExcel";
import { fetchCandidates, deleteCandidate, bulkDelete } from "../../services/api";

const { confirm } = Modal;
const LS_KEY = "candidatesPageGridState_v35"; // New key for v35 State API

/* ── status colour map ── */
const STATUS_COLOR = {
  Active:       { color: "#16a34a", bg: "#f0fdf4", border: "#dcfce7" },
  Inactive:     { color: "#4b5563", bg: "#f9fafb", border: "#f3f4f6" },
  New:          { color: "#4f46e5", bg: "#eef2ff", border: "#e0e7ff" },
  Interviewing: { color: "#d97706", bg: "#fffbe6", border: "#fff1b8" },
  Hired:        { color: "#059669", bg: "#ecfdf5", border: "#d1fae5" },
  Screening:    { color: "#2563eb", bg: "#eff6ff", border: "#dbeafe" },
  Rejected:     { color: "#dc2626", bg: "#fef2f2", border: "#fee2e2" },
};

const AVATAR_COLORS = ["#6366f1","#8b5cf6","#0ea5e9","#10b981","#f59e0b","#f43f5e","#14b8a6"];
const avatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ── Custom Cell Renderers ── */
const CandidateCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center gap-2 h-100">
    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
         style={{ width: 30, height: 30, background: avatarColor(value), fontSize: 11 }}>
      {value?.charAt(0).toUpperCase()}
    </div>
    <span className="fw-bold text-dark text-truncate" style={{ fontSize: 13 }}>{value}</span>
  </div>
);

const StatusCellRenderer = ({ value }) => {
  const cfg = STATUS_COLOR[value] || { color: "#6b7280", bg: "#f9fafb", border: "#d1d5db" };
  return (
    <div className="d-flex align-items-center h-100">
      <span className="badge px-3 py-1 rounded-pill d-flex align-items-center gap-1"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: 11 }}>
        <span className="rounded-circle" style={{ width: 6, height: 6, background: cfg.color }} />
        {value || "New"}
      </span>
    </div>
  );
};

const RoleCellRenderer = ({ value }) => (
  <div className="d-flex align-items-center h-100">
    <span className="fw-semibold text-secondary" style={{ fontSize: 13 }}>
      {value || "Not Set"}
    </span>
  </div>
);

const LocationCellRenderer = ({ data }) => {
  if (!data) return null;
  const location = [data.state, data.country].filter(Boolean).join(", ") || "Not Specified";
  return (
    <div className="text-secondary h-100 d-flex align-items-center gap-1 text-truncate" style={{ fontSize: 12 }}>
      <span>📍</span> {location}
    </div>
  );
};

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const gridRef = useRef();

  // Load saved state for initialState
  const initialState = useMemo(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return undefined;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved candidate grid state", e);
      return undefined;
    }
  }, []);

  // Sync visibility labels
  const [visibleColIds, setVisibleColIds] = useState(() => {
    const baseFields = ["name", "email", "role", "status", "experience", "state"];
    return baseFields;
  });

  // Sync visibility labels with persistent state on mount
  useEffect(() => {
    if (initialState?.columnVisibility) {
      const baseFields = ["name", "email", "role", "status", "experience", "state"];
      const visible = baseFields.filter(f => initialState.columnVisibility[f] !== false);
      setVisibleColIds(visible);
    }
  }, [initialState]);

  const loadData = async () => {
    try {
      const res = await fetchCandidates();
      const data = Array.isArray(res.data) ? res.data : [];
      setCandidates(data);
      setFilteredData(data);
    } catch {
      message.error("Unable to connect to candidate database.");
      setCandidates([]);
      setFilteredData([]);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let data = [...candidates];
    if (searchText) data = data.filter((c) => (c.name || "").toLowerCase().includes(searchText.toLowerCase()));
    if (roleFilter) data = data.filter((c) => c.role === roleFilter);
    if (statusFilter) data = data.filter((c) => c.status === statusFilter);
    setFilteredData(data);
  }, [searchText, roleFilter, statusFilter, candidates]);

  /* ── Persistence Logic (v35 Modern State API) ── */
  const onStateUpdated = useCallback((params) => {
    const state = params.api.getState();
    localStorage.setItem(LS_KEY, JSON.stringify(state));

    if (state.columnVisibility) {
      const baseFields = ["name", "email", "role", "status", "experience", "state"];
      const visible = baseFields.filter(f => state.columnVisibility[f] !== false);
      setVisibleColIds(prev => JSON.stringify(prev) === JSON.stringify(visible) ? prev : visible);
    }
  }, []);

  /* ── Actions ── */
  const handleDelete = useCallback((id) => {
    confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to remove this candidate? This cannot be undone.",
      okType: "danger", okText: "Delete", centered: true,
      onOk: async () => {
        await deleteCandidate(id);
        message.success("Candidate removed.");
        loadData();
      },
    });
  }, []);

  const handleBulkDelete = () => {
    confirm({
      title: `Delete ${selectedRows.length} Candidates?`,
      content: "All selected records will be permanently removed.",
      okType: "danger", okText: "Delete Selected", centered: true,
      onOk: async () => {
        await bulkDelete(selectedRows.map(r => r._id));
        message.success("Batch deletion successful.");
        loadData();
      },
    });
  };

  const ActionsCellRenderer = useCallback(({ data }) => {
    const items = [
      { key: "edit", icon: <EditOutlined />, label: "Edit Profile", onClick: () => { setEditData(data); setOpen(true); } },
      { key: "delete", icon: <DeleteOutlined />, label: "Delete", danger: true, onClick: () => handleDelete(data._id) },
    ];
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <div style={{ transform: 'scale(0.85)' }}>
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button type="text" shape="circle" icon={<MoreOutlined className="text-muted" />} />
          </Dropdown>
        </div>
      </div>
    );
  }, [handleDelete]);

  const columnDefs = useMemo(() => [
    { headerName: "Name", field: "name", cellRenderer: CandidateCellRenderer, minWidth: 150, flex: 1.5 },
    { headerName: "Email", field: "email", minWidth: 180, flex: 1.5 },
    { headerName: "Role", field: "role", cellRenderer: RoleCellRenderer, minWidth: 160 },
    { headerName: "Status", field: "status", cellRenderer: StatusCellRenderer, minWidth: 140 },
    { headerName: "Experience", field: "experience", minWidth: 120 },
    { headerName: "Location", field: "state", cellRenderer: LocationCellRenderer, minWidth: 160 },
    { headerName: "Actions", cellRenderer: ActionsCellRenderer, width: 80, pinned: "right", sortable: false, resizable: false, suppressHeaderMenuButton: true },
  ], [ActionsCellRenderer]);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current?.api) {
      setSelectedRows(gridRef.current.api.getSelectedRows());
    }
  }, []);

  const hasSelection = selectedRows.length > 0;

  const toggleColumnVisibility = (field, checked) => {
    if (gridRef.current?.api) {
      gridRef.current.api.setColumnsVisible([field], checked);
    }
  };

  return (
    <div className="container-fluid py-4 h-100 d-flex flex-column gap-3">
      {/* Bootstrap Header */}
      <div className=" row align-items-center g-3">
        <div className="col">
          <h4 className="fw-bold mb-0 text-slate-800 d-flex align-items-center gap-2">
            <span>👥</span> Candidates Directory
          </h4>
          <p className="text-secondary small mb-0">{filteredData.length} records available</p>
        </div>
        <div className="col-auto d-flex gap-2 align-items-center flex-wrap">
          {hasSelection && (
            <>
              <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} className="shadow-sm border-0 bg-danger-subtle text-danger fw-semibold">
                Delete Selected ({selectedRows.length})
              </Button>
              <Button icon={<FileExcelOutlined />} onClick={() => exportToExcel(selectedRows)} className="shadow-sm border-success text-success fw-semibold bg-success-subtle">
                Export Data
              </Button>
            </>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditData(null); setOpen(true); }} 
                  className="shadow border-0 px-4" style={{ background: "#1e293b", fontWeight: 700 }}>
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="row g-3 bg-white p-3 rounded-3 shadow-sm border mx-0 align-items-center">
        <div className="col-md-4">
          <Input 
            prefix={<SearchOutlined className="text-muted" />} 
            placeholder="Search by name..." 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            allowClear 
            className="rounded-3 border-light-subtle"
            size="large"
          />
        </div>
        <div className="col-md-4">
          <Select 
            placeholder="Filter by Role" 
            value={roleFilter} 
            onChange={setRoleFilter} 
            allowClear 
            className="w-100 rounded-3"
            size="large"
            options={["Frontend Developer","Backend Developer","UI/UX Designer","AI/ML Developer","Data Scientist","DevOps Engineer","QA Engineer"].map(v => ({ value: v, label: v }))} 
          />
        </div>
        <div className="col-md-4">
          <Select 
            placeholder="Filter by Status" 
            value={statusFilter} 
            onChange={setStatusFilter} 
            allowClear 
            className="w-100 rounded-3"
            size="large"
            options={Object.keys(STATUS_COLOR).map(v => ({ value: v, label: v }))} 
          />
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-grow-1 bg-white rounded-4 shadow-sm border overflow-hidden d-flex position-relative shadow-sm">
        <div className="ag-theme-alpine flex-grow-1" style={{ width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredData}
            columnDefs={columnDefs}
            
            // v35 Modern State Management
            initialState={initialState}
            onStateUpdated={onStateUpdated}

            rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[5, 10, 20, 30]}
            
            onSelectionChanged={onSelectionChanged}
            
            defaultColDef={{ resizable: true, sortable: true, flex: 1, minWidth: 100 }}
          />
        </div>
        
        {/* Right Sidebar Column Toggle */}
        <div className="border-start bg-light-subtle d-flex flex-column align-items-center py-4 shadow-sm" style={{ width: 48 }}>
          <Dropdown 
            trigger={["click"]}
            overlayStyle={{ minWidth: 200 }}
            menu={{ 
              items: columnDefs.filter(c => c.field).map(c => ({
                key: c.field,
                label: (
                  <Checkbox 
                    checked={visibleColIds.includes(c.field)} 
                    onChange={e => toggleColumnVisibility(c.field, e.target.checked)}
                    className="w-100 py-1"
                  >
                    {c.headerName}
                  </Checkbox>
                )
              })),
              styles: { root: { padding: '12px', borderRadius: '12px' } }
            }} 
          >
            <div 
              className="text-uppercase fw-bolder text-secondary d-flex flex-column align-items-center gap-3" 
              style={{ fontSize: 10, cursor: 'pointer', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: 1.5 }}
            >
              <SettingOutlined style={{ transform: 'rotate(90deg)', fontSize: 16 }} />
              COLUMNS
            </div>
          </Dropdown>
        </div>
      </div>

      <CandidateFormModal 
        open={open} 
        setOpen={setOpen} 
        editData={editData} 
        refresh={loadData} 
        clearEdit={() => setEditData(null)} 
      />
    </div>
  );
};

export default Candidates;