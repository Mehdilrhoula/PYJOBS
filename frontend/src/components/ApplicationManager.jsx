
import { useState } from 'react'

const statusLabels = {
  pending: 'En attente',
  accepted: 'Retenue',
  rejected: 'Refusée',
}

function ApplicationManager({ application, onUpdated }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function changeStatus(newStatus) {
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
        throw new Error('Votre session a expiré. Reconnectez-vous.')
      }

      const response = await fetch(
        `/api/applications/${application.application_id}/status/`,
        {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': session.csrfToken,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const details =
          typeof data === 'object' && data !== null
            ? Object.values(data).flat().join(' ')
            : ''

        throw new Error(
          details || 'Impossible de modifier le statut.'
        )
      }

      onUpdated(data)
      setMessage('Statut de la candidature mis à jour.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="job-card">
      <h3>{application.ad}</h3>

      <p>
        <strong>Candidat :</strong> {application.person}
      </p>

      <p>
        <strong>Date :</strong>{' '}
        {new Date(application.application_date).toLocaleDateString(
          'fr-FR'
        )}
      </p>

      <p>
        <strong>Message :</strong>{' '}
        {application.message || 'Aucun message'}
      </p>

      <p className="application-status-row">
        <strong>Statut :</strong>{' '}
        <span className={`application-status-badge application-status-badge-${application.status}`}>
          {statusLabels[application.status] || 'Inconnu'}
        </span>
      </p>

      <div className="application-decision-actions">
        <button
          className="application-btn-accept"
          type="button"
          onClick={() => changeStatus('accepted')}
          disabled={saving || application.status === 'accepted'}
        >
          {saving ? 'Enregistrement…' : 'Retenir'}
        </button>

        <button
          className="application-btn-reject"
          type="button"
          onClick={() => changeStatus('rejected')}
          disabled={saving || application.status === 'rejected'}
        >
          Refuser
        </button>

        <button
          className="application-btn-pending"
          type="button"
          onClick={() => changeStatus('pending')}
          disabled={saving || application.status === 'pending'}
        >
          Remettre en attente
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
    </article>
  )
}

export default ApplicationManager