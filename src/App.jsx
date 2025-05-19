import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <nav>
        <ul>
          {/* <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/forms">forms</Link></li>
          <li><Link to="/LandingPage">LandingPage</Link></li> */}


        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App