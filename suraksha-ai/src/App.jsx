import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import RiskMap from "./pages/RiskMap"
import Predictions from "./pages/Predictions"
import Alerts from "./pages/Alerts"
import Analytics from "./pages/Analytics"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <aside className="sidebar">

          <div className="logo">
            <span>🛡️</span>
            <span>SURAKSHA-AI</span>
          </div>

          <nav className="sidebar-nav">

            <NavLink to="/" end>
              📊 Dashboard
            </NavLink>

            <NavLink to="/risk-map">
              🗺️ Risk Map
            </NavLink>

            <NavLink to="/predictions">
              🤖 Predictions
            </NavLink>

            <NavLink to="/alerts">
              🚨 Alerts
            </NavLink>

            <NavLink to="/analytics">
              📈 Analytics
            </NavLink>

          </nav>

          <div className="sidebar-bottom">
            <div>ℹ️ About System</div>
            <small>NER Landslide Monitoring</small>
          </div>

        </aside>


        <main className="main-content">

          <header className="navbar">

            <div>
              <h2>SURAKSHA-AI</h2>
              <p>AI-Based Landslide Risk Monitoring System</p>
            </div>

            <div className="system-status">
              <span className="status-dot"></span>
              System Online
            </div>

          </header>


          <section className="page-content">

            <Routes>

              <Route path="/" element={<Dashboard />} />

              <Route path="/risk-map" element={<RiskMap />} />

              <Route path="/predictions" element={<Predictions />} />

              <Route path="/alerts" element={<Alerts />} />

              <Route path="/analytics" element={<Analytics />} />

            </Routes>

          </section>

        </main>

      </div>
    </BrowserRouter>
  )
}

export default App