import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createTable } from "../utils/api";


function NewTable() {
    const history = useHistory();
  
    const initialFormState = {
      table_name: "",
      capacity: "",
    };
  
    const [formData, setFormData] = useState({ ...initialFormState });
    const [errorMessage, setErrorMessage] = useState(null);
  
    const { table_name, capacity } = formData;
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
  
      createTable(formData)
        .then(() => {
          setFormData({ ...initialFormState });
            history.push("/dashboard");
        })
        .catch((error) => {
          console.error("Error creating reservation:", error);
        });
    };

    const handleCancel = () => {
        history.goBack();
      };

return (
    <div className="container">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleInputChange}
            value={table_name}
            minLength={2}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
           <input
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleInputChange}
            value={capacity}
            className="form-control"
            min="1"
            required
          />
            </div>
        <div className="text-center">
          <button onClick={handleCancel} className="btn btn-danger mr-2">Cancel</button>
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>
            )
    }

    export default NewTable