import React from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import DashboardOverview from './components/DashboardOverview'
import RightCol from './components/RightCol'
import './app.css'

export default function App(){
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main">
        <Topbar />
        <Hero />
        <DashboardOverview />
      </main>
      <RightCol />
    </div>
  )
}
