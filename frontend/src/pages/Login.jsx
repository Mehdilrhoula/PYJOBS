import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    setMessage(
      'La connexion sera disponible après intégration du backend Django.'
    )
  }

  return (
    <main className="login-page">
      <div className="login-page-container">
        <h1>Connexion à PYJOBS</h1>

        <p>Connectez-vous pour accéder à votre espace.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Votre adresse e-mail"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />

          <button type="submit">Se connecter</button>

          {message && (
            <p className="login-message" role="status">
              {message}
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