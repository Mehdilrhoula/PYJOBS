
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadSession() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/session/', {
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Impossible de vérifier la connexion.')
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setUser(data.authenticated ? data.user : null)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
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

    try {
      const sessionResponse = await fetch('/api/session/', {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
        },
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
    } catch (error) {
      setError(error.message || 'La déconnexion a échoué.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header>
      <div className="header-content">
        <h1>
          <Link to="/" className="header-logo">
            PYJOBS
          </Link>
        </h1>

        <nav
          aria-label="Navigation principale"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/" className="login-button">
            Les offres
          </Link>

          {loading ? (
            <span role="status">Vérification du compte…</span>
          ) : user ? (
            <>
              <span>Bonjour {user.name}</span>

              {user.role === 'candidate' && (
                <Link
                  to="/candidate/dashboard"
                  className="login-button"
                >
                  Mes candidatures
                </Link>
              )}

              {user.role === 'employer' && (
                <Link
                  to="/company/dashboard"
                  className="login-button"
                >
                  Espace employeur
                </Link>
              )}

              <Link
                to="/profile"
                className="login-button"
              >
                Mon profil
              </Link>

              <button
                type="button"
                className="login-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Déconnexion…' : 'Déconnexion'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">
                Connexion
              </Link>

              <Link to="/register" className="login-button">
                Inscription
              </Link>
            </>
          )}
        </nav>

        {error && <p role="alert">{error}</p>}
      </div>
    </header>
  )
}

export default Header
