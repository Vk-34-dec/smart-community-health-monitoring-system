import React from 'react'

export default function Hero(){
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>Smart Community<br/><span>Health Monitoring System</span></h1>
        <p>Real-time health monitoring, early disease prediction and better community healthcare.</p>
        <div className="hero-actions">
          <button className="btn primary">Get Started</button>
          <button className="btn ghost">Learn More</button>
        </div>
      </div>
      <div className="hero-right">
        <div className="illustration">
          <img src="https://images.unsplash.com/photo-1587502536263-3c6b8b2d7df6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="illustration" />
        </div>
      </div>
    </section>
  )
}
