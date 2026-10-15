
import { useEffect, useState } from 'react'

function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
          if (profileResponse.status === 401 || profileResponse.status === 403) {
            throw new Error('Connecte-toi pour accéder à ton profil.')
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
        const details = Object.values(data)
          .flat()
          .join(' ')

        throw new Error(details || 'Impossible de modifier le profil.')
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

  if (loading) {
    return <main><p>Chargement du profil...</p></main>
  }

  return (
    <main>
      <h1>Mon profil</h1>

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

        <button type="submit" disabled={saving || Boolean(error && !csrfToken)}>
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </main>
  )
}

export default Profile
