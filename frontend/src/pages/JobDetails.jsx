import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { jobs } from '../data/jobs'
import ApplicationForm from '../components/ApplicationForm'

function JobDetails() {
  const { id } = useParams()

  const [showApplication, setShowApplication] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('')

  const job = jobs.find((job) => job.id === Number(id))

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

  if (!job) {
    return (
      <main className="job-details-page">
        <h1>Offre introuvable</h1>
        <p>Cette offre d'emploi n'existe pas ou n'est plus disponible.</p>
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

        <p><strong>Ville :</strong> {job.location}</p>
        <p><strong>Catégorie :</strong> {job.category}</p>
        <p><strong>Contrat :</strong> {job.contractType}</p>
        <p><strong>Mode de travail :</strong> {job.workMode}</p>
        <p><strong>Temps de travail :</strong> {job.workingTime}</p>
        <p><strong>Expérience :</strong> {job.experienceLevel}</p>

        <p>
          <strong>Salaire indicatif :</strong> {job.salaryMin} € – {job.salaryMax} € brut/mois
        </p>

        <p>
          <strong>Publiée le :</strong>{' '}
          {new Date(`${job.publishedAt}T12:00:00`).toLocaleDateString('fr-FR')}
        </p>

        <h2>Description du poste</h2>
        <p>{job.description}</p>

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
      </section>
    </main>
  )
}

export default JobDetails