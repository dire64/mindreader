import React, { useState } from "react";
import "../assets/Modal.css";

const Modal = ({ show, onClose, doctor, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    reason: "",
    dateTime: "",
    email: "",
  });

  if (!show) {
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call the parent function to handle the form submission
    onClose(); // Close the modal after submitting
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{doctor.name}</h2>
          <p>Specialization: {doctor.specialization}</p>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Reason for Appointment:</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Appointment Date and Time:</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Book Appointment</button>
          </form>
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
