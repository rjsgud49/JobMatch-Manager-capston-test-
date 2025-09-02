import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Matching from './pages/Matching'
import Jobs from './pages/Jobs'
import Pay from './pages/Pay'
import Contracts from './pages/Contracts'
import Work from './pages/Work'
import Disputes from './pages/Disputes'
import Reports from './pages/Reports'
import Admin from './pages/Admin'
import UserLanding from './pages/UserLanding'
import CandidatePortal from './pages/CandidatePortal'
import EmployerPortal from './pages/EmployerPortal'
import MyProfile from './pages/MyProfile'
import MyApplications from './pages/MyApplications'

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">JM</div>
          <div>
            <h1 style={{ margin: 0 }}>JobMatch Manager</h1> 
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>대시보드</NavLink>
          <NavLink to="/matching">매칭</NavLink>
          <NavLink to="/jobs">채용정보</NavLink>
          <NavLink to="/pay">페이시스템</NavLink>
          <NavLink to="/contracts">계약</NavLink>
          <NavLink to="/work">작업</NavLink>
          <NavLink to="/disputes">분쟁</NavLink>
          <NavLink to="/reports">보고서</NavLink>
          <NavLink to="/admin">관리</NavLink>
          <NavLink to="/user">사용자(구상중)</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/work" element={<Work />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/user" element={<UserLanding />} />
        <Route path="/user/candidate" element={<CandidatePortal />} />
        <Route path="/user/employer" element={<EmployerPortal />} />
        <Route path="/user/profile" element={<MyProfile />} />
        <Route path="/user/apps" element={<MyApplications />} />
      </Routes>
      <footer className="footer">© {new Date().getFullYear()} JobMatch Manager • Demo</footer>
    </div>
  )
}
