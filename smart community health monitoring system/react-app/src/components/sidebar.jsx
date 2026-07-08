import React from 'react'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">💙</div>
        <div className="brand-text">Smart Community</div>
      </div>
      <div className="profile">
        <img src="https://i.pravatar.cc/80?img=12" alt="avatar" />
        <div className="name">Vignesh<br/><span>Admin</span></div>
      </div>
      <nav className="nav">
        <a className="active"><span className="nav-icon">🏠</span><span>Dashboard</span></a>
        <a><span className="nav-icon">🧑‍⚕️</span><span>Patients</span></a>
        <a><span className="nav-icon">👨‍⚕️</span><span>Doctors</span></a>
        <a><span className="nav-icon">📅</span><span>Appointments</span></a>
        <a><span className="nav-icon">📋</span><span>Health Records</span></a>
        <a><span className="nav-icon">🤖</span><span>AI Prediction</span></a>
        <a><span className="nav-icon">💊</span><span>Medications</span></a>
        <a><span className="nav-icon">🚨</span><span>Emergency Alerts</span></a>
        <a><span className="nav-icon">📊</span><span>Reports</span></a>
        <a><span className="nav-icon">⚙️</span><span>Settings</span></a>
        <a className="logout"><span className="nav-icon">↩️</span><span>Logout</span></a>
      </nav>
    </aside>
  )
}
