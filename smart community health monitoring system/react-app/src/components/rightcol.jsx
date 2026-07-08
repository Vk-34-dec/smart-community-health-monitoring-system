import React from 'react'

export default function RightCol(){
  return (
    <aside className="rightcol">
      <div className="stats">
        <div className="stat">Total Patients<br/><strong>1,245</strong></div>
        <div className="stat">Active Cases<br/><strong>236</strong></div>
        <div className="stat">Doctors<br/><strong>58</strong></div>
        <div className="stat">Health Workers<br/><strong>112</strong></div>
      </div>

      <div className="realtime">
        <h4>Real-time Health Monitoring</h4>
        <div className="realtime-grid">
          <div className="meter">Heart Rate<br/><strong>72 bpm</strong></div>
          <div className="meter">SPO₂<br/><strong>98%</strong></div>
          <div className="meter">Blood Pressure<br/><strong>120/80</strong></div>
          <div className="meter">Temperature<br/><strong>36.6°C</strong></div>
        </div>
      </div>

      <div className="appointments">
        <h4>Upcoming Appointments</h4>
        <ul>
          <li>Ravi Kumar — 10:00 AM <span className="confirmed">Confirmed</span></li>
          <li>Meena Devi — 11:30 AM <span className="pending">Pending</span></li>
          <li>Arun Kumar — 01:00 PM <span className="confirmed">Confirmed</span></li>
          <li>Lakshmi Priya — 02:30 PM <span className="pending">Pending</span></li>
        </ul>
      </div>

      <div className="mobile-mockup">
        <img src="https://images.unsplash.com/photo-1581276879432-15a71a3d2f7c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="mobile mockup" />
      </div>
    </aside>
  )
}
