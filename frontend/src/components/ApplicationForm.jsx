
function ApplicationForm({
  job,
  applicationMessage,
  setApplicationMessage,
  applicationStatus,
  setApplicationStatus,
  onCancel,
}) {
  function handleSubmit(event) {
    event.preventDefault()

    setApplicationStatus(
      "Votre formulaire est complet. L'envoi sera disponible prochainement."
    )
  }

  return (
    <form
      id={`application-form-${job.id}`}
      className="application-form"
      onSubmit={handleSubmit}
    >
      <h4>Postuler à cette offre</h4>

      <label htmlFor={`application-name-${job.id}`}>
        Nom complet
      </label>
      <input
        id={`application-name-${job.id}`}
        type="text"
        placeholder="Votre nom complet"
        required
      />

      <label htmlFor={`application-email-${job.id}`}>
        Adresse email
      </label>
      <input
        id={`application-email-${job.id}`}
        type="email"
        placeholder="Votre adresse email"
        required
      />

      <label htmlFor={`application-cv-${job.id}`}>
        Votre CV
      </label>
      <input
        id={`application-cv-${job.id}`}
        type="file"
        accept=".pdf,.doc,.docx"
        required
      />

      <label htmlFor={`application-message-${job.id}`}>
        Message au recruteur
      </label>
      <textarea
        id={`application-message-${job.id}`}
        name="message"
        placeholder="Présentez-vous en quelques lignes, expliquez votre motivation..."
        rows="6"
        maxLength={4000}
        value={applicationMessage}
        onChange={(event) =>
          setApplicationMessage(event.target.value)
        }
        required
      />

      <p className="message-limit">
        {4000 - applicationMessage.length} caractères restants sur 4 000
      </p>

      <button
        type="button"
        className="cancel-application"
        onClick={onCancel}
      >
        Annuler ma candidature
      </button>

      <button type="submit">
        Envoyer ma candidature
      </button>

      {applicationStatus && (
        <p className="application-status" role="status">
          {applicationStatus}
        </p>
      )}
    </form>
  )
}

export default ApplicationForm
