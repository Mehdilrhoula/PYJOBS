
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CompanyEditor from '../components/CompanyEditor'
import ApplicationManager from '../components/ApplicationManager'

const initialOffer = {
  company_id: '',
  title: '',
  city: '',
  category: 'IT',
  contract_type: 'CDI',
  salary_min: '',
  salary_max: '',
  work_mode: 'Sur place',
  work_time: 'Temps plein',
  experience_level: 'Débutant',
  description: '',
}

const selectFields = [
  {
    name: 'category',
    label: 'Univers',
    options: ['IT', 'Marketing', 'Commerce'],
  },
  {
    name: 'contract_type',
    label: 'Contrat',
    options: ['CDI', 'CDD', 'Alternance', 'Stage', 'Intérim'],
  },
  {
    name: 'work_mode',
    label: 'Mode de travail',
    options: ['Sur place', 'Hybride', 'Distanciel'],
  },
  {
    name: 'work_time',
    label: 'Temps de travail',
    options: ['Temps plein', 'Temps partiel'],
  },
  {
    name: 'experience_level',
    label: "Niveau d'expérience",
    options: ['Débutant', 'Junior', 'Intermédiaire', 'Senior', 'Expert'],
  },
]

async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }

  if (method !== 'GET') {
    const session = await apiRequest('/api/session/')

    if (!session.authenticated) {
      throw new Error('Votre session a expiré. Reconnectez-vous.')
    }

    headers['X-CSRFToken'] = session.csrfToken

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
  }

  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const text = await response.text()
  let data = {}

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error('Réponse inattendue du serveur.')
    }
  }

  if (!response.ok) {
    const details =
      typeof data === 'object' && data !== null
        ? Object.values(data).flat().join(' ')
        : ''

    throw new Error(details || 'La demande a échoué.')
  }

  return data
}

