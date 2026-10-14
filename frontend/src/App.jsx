
import { useEffect, useRef, useState } from 'react'

import Header from './components/Header'
import AuthForm from './components/AuthForm'
import JobPublicationForm from './components/JobPublicationForm'
import JobFilters from './components/JobFilters'
import JobCard from './components/JobCard'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import './App.css'
import Register from './pages/Register'

function App() {
  // États des filtres
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [contractType, setContractType] = useState('')
  const [publicationPeriod, setPublicationPeriod] = useState('')
  const [minimumSalary, setMinimumSalary] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [workingTime, setWorkingTime] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // États des offres et candidatures
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplication, setShowApplication] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('')

  // États de connexion et d'inscription
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [registerRole, setRegisterRole] = useState('candidate')
  const [showPassword, setShowPassword] = useState(false)

  // Aucun utilisateur connecté au démarrage
  const [userRole] = useState(null)

  // États de publication
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobPublicationMessage, setJobPublicationMessage] = useState('')

  // Position de défilement avant l'ouverture d'une offre
  const previousScrollPosition = useRef(null)

  // Offres fictives en attendant le backend
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
      description:
        'Participer au développement de sites et applications web.',
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
      description:
        'Accompagner les utilisateurs et assurer la maintenance informatique.',
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
      workMode: 'Distanciel',
      workingTime: 'Temps partiel',
      experienceLevel: 'Débutant',
      description:
        'Participer aux campagnes marketing et à la gestion des réseaux sociaux.',
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
      description:
        "Développer un portefeuille de clients et présenter les services de l'entreprise.",
    },
  ]

  // Compter les filtres actifs
  const activeFiltersCount = [
    search.trim(),
    category,
    contractType,
    publicationPeriod,
    minimumSalary,
    workMode,
    workingTime,
    experienceLevel,
  ].filter((value) => value !== '').length

  // Normaliser les textes pour la recherche
  function normalizeText(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  // Filtrer les offres
  const filteredJobs = jobs
    .filter((job) =>
      normalizeText(job.title).includes(normalizeText(search))
    )
    .filter((job) => category === '' || job.category === category)
    .filter(
      (job) =>
        contractType === '' || job.contractType === contractType
    )
    .filter((job) => {
      if (publicationPeriod === '') return true

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const earliestDate = new Date(today)
      earliestDate.setDate(
        today.getDate() - Number(publicationPeriod) + 1
      )

      const publicationDate = new Date(
        `${job.publishedAt}T00:00:00`
      )

      return (
        publicationDate >= earliestDate &&
        publicationDate <= today
      )
    })
    .filter(
      (job) =>
        minimumSalary === '' ||
        job.salaryMax >= Number(minimumSalary)
    )
    .filter(
      (job) => workMode === '' || job.workMode === workMode
    )
    .filter(
      (job) => workingTime === '' || job.workingTime === workingTime
    )
    .filter(
      (job) =>
        experienceLevel === '' ||
        job.experienceLevel === experienceLevel
    )

  // Gérer le défilement lors de l'ouverture d'une offre
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (selectedJob) {
      const details = document.getElementById(
        `job-details-${selectedJob.id}`
      )

      if (details && !details.hidden) {
        details.scrollIntoView({
          behavior: reducedMotion ? 'instant' : 'smooth',
          block: 'start',
        })
      }
    } else if (previousScrollPosition.current !== null) {
      window.scrollTo({
        top: previousScrollPosition.current,
        behavior: reducedMotion ? 'instant' : 'smooth',
      })

      previousScrollPosition.current = null
    }
  }, [selectedJob])

  // Ouvrir une offre
  function openJob(job) {
    if (previousScrollPosition.current === null) {
      previousScrollPosition.current = window.scrollY
    }

    setShowApplication(false)
    setApplicationMessage('')
    setApplicationStatus('')
    setSelectedJob(job)
  }

  // Valider le formulaire de connexion ou d'inscription
  function handleAuthSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const confirmation = formData.get('confirmPassword')

    if (showRegister) {
      const name = String(formData.get('name') ?? '').trim()

      if (name === '') {
        setAuthMessage(
          registerRole === 'company'
            ? 'Veuillez renseigner la raison sociale.'
            : 'Veuillez renseigner votre nom complet.'
        )
        return
      }
    }

    if (showRegister && password !== confirmation) {
      setAuthMessage(
        'Les deux mots de passe ne correspondent pas.'
      )
      return
    }

    setAuthMessage(
      showRegister
        ? 'Les informations sont valides. La création du compte sera disponible une fois le serveur connecté.'
        : 'La connexion sera disponible une fois le serveur connecté.'
    )
  }

  // Réinitialiser tous les filtres
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
      <Header
        userRole={userRole}
        setShowJobForm={setShowJobForm}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <main>
                {userRole === 'company' && showJobForm && (
                  <JobPublicationForm
                    onClose={() => setShowJobForm(false)}
                    jobPublicationMessage={jobPublicationMessage}
                    setJobPublicationMessage={setJobPublicationMessage}
                  />
                )}

                <div
                  className={`jobs-layout ${showFilters ? '' : 'filters-hidden'
                    }`}
                >
                  <JobFilters
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    contractType={contractType}
                    setContractType={setContractType}
                    publicationPeriod={publicationPeriod}
                    setPublicationPeriod={setPublicationPeriod}
                    minimumSalary={minimumSalary}
                    setMinimumSalary={setMinimumSalary}
                    workMode={workMode}
                    setWorkMode={setWorkMode}
                    workingTime={workingTime}
                    setWorkingTime={setWorkingTime}
                    experienceLevel={experienceLevel}
                    setExperienceLevel={setExperienceLevel}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    activeFiltersCount={activeFiltersCount}
                    resetFilters={resetFilters}
                  />

                  <section
                    className="jobs-results"
                    aria-labelledby="results-title"
                  >
                    <h2 id="results-title">
                      Nos offres d'emploi
                    </h2>

                    <p className="results-count" role="status">
                      {filteredJobs.length} offre(s) trouvée(s)
                    </p>

                    {filteredJobs.length === 0 && (
                      <p className="empty-results">
                        Aucune offre ne correspond à vos critères.
                      </p>
                    )}

                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        selectedJob={selectedJob}
                        openJob={openJob}
                        setSelectedJob={setSelectedJob}
                        showApplication={showApplication}
                        setShowApplication={setShowApplication}
                        applicationMessage={applicationMessage}
                        setApplicationMessage={setApplicationMessage}
                        applicationStatus={applicationStatus}
                        setApplicationStatus={setApplicationStatus}
                      />
                    ))}
                  </section>
                </div>
              </main>
            </>
          }
        />

          <Route
            path="/login"
            element={<Login />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
    </>
  )
}

export default App
