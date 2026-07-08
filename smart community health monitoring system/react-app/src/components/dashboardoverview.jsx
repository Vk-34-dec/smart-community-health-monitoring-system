import React from 'react'

export default function DashboardOverview(){
  return (
    <section className="dashboard-overview">
      <div className="cards-grid">
        <div className="card big">
          <div className="card-title">Total Patients</div>
          <div className="card-value">1,245</div>
        </div>
        <div className="card">
          <div className="card-title">Appointments</div>
          <div className="card-value green">85</div>
        </div>
        <div className="card">
          <div className="card-title">Today Checkups</div>
          <div className="card-value purple">42</div>
        </div>
        <div className="card danger">
          <div className="card-title">Emergency</div>
          <div className="card-value">12</div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="panel health-analytics">
          <h3>Health Analytics</h3>
          <div className="chart-placeholder">[Line chart]</div>
        </div>
        <div className="panel disease-prediction">
          <h3>Disease Prediction (AI)</h3>
          <div className="pie-placeholder">[Pie chart]</div>
        </div>
        <div className="panel recent-alerts">
          <h3>Recent Alerts</h3>
          <ul>
            <li>High BP Alert — Ram Kumar <span>2 min ago</span></li>
            <li>High Fever Alert — Siva <span>5 min ago</span></li>
            <li>Low Oxygen Alert — Meena <span>10 min ago</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