function CompanyDashboard() {
  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [myAds, setMyAds] = useState([])
  const [dashboardTab, setDashboardTab] = useState('companies')

  const [companyName, setCompanyName] = useState('')
  const [offer, setOffer] = useState(initialOffer)

  const [editingAd, setEditingAd] = useState(null)
  const [editOffer, setEditOffer] = useState(initialOffer)

  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [savingCompany, setSavingCompany] = useState(false)
  const [savingOffer, setSavingOffer] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingAdId, setDeletingAdId] = useState(null)

  const [loadError, setLoadError] = useState('')
  const [companyError, setCompanyError] = useState('')
  const [companyMessage, setCompanyMessage] = useState('')
  const [offerError, setOfferError] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [adsError, setAdsError] = useState('')
  const [adsMessage, setAdsMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadSpace() {
      try {
        const session = await apiRequest('/api/session/')

        if (!session.authenticated) {
          throw new Error('Connectez-vous avec un compte employeur.')
        }

        if (!['employer', 'admin'].includes(session.user.role)) {
          throw new Error('Cet espace est réservé aux employeurs.')
        }

        const [companiesData, applicationsData, adsData] =
          await Promise.all([
            apiRequest('/api/my-companies/'),
            apiRequest('/api/employer-applications/'),
            apiRequest('/api/ads/'),
          ])

        const companyIds = new Set(
          companiesData.map((company) => Number(company.company_id))
        )

        const ownAds = adsData.filter((ad) =>
          companyIds.has(Number(ad.company?.company_id))
        )

        if (active) {
          setCompanies(companiesData)
          setApplications(applicationsData)
          setMyAds(ownAds)
          setAllowed(true)
          setOffer((previous) => ({
            ...previous,
            company_id: String(companiesData[0]?.company_id ?? ''),
          }))
        }
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadSpace()

    return () => {
      active = false
    }
  }, [])


  useEffect(() => {
    if (loading || !allowed) return

    const params = new URLSearchParams(window.location.search)
    const editId = params.get('editAd')
    const section = params.get('section')

    if (editId) {
      setDashboardTab('ads')
      const ad = myAds.find(
        (item) => Number(item.ad_id) === Number(editId)
      )

      if (ad) {
        startEditing(ad)

        window.setTimeout(() => {
          const link = document.querySelector(
            `a[href="/jobs/${ad.ad_id}"]`
          )
          const article = link?.closest('article')

          ;(article?.querySelector('form') || article)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
        }, 150)
      }
    } else if (section === 'applications') {
      setDashboardTab('applications')
      window.setTimeout(() => {
        document.querySelector('.employer-applications')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      }, 150)
    }

    if (editId || section) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname
      )
    }
  }, [loading, allowed, myAds])

  async function refreshAds() {
    const adsData = await apiRequest('/api/ads/')

    const companyIds = new Set(
      companies.map((company) => Number(company.company_id))
    )

    setMyAds(
      adsData.filter((ad) =>
        companyIds.has(Number(ad.company?.company_id))
      )
    )
  }

  async function createCompany(event) {
    event.preventDefault()

    if (savingCompany) return

    setCompanyError('')
    setCompanyMessage('')

    if (!companyName.trim()) {
      setCompanyError("Veuillez renseigner le nom de l'entreprise.")
      return
    }

    setSavingCompany(true)

    try {
      const company = await apiRequest('/api/companies/create/', {
        method: 'POST',
        body: { name: companyName.trim() },
      })

      setCompanies((previous) => [...previous, company])
      setOffer((previous) => ({
        ...previous,
        company_id: String(company.company_id),
      }))
      setCompanyName('')
      setCompanyMessage('Entreprise créée.')
    } catch (error) {
      setCompanyError(error.message)
    } finally {
      setSavingCompany(false)
    }
  }

  function changeOffer(event) {
    const { name, value } = event.target

    setOffer((previous) => ({ ...previous, [name]: value }))
    setOfferError('')
    setOfferMessage('')
  }

  function validateOffer(values) {
    if (
      !values.title.trim() ||
      !values.city.trim() ||
      !values.description.trim()
    ) {
      throw new Error('Renseignez le titre, la ville et la description.')
    }

    const salaryMin =
      values.salary_min === '' || values.salary_min == null
        ? null
        : Number(values.salary_min)

    const salaryMax =
      values.salary_max === '' || values.salary_max == null
        ? null
        : Number(values.salary_max)

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      salaryMin > salaryMax
    ) {
      throw new Error('Le salaire minimum ne peut pas dépasser le maximum.')
    }

    return {
      title: values.title.trim(),
      city: values.city.trim(),
      category: values.category,
      contract_type: values.contract_type,
      salary_min: salaryMin,
      salary_max: salaryMax,
      work_mode: values.work_mode,
      work_time: values.work_time,
      experience_level: values.experience_level,
      description: values.description.trim(),
    }
  }

  async function publishOffer(event) {
    event.preventDefault()

    if (savingOffer) return

    setOfferError('')
    setOfferMessage('')
    setSavingOffer(true)

    try {
      const validatedOffer = validateOffer(offer)

      await apiRequest('/api/ads/create/', {
        method: 'POST',
        body: {
          ...validatedOffer,
          company_id: Number(offer.company_id),
        },
      })

      setOffer({
        ...initialOffer,
        company_id: offer.company_id,
      })

      setOfferMessage('Votre offre a été publiée !')

      try {
        await refreshAds()
      } catch {
        setAdsError(
          "Offre publiée, mais la liste n'a pas pu être actualisée."
        )
      }
    } catch (error) {
      setOfferError(error.message)
    } finally {
      setSavingOffer(false)
    }
  }

  function startEditing(ad) {
    setEditingAd(ad.ad_id)

    setEditOffer({
      company_id: String(ad.company?.company_id ?? ''),
      title: ad.title ?? '',
      city: ad.city ?? '',
      category: ad.category ?? 'IT',
      contract_type: ad.contract_type ?? 'CDI',
      salary_min: ad.salary_min ?? '',
      salary_max: ad.salary_max ?? '',
      work_mode: ad.work_mode ?? 'Sur place',
      work_time: ad.work_time ?? 'Temps plein',
      experience_level: ad.experience_level ?? 'Débutant',
      description: ad.description ?? '',
    })

    setAdsError('')
    setAdsMessage('')
  }

  function changeEditOffer(event) {
    const { name, value } = event.target

    setEditOffer((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function saveEditedOffer(event) {
    event.preventDefault()

    if (savingEdit || editingAd === null) return

    setAdsError('')
    setAdsMessage('')
    setSavingEdit(true)

    try {
      const validatedOffer = validateOffer(editOffer)

      await apiRequest(`/api/ads/${editingAd}/`, {
        method: 'PATCH',
        body: validatedOffer,
      })

      setEditingAd(null)
      setAdsMessage('Annonce modifiée avec succès.')

      try {
        await refreshAds()
      } catch {
        setAdsError(
          "Annonce modifiée, mais la liste n'a pas pu être actualisée."
        )
      }
    } catch (error) {
      setAdsError(error.message)
    } finally {
      setSavingEdit(false)
    }
  }

  async function deleteOffer(ad) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'annonce "${ad.title}" ?`
    )

    if (!confirmed) return

    setAdsError('')
    setAdsMessage('')
    setDeletingAdId(ad.ad_id)

    try {
      await apiRequest(`/api/ads/${ad.ad_id}/`, {
        method: 'DELETE',
      })

      setMyAds((previous) =>
        previous.filter((item) => item.ad_id !== ad.ad_id)
      )

      if (editingAd === ad.ad_id) {
        setEditingAd(null)
      }

      setAdsMessage('Annonce supprimée avec succès.')
    } catch (error) {
      setAdsError(error.message)
    } finally {
      setDeletingAdId(null)
    }
  }

  function renderOfferFields(values, onChange, prefix, includeCompany) {
    return (
      <>
        {includeCompany && (
          <>
            <label htmlFor={`${prefix}-company`}>Entreprise</label>
            <select
              id={`${prefix}-company`}
              name="company_id"
              value={values.company_id}
              onChange={onChange}
              required
            >
              {companies.map((company) => (
                <option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor={`${prefix}-title`}>Intitulé du poste</label>
        <input
          id={`${prefix}-title`}
          name="title"
          value={values.title}
          onChange={onChange}
          maxLength={150}
          required
        />

        <label htmlFor={`${prefix}-city`}>Ville</label>
        <input
          id={`${prefix}-city`}
          name="city"
          value={values.city}
          onChange={onChange}
          maxLength={100}
          required
        />

        {selectFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={`${prefix}-${field.name}`}>
              {field.label}
            </label>

            <select
              id={`${prefix}-${field.name}`}
              name={field.name}
              value={values[field.name]}
              onChange={onChange}
              required
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <label htmlFor={`${prefix}-salary-min`}>
          Salaire minimum (€ brut/mois, facultatif)
        </label>
        <input
          id={`${prefix}-salary-min`}
          name="salary_min"
          type="number"
          min="0"
          step="1"
          value={values.salary_min}
          onChange={onChange}
        />

        <label htmlFor={`${prefix}-salary-max`}>
          Salaire maximum (€ brut/mois, facultatif)
        </label>
        <input
          id={`${prefix}-salary-max`}
          name="salary_max"
          type="number"
          min="0"
          step="1"
          value={values.salary_max}
          onChange={onChange}
        />

        <label htmlFor={`${prefix}-description`}>
          Description du poste
        </label>
        <textarea
          id={`${prefix}-description`}
          name="description"
          rows={8}
          value={values.description}
          onChange={onChange}
          required
        />
      </>
    )
  }

  return (
    <main className="company-dashboard">
      <h1>Espace employeur</h1>

      <Link to="/jobs" className="dashboard-back-link">
        ← Retour aux offres
      </Link>

      {loading && <p role="status">Chargement…</p>}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !allowed && (
        <Link to="/login">
          Se connecter avec un compte employeur
        </Link>
      )}

      {!loading && allowed && (
        <>
          <div className="dashboard-stats">
            <div className="dashboard-stat"><span>Mes entreprises</span><strong>{companies.length}</strong></div>
            <div className="dashboard-stat"><span>Mes annonces</span><strong>{myAds.length}</strong></div>
            <div className="dashboard-stat"><span>Candidatures reçues</span><strong>{applications.length}</strong></div>
          </div>

          <nav className="dashboard-tabs" aria-label="Gestion de l'espace employeur">
            {[
              ['companies', 'Mes entreprises'],
              ['ads', 'Mes annonces'],
              ['applications', 'Candidatures reçues'],
              ['publish', 'Publier une offre'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                className={dashboardTab === tab ? 'dashboard-tab-active' : ''}
                aria-current={dashboardTab === tab ? 'page' : undefined}
                onClick={() => setDashboardTab(tab)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className={dashboardTab === 'companies' ? 'dashboard-panel' : 'dashboard-panel dashboard-panel-hidden'}>
            <h2>Mes entreprises ({companies.length})</h2>

            {companies.length === 0 && (
              <p>Créez une entreprise avant de publier une offre.</p>
            )}

            {companies.map((company) => (
              <CompanyEditor
                key={company.company_id}
                company={company}
                onUpdated={(updatedCompany) => {
                  setCompanies((previous) =>
                    previous.map((item) =>
                      item.company_id === updatedCompany.company_id
                        ? updatedCompany
                        : item
                    )
                  )

                  setMyAds((previous) =>
                    previous.map((ad) =>
                      ad.company?.company_id === updatedCompany.company_id
                        ? { ...ad, company: updatedCompany }
                        : ad
                    )
                  )
                }}
              />
            ))}

            <div className="company-premium-create">
              <div className="company-premium-heading">
                <h2>Créer une entreprise</h2>
                <p>
                  Ajoutez une entreprise pour publier vos offres d'emploi.
                </p>
              </div>

            <form className="auth-form company-premium-form" onSubmit={createCompany}>
              <label htmlFor="company-name">
                Nom de l'entreprise
              </label>

              <input
                id="company-name"
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
                maxLength={150}
                disabled={savingCompany}
                required
              />

              <button type="submit" disabled={savingCompany}>
                {savingCompany
                  ? 'Création…'
                  : 'Créer mon entreprise'}
              </button>

              {companyError && (
                <p role="alert">{companyError}</p>
              )}

              {companyMessage && (
                <p role="status">{companyMessage}</p>
              )}
            </form>
            </div>
          </section>

          <section className={dashboardTab === 'ads'
              ? 'employer-ads dashboard-panel'
              : 'employer-ads dashboard-panel dashboard-panel-hidden'}>
            <h2>Mes annonces ({myAds.length})</h2>

            {adsError && <p role="alert">{adsError}</p>}
            {adsMessage && <p role="status">{adsMessage}</p>}

            {myAds.length === 0 ? (
              <p>Vous n'avez publié aucune annonce.</p>
            ) : (
              myAds.map((ad) => (
                <article key={ad.ad_id} className="job-card">
                  <h3>{ad.title}</h3>

                  <p>
                    <strong>Entreprise :</strong>{' '}
                    {ad.company?.name}
                  </p>

                  <p>
                    <strong>Ville :</strong> {ad.city}
                  </p>

                  <p>
                    <strong>Contrat :</strong> {ad.contract_type}
                  </p>

                  <Link to={`/jobs/${ad.ad_id}`}>
                    Voir l'annonce
                  </Link>

                  <div>
                    <button
                      type="button"
                      className="dashboard-btn-edit" onClick={() => startEditing(ad)}
                      disabled={
                        savingEdit || deletingAdId !== null
                      }
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      className="dashboard-btn-delete" onClick={() => deleteOffer(ad)}
                      disabled={
                        savingEdit || deletingAdId !== null
                      }
                    >
                      {deletingAdId === ad.ad_id
                        ? 'Suppression…'
                        : 'Supprimer'}
                    </button>
                  </div>

                  {editingAd === ad.ad_id && (
                    <form
                      className="job-publication-form"
                      onSubmit={saveEditedOffer}
                    >
                      <fieldset disabled={savingEdit}>
                        <legend>Modifier cette annonce</legend>

                        <p>
                          Entreprise : {ad.company?.name}
                        </p>

                        {renderOfferFields(
                          editOffer,
                          changeEditOffer,
                          `edit-${ad.ad_id}`,
                          false
                        )}

                        <button type="submit">
                          {savingEdit
                            ? 'Enregistrement…'
                            : 'Enregistrer les modifications'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingAd(null)
                            setAdsError('')
                          }}
                        >
                          Annuler
                        </button>
                      </fieldset>
                    </form>
                  )}
                </article>
              ))
            )}
          </section>

          <section className={dashboardTab === 'applications'
              ? 'employer-applications dashboard-panel'
              : 'employer-applications dashboard-panel dashboard-panel-hidden'}>
            <h2>
              Candidatures reçues ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <p>Aucune candidature reçue pour le moment.</p>
            ) : (
              <div className="applications-list">
                {applications.map((application) => (
                  <ApplicationManager
                    key={application.application_id}
                    application={application}
                    onUpdated={(updatedApplication) => {
                      setApplications((previous) =>
                        previous.map((item) =>
                          item.application_id ===
                          updatedApplication.application_id
                            ? updatedApplication
                            : item
                        )
                      )
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {companies.length > 0 && (
            <section className={dashboardTab === 'publish'
                ? 'job-publication dashboard-panel'
                : 'job-publication dashboard-panel dashboard-panel-hidden'}>
              <h2>Publier une offre</h2>

              <form
                className="job-publication-form"
                onSubmit={publishOffer}
              >
                <fieldset disabled={savingOffer}>
                  <legend>Informations de l'offre</legend>

                  {renderOfferFields(
                    offer,
                    changeOffer,
                    'offer',
                    true
                  )}

                  <button type="submit">
                    {savingOffer
                      ? 'Publication…'
                      : "Publier l'offre"}
                  </button>
                </fieldset>

                {offerError && (
                  <p role="alert">{offerError}</p>
                )}

                {offerMessage && (
                  <p role="status">{offerMessage}</p>
                )}
              </form>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default CompanyDashboard
