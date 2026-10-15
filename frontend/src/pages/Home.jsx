import { Link } from 'react-router-dom'

function Home({ jobs = [], jobsError = '' }) {
  const companies = new Set(
    jobs.map(job => job.company).filter(Boolean)
  )

  const recentJobs = jobs.slice(-3).reverse()

  return (
    <main className="pyjobs-home">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">Bienvenue sur PYJOBS</span>
          <h1>Votre prochain emploi commence ici.</h1>
          <p>
            Découvrez les opportunités professionnelles,
            explorez les entreprises qui recrutent
            et donnez un nouvel élan à votre carrière.
          </p>
          <div className="home-actions">
            <Link to="/jobs" className="home-btn home-btn-primary">
              Découvrir les offres →
            </Link>
            <Link to="/register" className="home-btn home-btn-outline">
              Je recrute
            </Link>
          </div>
        </div>
      </section>

      <section className="home-stats" aria-label="PYJOBS en chiffres">
        <div className="home-stat">
          <strong>{jobs.length}</strong>
          <span>Offres publiées</span>
        </div>
        <div className="home-stat">
          <strong>{companies.size}</strong>
          <span>Entreprises présentes</span>
        </div>
        <div className="home-stat">
          <strong>1</strong>
          <span>Plateforme pour vos opportunités</span>
        </div>
      </section>

      {jobsError && (
        <p role="alert" className="home-data-error">{jobsError}</p>
      )}

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-section-kicker">OPPORTUNITÉS</span>
            <h2>Découvrez nos offres</h2>
            <p>Les dernières opportunités disponibles sur PYJOBS.</p>
          </div>
          <Link to="/jobs" className="home-text-link">
            Toutes les offres →
          </Link>
        </div>

        <div className="home-job-grid">
          {recentJobs.map(job => (
            <article className="home-job-card" key={job.id}>
              <span className="home-job-tag">
                {job.contractType || 'Offre d’emploi'}
              </span>
              <h3>{job.title}</h3>
              <p className="home-job-company">{job.company}</p>
              <p>📍 {job.location || 'Lieu non précisé'}</p>
              <Link to={`/jobs/${job.id}`} className="home-text-link">
                Voir l’offre →
              </Link>
            </article>
          ))}
          {!recentJobs.length && (
            <p>Aucune offre publiée pour le moment.</p>
          )}
        </div>
      </section>

      <section className="home-about">
        <span className="home-section-kicker">NOTRE PROJET</span>
        <h2>À propos de PYJOBS</h2>
        <p>
          PYJOBS est une plateforme de recherche d'emploi et de
          recrutement conçue dans le cadre d'un projet pédagogique
          à Epitech.
        </p>
        <p>
          Développée par <strong>Mehdi Lrhoula</strong> et
          <strong> Ruben Bernardo Martins</strong>, elle permet aux
          candidats de découvrir des offres et aux entreprises
          de gérer leur recrutement.
        </p>
        <span className="home-epitech">Projet Epitech · Job Board</span>
      </section>
    </main>
  )
}

export default Home
