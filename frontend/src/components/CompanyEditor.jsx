
import { useState } from 'react'

function CompanyEditor({ company, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(company.name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function saveCompany(event) {
    event.preventDefault()

    if (saving) return

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const sessionResponse = await fetch('/api/session/', {
        credentials: 'same-origin',
      })

      if (!sessionResponse.ok) {
        throw new Error('Impossible de vérifier la session.')
      }

      const session = await sessionResponse.json()

      if (!session.authenticated) {
        throw new Error('Votre session a expiré.')
      }

      const response = await fetch(
        `/api/companies/${company.company_id}/`,
        {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': session.csrfToken,
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const details = Object.values(data).flat().join(' ')
        throw new Error(
          details || "Impossible de modifier l'entreprise."
        )
      }

      onUpdated(data)
      setName(data.name)
      setEditing(false)
      setMessage('Entreprise modifiée avec succès.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function cancelEditing() {
    setName(company.name)
    setEditing(false)
    setError('')
  }

  return (
    <article className="job-card company-premium-card">
      <h3>{company.name}</h3>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {!editing ? (
        <button
          type="button"
          className="company-premium-edit-button"
          onClick={() => {
            setEditing(true)
            setMessage('')
          }}
        >
          Modifier
        </button>
      ) : (
        <form className="company-premium-edit-form" onSubmit={saveCompany}>
          <label htmlFor={`company-edit-${company.company_id}`}>
            Nouveau nom de l'entreprise
          </label>

          <input
            id={`company-edit-${company.company_id}`}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            disabled={saving}
            required
          />

          <div className="company-premium-actions">
            <button
              type="button"
              className="company-premium-cancel"
              onClick={cancelEditing}
              disabled={saving}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="company-premium-save"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </article>
  )
}

export default CompanyEditor
