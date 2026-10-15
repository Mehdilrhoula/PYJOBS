import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'candidate',
}

function Register() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) return

    setError('')
    setMessage('')

    if (!form.name.trim()) {
      setError('Veuillez renseigner votre nom.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    try {
      const csrfCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('csrftoken='))

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }

      if (csrfCookie) {
        headers['X-CSRFToken'] = decodeURIComponent(
          csrfCookie.slice('csrftoken='.length)
        )
      }

      const response = await fetch('/api/register/', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const details = Object.entries(data)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(' ')
              : String(messages)

            return field === 'detail' || field === 'non_field_errors'
              ? text
              : `${field} : ${text}`
          })
          .join(' ')

        throw new Error(details || "L'inscription a échoué.")
      }

      setMessage('Compte créé ! Vous pouvez maintenant vous connecter.')
      setForm(initialForm)
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
    <main className="auth-page register-page">
      <div className="auth-container">
        <h1>Inscription</h1>
        <p>Créez votre compte PYJOBS.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="register-role">Type de compte</label>
          <select
            id="register-role"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="candidate">Candidat</option>
            <option value="employer">Employeur</option>
          </select>

          <label htmlFor="register-name">Nom complet</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            disabled={loading}
            required
          />

          <label htmlFor="register-email">Adresse e-mail</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <label htmlFor="register-password">Mot de passe</label>
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            disabled={loading}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          </button>

          <label htmlFor="register-confirm-password">
            Confirmer le mot de passe
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength={8}
            disabled={loading}
            required
          />

          {error && (
            <p role="alert" className="auth-error">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="auth-success">
              {message}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Création en cours…' : 'Créer mon compte'}
          </button>
        </form>

        <p>
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>

        <Link to="/">Retour à l'accueil</Link>
      </div>
    </main>
  )
}

export default Register