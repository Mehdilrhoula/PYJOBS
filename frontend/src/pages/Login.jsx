import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    try {
      const sessionResponse = await fetch('/api/session/', {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!sessionResponse.ok) {
        throw new Error('Impossible de préparer la connexion.')
      }

      const session = await sessionResponse.json()

      const response = await fetch('/api/login/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRFToken': session.csrfToken,
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'La connexion a échoué.')
      }

      setPassword('')
      navigate('/', { replace: true })
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'Impossible de contacter Django. Vérifiez que le serveur est lancé.'
          : error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-page-container">
        <h1>Connexion à PYJOBS</h1>

        <p>Connectez-vous pour accéder à votre espace.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">
            Adresse e-mail ou identifiant
          </label>

          <input
            type="text"
            id="email"
            name="email"
            placeholder="Votre e-mail ou identifiant"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            disabled={loading}
            required
          />

          <label htmlFor="password">Mot de passe</label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>

          {error && (
            <p className="login-message" role="alert">
              {error}
            </p>
          )}
        </form>

        <p>
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
        </p>

        <Link to="/">Retour à l'accueil</Link>
      </div>
    </main>
  )
}

export default Login