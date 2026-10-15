
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import JobPublicationForm from './components/JobPublicationForm'
import JobFilters from './components/JobFilters'
import JobCard from './components/JobCard'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import CompanyDashboard from './pages/CompanyDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import JobDetails from './pages/JobDetails'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([])
  const [jobsError, setJobsError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadJobs() {
      try {
        const response = await fetch('/api/ads/', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Impossible de charger les offres.')
        }

        const data = await response.json()
        console.log('Offres reçues de Django :', data)
        setJobs(
          data.map((ad) => ({
            id: ad.ad_id,
            title: ad.title,
            company: ad.company.name,
            location: ad.city,
            category: ad.category,
            contractType: ad.contract_type,
            salaryMin: ad.salary_min,
            salaryMax: ad.salary_max,
            workMode: ad.work_mode,
            workingTime: ad.work_time,
            experienceLevel: ad.experience_level,
            description: ad.description,
            publishedAt: null,
          }))
        )
      } catch (error) {
        if (error.name !== 'AbortError') {
          setJobsError(error.message)
        }
      }
    }

    loadJobs()

    return () => controller.abort()
  }, [])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [contractType, setContractType] = useState('')
  const [publicationPeriod, setPublicationPeriod] = useState('')
  const [minimumSalary, setMinimumSalary] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [workingTime, setWorkingTime] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const userRole = null
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobPublicationMessage, setJobPublicationMessage] = useState('')

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

  function normalizeText(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  const filteredJobs = jobs
    .filter((job) => normalizeText(job.title).includes(normalizeText(search)))
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
    .filter((job) => minimumSalary === '' || job.salaryMax >= Number(minimumSalary))
    .filter((job) => workMode === '' || job.workMode === workMode)
    .filter((job) => workingTime === '' || job.workingTime === workingTime)
    .filter((job) => experienceLevel === '' || job.experienceLevel === experienceLevel)

  function resetFilters() {
    setSearch('')
    setCategory('')
    setContractType('')
    setPublicationPeriod('')
    setMinimumSalary('')
    setWorkMode('')
    setWorkingTime('')
    setExperienceLevel('')
  }

  return (
    <>
      <Header userRole={userRole} setShowJobForm={setShowJobForm} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              {userRole === 'company' && showJobForm && (
                <JobPublicationForm
                  onClose={() => setShowJobForm(false)}
                  jobPublicationMessage={jobPublicationMessage}
                  setJobPublicationMessage={setJobPublicationMessage}
                />
              )}
              <div className={`jobs-layout ${showFilters ? '' : 'filters-hidden'}`}>
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
                <section className="jobs-results" aria-labelledby="results-title">
                  <h2 id="results-title">Nos offres d'emploi</h2>
                  {jobsError && <p role="alert">{jobsError}</p>}
                  <p className="results-count" role="status">
                    {filteredJobs.length} offre(s) trouvée(s)
                  </p>
                  {filteredJobs.length === 0 && (
                    <p className="empty-results">
                      Aucune offre ne correspond à vos critères.
                    </p>
                  )}
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </section>
              </div>
            </main>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
