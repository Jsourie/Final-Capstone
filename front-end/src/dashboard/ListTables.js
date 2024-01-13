import React from "react";
import { useHistory } from "react-router-dom";
import { deleteSeat } from "../utils/api";

function ListTables({ tables, setTablesError, loadReservationsAndTables }) {
  const history = useHistory();

  const handleFinish = (table_id, reservation_id) => {
    const message = "Is this table ready to seat new guests? This cannot be undone.";
    if (window.confirm(message)) {
      deleteSeat(table_id, reservation_id)
        .then((data) => {
          console.log("Data after deleteSeat:", data);
          loadReservationsAndTables();
        })
        .catch((error) => {
          console.error("Error in handleFinish:", error);
          setTablesError("Error finishing table.");
        });
    }
  };
  

  return (
    <div id="tableGrid" className="tables-grid">
      {tables.map((table) => (
        <div className="tables-card" key={table.table_id}>
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">{table.table_name}</h6>
              <p className="card-subtitle mb-2 text-muted">Reservation {table.reservation_id}</p>
              <div
               
                id="statusWithFinishButton"
                role="alert"
                data-table-id-status={table.table_id}
              >
                {table.reservation_id ? "Occupied" : "Free"}
                {table.reservation_id && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleFinish(table.table_id)}
                    data-table-id-finish={table.table_id}
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListTables;