import { Link } from 'react-router-dom'

function Login() {
  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email')
    const password = formData.get('password')

    console.log('Email :', email)
    console.log('Mot de passe renseigné :', Boolean(password))

    alert('La connexion sera disponible après intégration du backend.')
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
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Votre mot de passe"
            required
          />

          <button type="submit">Se connecter</button>
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