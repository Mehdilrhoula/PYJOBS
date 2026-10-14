
import { useState } from 'react'

const initialForm = {
  role: 'candidate',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  sector: '',
  city: '',
}

function Register() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))

    setMessage('')
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (form.role === 'company' && !form.companyName.trim()) {
      setError("Veuillez renseigner le nom de l'entreprise.")
      return
    }

    setError('')
    setMessage(
      "Formulaire validé ! L'inscription sera activée après la connexion au backend Django."
    )

    setForm(initialForm)
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
          >
            <option value="candidate">Candidat</option>
            <option value="company">Entreprise</option>
          </select>

          {form.role === 'candidate' && (
            <>
              <label htmlFor="register-first-name">Prénom</label>
              <input
                id="register-first-name"
                type="text"
                name="firstName"
                placeholder="Votre prénom"
                value={form.firstName}
                onChange={handleChange}
                required
              />

              <label htmlFor="register-last-name">Nom</label>
              <input
                id="register-last-name"
                type="text"
                name="lastName"
                placeholder="Votre nom"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}

          {form.role === 'company' && (
            <>
              <label htmlFor="register-company">Nom de l'entreprise</label>
              <input
                id="register-company"
                type="text"
                name="companyName"
                placeholder="Nom de l'entreprise"
                value={form.companyName}
                onChange={handleChange}
                required
              />

              <label htmlFor="register-sector">Secteur d'activité</label>
              <input
                id="register-sector"
                type="text"
                name="sector"
                placeholder="Ex. Informatique"
                value={form.sector}
                onChange={handleChange}
                required
              />

              <label htmlFor="register-city">Ville</label>
              <input
                id="register-city"
                type="text"
                name="city"
                placeholder="Ex. Marseille"
                value={form.city}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label htmlFor="register-email">Adresse e-mail</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="exemple@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-password">Mot de passe</label>
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Au moins 8 caractères"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            autoComplete="new-password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          </button>

          <label htmlFor="register-confirm-password">
            Confirmer le mot de passe
          </label>
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword
              ? 'Masquer la confirmation'
              : 'Afficher la confirmation'}
          </button>

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

          <button type="submit">Créer mon compte</button>
        </form>

        <p>
          Déjà inscrit ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </main>
  )
}

export default Register
