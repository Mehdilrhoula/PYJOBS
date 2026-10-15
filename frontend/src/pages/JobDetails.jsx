
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ApplicationForm from '../components/ApplicationForm'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [canManage, setCanManage] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [managementError, setManagementError] = useState('')

  const [showApplication, setShowApplication] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError('')
    setJob(null)
    setShowApplication(false)
    setApplicationMessage('')
    setApplicationStatus('')

    async function loadJob() {
      try {
        const response = await fetch(`/api/ads/${id}/`, {
          signal: controller.signal,
        })

        if (response.status === 404) {
          return
        }

        if (!response.ok) {
          throw new Error('Impossible de charger cette offre.')
        }

        const ad = await response.json()

        if (controller.signal.aborted) return

        setJob({
          id: ad.ad_id,
          title: ad.title,
          company: ad.company.name,
          companyId: ad.company.company_id,
          location: ad.city,
          category: ad.category,
          contractType: ad.contract_type,
          salaryMin: ad.salary_min,
          salaryMax: ad.salary_max,
          workMode: ad.work_mode,
          workingTime: ad.work_time,
          experienceLevel: ad.experience_level,
          description: ad.description,
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadJob()

    return () => controller.abort()
  }, [id])

  useEffect(() => {
    const controller = new AbortController()

    async function loadSession() {
      try {
        const response = await fetch('/api/session/', {
          credentials: 'same-origin',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Impossible de vérifier la session.')
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setSession(data)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSession(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setSessionLoading(false)
        }
      }
    }

    loadSession()

    return () => controller.abort()
  }, [])


  useEffect(() => {
    if (sessionLoading || !job) return

    if (session?.authenticated && session?.user?.role === 'admin') {
      setCanManage(true)
      return
    }

    if (
      !session?.authenticated ||
      session?.user?.role !== 'employer'
    ) {
      setCanManage(false)
      return
    }

    const controller = new AbortController()

    async function checkOwnership() {
      try {
        const response = await fetch('/api/my-companies/', {
          credentials: 'same-origin',
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Accès refusé')

        const companies = await response.json()

        if (!controller.signal.aborted) {
          setCanManage(
            companies.some(
              (company) =>
                Number(company.company_id) === Number(job.companyId)
            )
          )
        }
      } catch {
        if (!controller.signal.aborted) setCanManage(false)
      }
    }

    checkOwnership()
    return () => controller.abort()
  }, [job, session, sessionLoading])

  async function deleteCurrentJob() {
    if (!window.confirm(
      "Supprimer définitivement cette annonce ? Les candidatures associées seront également supprimées."
    )) return

    setDeleting(true)
    setManagementError('')

    try {
      const responseSession = await fetch('/api/session/', {
        credentials: 'same-origin',
      })

      if (!responseSession.ok) throw new Error('Session indisponible.')

      const currentSession = await responseSession.json()

      if (!currentSession.authenticated) {
        throw new Error('Vous devez être connecté.')
      }

      const response = await fetch(`/api/ads/${job.id}/`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': currentSession.csrfToken,
        },
      })

      if (!response.ok) {
        throw new Error('Le serveur a refusé la suppression.')
      }

      navigate(currentSession.user.role === 'admin'
        ? '/admin'
        : '/company/dashboard')
    } catch (error) {
      setManagementError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  function toggleApplication() {
    setShowApplication((previous) => !previous)
    setApplicationMessage('')
    setApplicationStatus('')
  }

  function cancelApplication() {
    setShowApplication(false)
    setApplicationMessage('')
    setApplicationStatus('')
  }

  const isCandidate =
    session?.authenticated === true &&
    session?.user?.role === 'candidate'

  if (loading) {
    return (
      <main className="job-details-page">
        <p role="status">Chargement de l’offre…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="job-details-page">
        <h1>Chargement impossible</h1>
        <p role="alert">{error}</p>
        <Link to="/">← Retour aux offres</Link>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="job-details-page">
        <h1>Offre introuvable</h1>
        <p>
          Cette offre d'emploi n'existe pas ou n'est plus disponible.
        </p>
        <Link to="/">← Retour aux offres</Link>
      </main>
    )
  }

  return (
    <main className="job-details-page">
      <Link to="/" className="dashboard-back-link">
        ← Retour aux offres
      </Link>

      <section className="job-details-content">
        <h1>{job.title}</h1>

        <h2>{job.company}</h2>

        <p>
          <strong>Ville :</strong> {job.location}
        </p>

        <p>
          <strong>Catégorie :</strong> {job.category}
        </p>

        <p>
          <strong>Contrat :</strong> {job.contractType}
        </p>

        <p>
          <strong>Mode de travail :</strong> {job.workMode}
        </p>

        <p>
          <strong>Temps de travail :</strong> {job.workingTime}
        </p>

        <p>
          <strong>Expérience :</strong> {job.experienceLevel}
        </p>

        <p>
          <strong>Salaire indicatif :</strong>{' '}
          {job.salaryMin == null && job.salaryMax == null
            ? 'Non renseigné'
            : job.salaryMin == null
              ? `Jusqu’à ${job.salaryMax} € brut/mois`
              : job.salaryMax == null
                ? `À partir de ${job.salaryMin} € brut/mois`
                : `${job.salaryMin} € – ${job.salaryMax} € brut/mois`}
        </p>

        <h2>Description du poste</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {job.description}
        </p>

        {sessionLoading && (
          <p role="status">Vérification de votre session…</p>
        )}


        {!sessionLoading && canManage && (
          <div className="job-management-actions">
            <Link
              to={
                session?.user?.role === 'admin'
                  ? '/admin'
                  : `/company/dashboard?editAd=${job.id}`
              }
            >
              Modifier l'annonce
            </Link>

            <button
              type="button"
              onClick={deleteCurrentJob}
              disabled={deleting}
            >
              {deleting ? 'Suppression…' : "Supprimer l'annonce"}
            </button>

            <Link
              to={
                session?.user?.role === 'admin'
                  ? '/admin'
                  : '/company/dashboard?section=applications'
              }
            >
              Voir les candidatures
            </Link>
          </div>
        )}

        {managementError && (
          <p role="alert">{managementError}</p>
        )}

        {!sessionLoading && isCandidate && (
          <>
            <button
              type="button"
              onClick={toggleApplication}
              aria-expanded={showApplication}
              aria-controls={`application-form-${job.id}`}
            >
              {showApplication
                ? 'Masquer le formulaire'
                : 'Postuler à cette offre'}
            </button>

            {showApplication && (
              <ApplicationForm
                job={job}
                applicationMessage={applicationMessage}
                setApplicationMessage={setApplicationMessage}
                applicationStatus={applicationStatus}
                setApplicationStatus={setApplicationStatus}
                onCancel={cancelApplication}
              />
            )}
          </>
        )}

        {!sessionLoading && session?.authenticated === false && (
          <p>
            <Link to="/login">Connectez-vous</Link> avec un compte
            candidat pour postuler à cette offre.
          </p>
        )}
      </section>
    </main>
  )
}

export default JobDetails
