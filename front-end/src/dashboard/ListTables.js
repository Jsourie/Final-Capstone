// ListTables.js
import React from "react";
import ErrorAlert from "../layout/ErrorAlert";

function ListTables({ onFinish, tables = [] }) {
  function handleFinishClick(tableId, reservationId) {
    if (
      tableId &&
      reservationId &&
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      onFinish(tableId, reservationId);
    }
  }

  const rows = tables.length ? (
    tables.map((table) => {
      return (
        <div className="form-group row" key={table.table_id}>
          <div className="col-sm-2">{table.table_name}</div>
          <div className="col-sm-2">{table.capacity}</div>
          <div className="col-sm-1" data-table-id-status={table.table_id}>
            {table.reservation_id ? "Occupied" : "Free"}
          </div>
          <div className="col-sm-1">
            {table.reservation_id && (
              <button
                type="button"
                className="btn btn-primary"
                data-table-id-finish={table.table_id}
                data-reservation-id-finish={table.reservation_id}
                onClick={() => handleFinishClick(table.table_id, table.reservation_id)}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <div>No results</div>
  );
  return <div className="table">{rows}</div>;
}

export default ListTables;