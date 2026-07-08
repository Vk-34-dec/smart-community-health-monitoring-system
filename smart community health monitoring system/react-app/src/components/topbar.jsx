import React from 'react'

export default function Topbar(){
  return (
    <header className="topbar">
      <ul className="toplinks">
        <li>Home</li>
        <li>About Us</li>
        <li>Services</li>
        <li>Dashboard</li>
        <li>Contact Us</li>
      </ul>
      <button className="btn btn-primary">Login</button>
    </header>
  )
}
