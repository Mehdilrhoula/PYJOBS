
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
    const [role, setRole] = useState('candidate')
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const name = String(formData.get('name') ?? '').trim()
        const password = formData.get('password')
        const confirmPassword = formData.get('confirmPassword')

        if (name === '') {
            setMessage('Veuillez renseigner votre nom.')
            return
        }

        if (password !== confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas.')
            return
        }

        setMessage(
            "Les informations sont valides. L'inscription sera disponible après la connexion au backend."
        )
    }

    return (
        <main className="login-page">
            <div className="login-page-container">
                <h1>Créer un compte PYJOBS</h1>

                <p>Rejoignez PYJOBS en tant que candidat ou entreprise.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="role">Type de compte</label>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                    >
                        <option value="candidate">Candidat</option>
                        <option value="company">Entreprise</option>
                    </select>

                    <label htmlFor="name">
                        {role === 'company' ? 'Raison sociale' : 'Nom complet'}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                    />

                    {role === 'company' && (
                        <>
                            <label htmlFor="phone">Téléphone professionnel</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                            />

                            <label htmlFor="website">Site internet</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                placeholder="https://exemple.fr"
                            />
                        </>
                    )}

                    <label htmlFor="email">Adresse e-mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                    />

                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        minLength={8}
                    />

                    <label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength={8}
                    />

                    <label className="password-visibility">
                        Afficher les mots de passe
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(event) =>
                                setShowPassword(event.target.checked)
                            }
                        />
                    </label>

                    <button type="submit">Créer mon compte</button>

                    {message && (
                        <p className="application-status" role="status">
                            {message}
                        </p>
                    )}
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
