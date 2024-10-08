import React, { useState } from "react";
import { useParams } from "react-router-dom";
import emailjs from "emailjs-com";

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    details: "More about Dr. Doe...",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialization: "Dermatologist",
    details: "More about Dr. Smith...",
  },
  // Add more doctors...
];

const DoctorDetails = () => {
  const { id } = useParams();
  const doctor = doctors.find((doc) => doc.id === parseInt(id));

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    reason: "",
    dateTime: "",
    email: "",
  });

  const [showSuccess, setShowSuccess] = useState(false); // State to handle success message
  const [loading, setLoading] = useState(false); // State to handle form loading

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when email is being sent
    sendEmail();
  };

  const sendEmail = () => {
    const templateParams = {
      doctor_name: doctor.name,
      doctor_specialization: doctor.specialization,
      user_name: formData.name,
      user_age: formData.age,
      user_reason: formData.reason,
      appointment_time: formData.dateTime,
      user_email: formData.email,
    };

    emailjs
      .send(
        "service_q791zda",
        "template_25sjokp",
        templateParams,
        "fW4dKdzpptuR1iBCP"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setLoading(false);
          setShowSuccess(true); // Show success message
        },
        (err) => {
          console.log("FAILED...", err);
          setLoading(false); // Stop loading on failure
        }
      );
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false); // Close the success message
  };

  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>{doctor.specialization}</p>
      <p>{doctor.details}</p>

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
          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Appointment Date & Time:</label>
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
        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>

      {showSuccess && (
        <div className="success-popup">
          <p>Your appointment is booked successfully!</p>
          <button onClick={handleCloseSuccess}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
