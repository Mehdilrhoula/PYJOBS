import { Link } from 'react-router-dom'

function JobCard({ job }) {
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

      <Link
        to={`/jobs/${job.id}`}
        className="job-details-link"
      >
        Voir l'offre complète
      </Link>
    </article>
  )
}

export default JobCard