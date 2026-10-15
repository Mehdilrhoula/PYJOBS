import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    setAccountOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadSession() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/session/', {
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Impossible de vérifier la connexion.')
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setUser(data.authenticated ? data.user : null)
        }
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setUser(null)
          setError('Impossible de vérifier la connexion.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadSession()
    return () => controller.abort()
  }, [location.pathname])

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    setError('')
    setAccountOpen(false)
    setMobileOpen(false)

    try {
      const sessionResponse = await fetch('/api/session/', {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })

      if (!sessionResponse.ok) {
        throw new Error('Impossible de vérifier la session.')
      }

      const session = await sessionResponse.json()

      if (session.authenticated) {
        const response = await fetch('/api/logout/', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'X-CSRFToken': session.csrfToken,
          },
        })

        if (!response.ok) {
          throw new Error('La déconnexion a échoué. Réessayez.')
        }
      }

      setUser(null)
      navigate('/')
    } catch (err) {
      setError(err.message || 'La déconnexion a échoué.')
    } finally {
      setLoggingOut(false)
    }
  }

  const spaceLink =
    user?.role === 'candidate'
      ? '/candidate/dashboard'
      : user?.role === 'employer'
        ? '/company/dashboard'
        : user?.role === 'admin'
          ? '/admin'
          : null

  const spaceLabel =
    user?.role === 'candidate'
      ? 'Mes candidatures'
      : user?.role === 'employer'
        ? 'Espace employeur'
        : user?.role === 'admin'
          ? 'Administration'
          : ''

  const navClass = ({ isActive }) =>
    `premium-nav-link${isActive ? ' premium-nav-active' : ''}`

  return (
    <header className="pyjobs-premium-header">
      <div className="premium-header-content">
        <Link to="/" className="premium-logo" aria-label="PYJOBS - Accueil">
          <span className="premium-logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M3 12h18" />
            </svg>
          </span>
          <span>PYJOBS</span>
        </Link>

        <nav
          className={`premium-nav${mobileOpen ? ' premium-nav-open' : ''}`}
          aria-label="Navigation principale"
          id="premium-main-nav"
        >
          <NavLink to="/" end className={navClass}>Accueil</NavLink>
          <NavLink to="/jobs" className={navClass}>Offres d'emploi</NavLink>
          {!loading && spaceLink && (
            <NavLink to={spaceLink} className={navClass}>
              {spaceLabel}
            </NavLink>
          )}

          <div className="premium-mobile-account">
            {!loading && user && (
              <>
                <NavLink to="/profile" className={navClass}>
                  Mon profil
                </NavLink>
                <button
                  type="button"
                  className="premium-mobile-logout"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Déconnexion…' : 'Déconnexion'}
                </button>
              </>
            )}
            {!loading && !user && (
              <Link to="/login" className="premium-mobile-login">
                Connexion / Inscription
              </Link>
            )}
          </div>
        </nav>

        <div className="premium-header-actions">
          {loading ? (
            <span className="premium-session-loading" role="status">
              Chargement…
            </span>
          ) : user ? (
            <div className="premium-account" ref={accountRef}>
              <button
                type="button"
                className="premium-account-trigger"
                onClick={() => setAccountOpen(previous => !previous)}
                aria-expanded={accountOpen}
                aria-haspopup="true"
                aria-controls="premium-account-menu"
              >
                <span className="premium-account-avatar" aria-hidden="true">
                  {user.name?.trim()?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="premium-account-name">
                  {user.name || 'Mon compte'}
                </span>
                <svg className="premium-chevron" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {accountOpen && (
                <div
                  className="premium-account-menu"
                  id="premium-account-menu"
                >
                  <span className="premium-menu-caption">Mon compte</span>
                  <Link to="/profile" className="premium-menu-item">
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    className="premium-menu-item premium-menu-logout"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? 'Déconnexion…' : 'Déconnexion'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="premium-login-link">
              Connexion / Inscription
            </Link>
          )}

          <button
            type="button"
            className="premium-mobile-toggle"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="premium-main-nav"
            onClick={() => setMobileOpen(previous => !previous)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {error && (
        <p className="premium-header-error" role="alert">{error}</p>
      )}
    </header>
  )
}

export default Header
