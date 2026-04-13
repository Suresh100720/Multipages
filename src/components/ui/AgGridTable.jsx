import { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { ColumnsToolPanelModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllCommunityModule, ColumnsToolPanelModule]);

// Removed StatusCellRenderer to display status as plain normal text as requested.

const AgGridTable = ({
  rowData,
  columnDefs,
  onGridReady,
  onSelectionChanged,
  onColumnChanged,
  paginationPageSize = 10,
  gridId = "defaultGrid",
  ...props
}) => {
  const gridRef = useRef();

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    minWidth: 100,
    ...props.defaultColDef,
  }), [props.defaultColDef]);

  const internalOnGridReady = useCallback((params) => {
    gridRef.current = params;
    // Set autoHeight by default
    params.api.setGridOption("domLayout", "autoHeight");
    
    // Restoration of state logic moved to parent or handled here?
    // Let's keep it flexible
    if (onGridReady) onGridReady(params);
  }, [onGridReady]);

  const themeClass = props.theme || "ag-theme-alpine";

  return (
    <div id={gridId} className={themeClass} style={{ width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={internalOnGridReady}
        onColumnVisible={onColumnChanged}
        onColumnResized={onColumnChanged}
        onColumnMoved={onColumnChanged}
        domLayout="autoHeight"
        rowSelection={{
          mode: "multiRow",
          headerCheckbox: true,
          checkboxes: true,
          enableClickSelection: false,
        }}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[5, 10, 20, 50]}
        onSelectionChanged={onSelectionChanged}
        defaultColDef={defaultColDef}
        rowHeight={52}
        headerHeight={48}
        {...props}
      />
    </div>
  );
};

export default AgGridTable;
