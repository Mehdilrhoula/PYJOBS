import { useState } from 'react'

function ApplicationForm({
  job,
  applicationMessage,
  setApplicationMessage,
  applicationStatus,
  setApplicationStatus,
  onCancel,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading || submitted) return

    setError('')
    setApplicationStatus('')

    if (!applicationMessage.trim()) {
      setError('Veuillez écrire un message au recruteur.')
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

      const response = await fetch('/api/applications/create/', {
        method: 'POST',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
          ad_id: job.id,
          message: applicationMessage.trim(),
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

        throw new Error(details || "L'envoi de la candidature a échoué.")
      }

      setSubmitted(true)
      setApplicationStatus('Votre candidature a bien été enregistrée !')
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
    <form
      id={`application-form-${job.id}`}
      className="application-form"
      onSubmit={handleSubmit}
    >
      <h4>Postuler à cette offre</h4>

      <p>
        La candidature sera associée à votre compte candidat connecté.
      </p>

      <label htmlFor={`application-message-${job.id}`}>
        Message au recruteur
      </label>

      <textarea
        id={`application-message-${job.id}`}
        name="message"
        placeholder="Présentez-vous et expliquez votre motivation…"
        rows={6}
        maxLength={4000}
        value={applicationMessage}
        onChange={(event) => {
          setApplicationMessage(event.target.value)
          setError('')
        }}
        disabled={loading || submitted}
        required
      />

      <p className="message-limit">
        {4000 - applicationMessage.length} caractères restants sur 4 000
      </p>

      {error && (
        <p className="application-status" role="alert">
          {error}
        </p>
      )}

      {applicationStatus && (
        <p className="application-status" role="status">
          {applicationStatus}
        </p>
      )}

      <button
        type="button"
        className="cancel-application"
        onClick={onCancel}
        disabled={loading}
      >
        {submitted ? 'Fermer' : 'Fermer sans envoyer'}
      </button>

      <button
        type="submit"
        disabled={loading || submitted}
      >
        {loading
          ? 'Envoi en cours…'
          : submitted
            ? 'Candidature envoyée'
            : 'Envoyer ma candidature'}
      </button>
    </form>
  )
}

export default ApplicationForm