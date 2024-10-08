import React from 'react';
import Header from "../components/header";
import Footer from "../components/footer";
import DoctorList from "../components/DoctorList";
import '../assets/Help.css'; 

export default function Help() {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <DoctorList />
      </main>
      <Footer />
    </div>
  );
}
