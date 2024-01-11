import React from "react";
import { deleteSeat } from "../utils/api";


function ListTables({ tables, setTablesError, loadReservationsAndTables }) {

  const handleFinish = (table_id) => {
  const message = "Is this table ready to seat new guests? This cannot be undone.";
  if (window.confirm(message)) {
    deleteSeat(table_id)
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
    <div id="tableGrid">
      {tables.map((table) => (
        <div className="tables-card" key={table.table_id}>
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">{table.table_name}</h6>
              <p className="card-subtitle mb-2 text-muted">Reservation {table.reservation_id}</p>
              <div
                className={`alert`}
                id="statusWithFinishButton"
                role="alert"
                data-table-id-status={table.table_id}
              >
                {table.reservation_id ? "Occupied" : "Free"}
                {table.reservation_id && (
                  <button
                    type="button"
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

export default ListTables
