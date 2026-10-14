
import ApplicationForm from './ApplicationForm'

function JobCard({
  job,
  selectedJob,
  openJob,
  setSelectedJob,
  showApplication,
  setShowApplication,
  applicationMessage,
  setApplicationMessage,
  applicationStatus,
  setApplicationStatus,
}) {
  const isSelected = selectedJob?.id === job.id

  function resetApplication() {
    setShowApplication(false)
    setApplicationMessage('')
    setApplicationStatus('')
  }

  function toggleApplication() {
    setShowApplication((previous) => !previous)
    setApplicationMessage('')
    setApplicationStatus('')
  }

  function closeJob() {
    resetApplication()
    setSelectedJob(null)
  }

  return (
    <article className="job-card">
      <h3>{job.title}</h3>

      <p>Entreprise : {job.company}</p>
      <p>Lieu : {job.location}</p>
      <p>Univers : {job.category}</p>
      <p>Contrat : {job.contractType}</p>
      <p>
        Salaire : {job.salaryMin}–{job.salaryMax} € brut/mois
      </p>
      <p>
        {job.workMode} · {job.workingTime}
      </p>
      <p>Expérience : {job.experienceLevel}</p>
      <p>
        Publiée le{' '}
        {new Date(
          `${job.publishedAt}T00:00:00`
        ).toLocaleDateString('fr-FR')}
      </p>

      <button
        type="button"
        onClick={() => openJob(job)}
        aria-expanded={isSelected}
        aria-controls={`job-details-${job.id}`}
      >
        Voir l'offre
      </button>

      <section
        id={`job-details-${job.id}`}
        className="job-details"
        aria-labelledby={`details-title-${job.id}`}
        hidden={!isSelected}
      >
        <h4 id={`details-title-${job.id}`}>
          Description du poste
        </h4>

        <p>{job.description}</p>

        <button
          type="button"
          onClick={toggleApplication}
          aria-expanded={showApplication}
          aria-controls={`application-form-${job.id}`}
        >
          {showApplication
            ? 'Masquer le formulaire'
            : 'Postuler'}
        </button>

        {showApplication && isSelected && (
          <ApplicationForm
            key={`${job.id}-${showApplication}`}
            job={job}
            applicationMessage={applicationMessage}
            setApplicationMessage={setApplicationMessage}
            applicationStatus={applicationStatus}
            setApplicationStatus={setApplicationStatus}
            onCancel={resetApplication}
          />
        )}

        <button type="button" onClick={closeJob}>
          Fermer
        </button>
      </section>
    </article>
  )
}

export default JobCard
