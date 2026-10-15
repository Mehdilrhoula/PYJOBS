
import { useEffect, useState } from 'react'

function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProfile() {
      try {
        const sessionResponse = await fetch('/api/session/', {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!sessionResponse.ok) {
          throw new Error('Impossible de vérifier la session.')
        }

        const session = await sessionResponse.json()
        setCsrfToken(session.csrfToken)

        const profileResponse = await fetch('/api/profile/', {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!profileResponse.ok) {
          if (
            profileResponse.status === 401 ||
            profileResponse.status === 403
          ) {
            throw new Error(
              'Connecte-toi pour accéder à ton profil.'
            )
          }

          throw new Error('Impossible de charger ton profil.')
        }

        const profile = await profileResponse.json()

        setName(profile.name)
        setEmail(profile.email)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => controller.abort()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setError('')
    setSaving(true)

    try {
      const response = await fetch('/api/profile/', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const details = Object.values(data).flat().join(' ')
        throw new Error(
          details || 'Impossible de modifier le profil.'
        )
      }

      setName(data.name)
      setEmail(data.email)
      setMessage('Profil mis à jour avec succès.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault()

    setPasswordMessage('')
    setPasswordError('')

    if (newPassword !== confirmPassword) {
      setPasswordError(
        'Les nouveaux mots de passe ne correspondent pas.'
      )
      return
    }

    setChangingPassword(true)

    try {
      const response = await fetch('/api/change-password/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const details = Object.values(data).flat().join(' ')
        throw new Error(
          details || 'Impossible de changer le mot de passe.'
        )
      }

      setPasswordMessage(data.message)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <main>
        <p>Chargement du profil...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Mon profil</h1>

      <section>
        <h2>Mes informations personnelles</h2>

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="profile-name">Nom</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email">Adresse e-mail</label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving || !csrfToken}
          >
            {saving
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Changer mon mot de passe</h2>

        {passwordMessage && (
          <p role="status">{passwordMessage}</p>
        )}

        {passwordError && (
          <p role="alert">{passwordError}</p>
        )}

        <form onSubmit={handlePasswordChange}>
          <div>
            <label htmlFor="old-password">
              Mot de passe actuel
            </label>
            <input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(event) =>
                setOldPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label htmlFor="new-password">
              Nouveau mot de passe
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword || !csrfToken}
          >
            {changingPassword
              ? 'Modification...'
              : 'Changer mon mot de passe'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Profile
