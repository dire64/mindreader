import React, { useState } from "react";
import Modal from "./Modal";

const doctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiologist" },
  { id: 2, name: "Dr. Jane Smith", specialization: "Dermatologist" },
];

const DoctorList = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleSubmitAppointment = (formData) => {
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="doctor-card"
          onClick={() => handleDoctorClick(doctor)}
        >
          <h3>{doctor.name}</h3>
          <p>{doctor.specialization}</p>
        </div>
      ))}

      {showModal && selectedDoctor && (
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          doctor={selectedDoctor}
          onSubmit={handleSubmitAppointment}
        />
      )}
    </div>
  );
};

export default DoctorList;
