import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [contractType, setContractType] = useState('')
  const [publicationPeriod, setPublicationPeriod] = useState('')
  const [minimumSalary, setMinimumSalary] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [workingTime, setWorkingTime] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)

  const jobs = [
    {
      id: 1,
      title: 'Développeur web junior',
      company: 'Entreprise Exemple',
      location: 'Marseille',
      category: 'IT',
      contractType: 'Alternance',
      publishedAt: '2026-10-09',
      salaryMin: 1200,
      salaryMax: 1800,
      workMode: 'Hybride',
      workingTime: 'Temps plein',
      experienceLevel: 'Débutant',
      description: 'Participer au développement de sites et applications web.',
    },
    {
      id: 2,
      title: 'Technicien informatique',
      company: 'Société Démo',
      location: 'Aix-en-Provence',
      category: 'IT',
      contractType: 'CDI',
      publishedAt: '2026-10-05',
      salaryMin: 2200,
      salaryMax: 2800,
      workMode: 'Sur place',
      workingTime: 'Temps plein',
      experienceLevel: 'Confirmé',
      description: 'Accompagner les utilisateurs et assurer la maintenance informatique.',
    },
    {
      id: 3,
      title: 'Assistant marketing',
      company: 'Agence Exemple',
      location: 'Toulon',
      category: 'Marketing',
      contractType: 'CDD',
      publishedAt: '2026-10-08',
      salaryMin: 1100,
      salaryMax: 1400,
      workMode: 'À distance',
      workingTime: 'Temps partiel',
      experienceLevel: 'Débutant',
      description: 'Participer aux campagnes marketing et à la gestion des réseaux sociaux.',
    },
    {
      id: 4,
      title: 'Commercial B2B',
      company: 'Commerce Démo',
      location: 'Marseille',
      category: 'Commerce',
      contractType: 'CDI',
      publishedAt: '2026-09-20',
      salaryMin: 2500,
      salaryMax: 3200,
      workMode: 'Hybride',
      workingTime: 'Temps plein',
      experienceLevel: 'Confirmé',
      description: 'Développer un portefeuille de clients et présenter les services de l’entreprise.',
    },
  ]

  const filteredJobs = jobs
    .filter((job) =>
      job.title.toLowerCase().includes(search.trim().toLowerCase())
    )
    .filter((job) => category === '' || job.category === category)
    .filter((job) => contractType === '' || job.contractType === contractType)
    .filter((job) => {
      if (publicationPeriod === '') return true

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const earliestDate = new Date(today)
      earliestDate.setDate(today.getDate() - Number(publicationPeriod) + 1)

      const publicationDate = new Date(`${job.publishedAt}T00:00:00`)

      return publicationDate >= earliestDate && publicationDate <= today
    })
    .filter((job) =>
      minimumSalary === '' || job.salaryMax >= Number(minimumSalary)
    )
    .filter((job) => workMode === '' || job.workMode === workMode)
    .filter((job) => workingTime === '' || job.workingTime === workingTime)
    .filter((job) =>
      experienceLevel === '' || job.experienceLevel === experienceLevel
    )

  const visibleSelectedJob = filteredJobs.find(
    (job) => job.id === selectedJob?.id
  )

  function resetFilters() {
    setSearch('')
    setCategory('')
    setContractType('')
    setPublicationPeriod('')
    setMinimumSalary('')
    setWorkMode('')
    setWorkingTime('')
    setExperienceLevel('')
    setSelectedJob(null)
  }

  return (
    <>
      <header>
        <h1>PYJOBS</h1>
      </header>

      <main>
        <div className="jobs-layout">
          <aside className="filters-panel" aria-labelledby="filters-title">
            <h2 id="filters-title">Filtrer les offres</h2>

            <div className="filters">
              <div className="filter-field">
                <label htmlFor="search">Rechercher par titre</label>
                <input
                  id="search"
                  type="search"
                  placeholder="Exemple : développeur"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="filter-field">
                <label htmlFor="category">Univers</label>
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">Tous les univers</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>

              <div className="filter-field">
                <label htmlFor="contractType">Type de contrat</label>
                <select
                  id="contractType"
                  value={contractType}
                  onChange={(event) => setContractType(event.target.value)}
                >
                  <option value="">Tous les contrats</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Stage">Stage</option>
                  <option value="Intérim">Intérim</option>
                </select>
              </div>

              <div className="filter-field">
                <label htmlFor="publicationPeriod">Date de publication</label>
                <select
                  id="publicationPeriod"
                  value={publicationPeriod}
                  onChange={(event) => setPublicationPeriod(event.target.value)}
                >
                  <option value="">Toutes les dates</option>
                  <option value="1">Aujourd’hui</option>
                  <option value="7">Les 7 derniers jours</option>
                  <option value="30">Les 30 derniers jours</option>
                </select>
              </div>

              <div className="filter-field">
                <label htmlFor="minimumSalary">
                  Salaire souhaité (€ brut/mois)
                </label>
                <input
                  id="minimumSalary"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Exemple : 2000"
                  value={minimumSalary}
                  onChange={(event) => setMinimumSalary(event.target.value)}
                  aria-describedby="salary-help"
                />
                <p id="salary-help" className="filter-help">
                  Comparé au maximum de la fourchette proposée.
                </p>
              </div>

              <div className="filter-field">
                <label htmlFor="workMode">Télétravail</label>
                <select
                  id="workMode"
                  value={workMode}
                  onChange={(event) => setWorkMode(event.target.value)}
                >
                  <option value="">Tous les modes</option>
                  <option value="Sur place">Sur place</option>
                  <option value="Hybride">Hybride</option>
                  <option value="À distance">À distance</option>
                </select>
              </div>

              <div className="filter-field">
                <label htmlFor="workingTime">Temps de travail</label>
                <select
                  id="workingTime"
                  value={workingTime}
                  onChange={(event) => setWorkingTime(event.target.value)}
                >
                  <option value="">Tous les temps de travail</option>
                  <option value="Temps plein">Temps plein</option>
                  <option value="Temps partiel">Temps partiel</option>
                </select>
              </div>

              <div className="filter-field">
                <label htmlFor="experienceLevel">Niveau d’expérience</label>
                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(event) => setExperienceLevel(event.target.value)}
                >
                  <option value="">Tous les niveaux</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            <button type="button" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
          </aside>

          <section className="jobs-results" aria-labelledby="results-title">
            <h2 id="results-title">Nos offres d’emploi</h2>

            <p className="results-count" role="status">
              {filteredJobs.length} offre(s) trouvée(s)
            </p>

            {filteredJobs.length === 0 && (
              <p className="empty-results">
                Aucune offre ne correspond à vos critères.
              </p>
            )}

            {filteredJobs.map((job) => (
              <article className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>Entreprise : {job.company}</p>
                <p>Lieu : {job.location}</p>
                <p>Univers : {job.category}</p>
                <p>Contrat : {job.contractType}</p>
                <p>
                  Salaire : {job.salaryMin}–{job.salaryMax} € brut/mois
                </p>
                <p>{job.workMode} · {job.workingTime}</p>
                <p>Expérience : {job.experienceLevel}</p>
                <p>
                  Publiée le{' '}
                  {new Date(`${job.publishedAt}T00:00:00`).toLocaleDateString('fr-FR')}
                </p>
                <button type="button" onClick={() => setSelectedJob(job)}>
                  Voir l’offre
                </button>
              </article>
            ))}

            {visibleSelectedJob && (
              <section className="job-details" aria-labelledby="details-title">
                <h2 id="details-title">{visibleSelectedJob.title}</h2>
                <p>{visibleSelectedJob.description}</p>
                <button type="button" onClick={() => setSelectedJob(null)}>
                  Fermer
                </button>
              </section>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

export default App