import React, { useEffect, useState } from "react";
import { fetchReservationsByDate } from "../utils/api";

function DashboardDate({ date }) {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        setReservationsError(null);

        fetchReservationsByDate(date, abortController.signal)
            .then(setReservations)
            .catch(error => setReservationsError(error.message));

        return () => abortController.abort();
    }, [date]);

    return (
        <div>
            {reservations.map((reservation) => (
                <div key={reservation.reservation_id}>
                    <p>{reservation.first_name} {reservation.last_name}</p>
                </div>
            ))}
            {reservationsError && <p>Error: {reservationsError}</p>}
        </div>
    );
}

export default DashboardDate;
