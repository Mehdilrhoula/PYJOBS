
import { Link, useLocation } from 'react-router-dom'
import PublishJobButton from './PublishJobButton'

function Header({ userRole, setShowJobForm }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <header>
      <div className="header-content">
        <h1>
          <Link to="/" className="header-logo">
            PYJOBS
          </Link>
        </h1>

        {isHomePage && (
          <>
            <PublishJobButton
              userRole={userRole}
              onPublish={() => setShowJobForm(true)}
            />

            <Link to="/login" className="login-button">
              Connexion
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
