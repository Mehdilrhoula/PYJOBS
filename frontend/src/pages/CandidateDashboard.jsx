import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function CandidateDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needsLogin, setNeedsLogin] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadApplications() {
      setLoading(true)
      setError('')
      setNeedsLogin(false)
      setApplications([])

      try {
        const response = await fetch('/api/my-applications/', {
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (response.status === 401 || response.status === 403) {
          setNeedsLogin(true)
          throw new Error(
            'Connectez-vous avec votre compte candidat pour voir vos candidatures.'
          )
        }

        if (!response.ok) {
          throw new Error('Impossible de charger vos candidatures.')
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setApplications(data)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(
            error instanceof TypeError
              ? 'Impossible de contacter Django. Vérifiez que le serveur est lancé.'
              : error.message
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadApplications()

    return () => controller.abort()
  }, [reloadCount])

  return (
    <main className="candidate-dashboard">
      <h1>Espace candidat</h1>

      <Link to="/" className="dashboard-back-link">
        ← Retour aux offres
      </Link>

      <p>Retrouvez les candidatures enregistrées avec votre compte.</p>

      <section className="candidate-section">
        <h2>
          Mes candidatures
          {!loading && !error && ` (${applications.length})`}
        </h2>

        <button
          type="button"
          onClick={() => setReloadCount((previous) => previous + 1)}
          disabled={loading}
        >
          {loading ? 'Chargement…' : 'Actualiser mes candidatures'}
        </button>

        {loading && (
          <p role="status">Chargement de vos candidatures…</p>
        )}

        {error && (
          <div role="alert">
            <p>{error}</p>

            {needsLogin && (
              <Link to="/login">Se connecter</Link>
            )}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <p>Vous n'avez aucune candidature pour le moment.</p>
        )}

        {!loading && !error && applications.map((application) => (
          <article
            key={application.application_id}
            className="candidate-application"
          >
            <h3>{application.ad.title}</h3>

            <p>
              <strong>Entreprise :</strong>{' '}
              {application.ad.company.name}
            </p>

            <p>
              <strong>Ville :</strong> {application.ad.city}
            </p>

            <p>
              <strong>Contrat :</strong>{' '}
              {application.ad.contract_type}
            </p>

            <p>
              <strong>Date de candidature :</strong>{' '}
              {new Date(
                `${application.application_date}T12:00:00`
              ).toLocaleDateString('fr-FR')}
            </p>

            <p>
              <strong>Votre message :</strong>
            </p>

            <p style={{ whiteSpace: 'pre-wrap' }}>
              {application.message}
            </p>

            <Link
              to={`/jobs/${application.ad.ad_id}`}
              className="job-details-link"
            >
              Voir l'offre
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}

export default CandidateDashboard