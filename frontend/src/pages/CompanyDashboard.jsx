
import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialJobs = [
    {
        id: 1,
        title: 'Développeur React',
        location: 'Marseille',
        description: 'Nous recherchons un développeur React.',
    },
    {
        id: 2,
        title: 'Data Analyst',
        location: 'Aix-en-Provence',
        description: 'Analyse et visualisation de données.',
    },
]

const initialApplications = [
    {
        id: 1,
        jobId: 1,
        name: 'Alice Martin',
        email: 'alice@example.com',
        status: 'En attente',
    },
    {
        id: 2,
        jobId: 1,
        name: 'Karim Benali',
        email: 'karim@example.com',
        status: 'En attente',
    },
    {
        id: 3,
        jobId: 2,
        name: 'Sophie Bernard',
        email: 'sophie@example.com',
        status: 'En attente',
    },
]

const initialCompanyProfile = {
    companyName: 'Tech Solutions',
    sector: 'Informatique',
    description: 'Entreprise spécialisée dans les solutions informatiques.',
    address: '10 rue de la République',
    city: 'Marseille',
    website: 'https://www.example.com',
    phone: '0400000000',
    email: 'contact@techsolutions.fr',
    contactName: 'Jean Dupont',
}

const emptyJobForm = {
    title: '',
    location: '',
    description: '',
}

const profileFields = [
    { name: 'companyName', label: "Nom de l'entreprise" },
    { name: 'sector', label: "Secteur d'activité" },
    { name: 'address', label: 'Adresse' },
    { name: 'city', label: 'Ville' },
    { name: 'website', label: 'Site web', type: 'url' },
    { name: 'phone', label: 'Téléphone', type: 'tel' },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'contactName', label: 'Nom du responsable' },
]

function CompanyDashboard() {
    const [jobs, setJobs] = useState(initialJobs)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyJobForm)

    const [selectedJobId, setSelectedJobId] = useState(null)
    const [applications, setApplications] = useState(initialApplications)

    const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile)
    const [profileForm, setProfileForm] = useState(initialCompanyProfile)
    const [isEditingProfile, setIsEditingProfile] = useState(false)

    const [jobMessage, setJobMessage] = useState('')
    const [profileMessage, setProfileMessage] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }))
    }

    function handleEdit(job) {
        setEditingId(job.id)

        setForm({
            title: job.title,
            location: job.location,
            description: job.description,
        })

        setJobMessage('')
    }

    function handleSubmit(event) {
        event.preventDefault()

        setJobs((previousJobs) =>
            previousJobs.map((job) =>
                job.id === editingId
                    ? { ...job, ...form }
                    : job
            )
        )

        setEditingId(null)
        setForm({ ...emptyJobForm })
        setJobMessage('Annonce modifiée avec succès !')
    }

    function handleDelete(id) {
        if (!window.confirm('Voulez-vous supprimer cette annonce ?')) {
            return
        }

        setJobs((previousJobs) =>
            previousJobs.filter((job) => job.id !== id)
        )

        setApplications((previousApplications) =>
            previousApplications.filter(
                (application) => application.jobId !== id
            )
        )

        if (editingId === id) {
            setEditingId(null)
            setForm({ ...emptyJobForm })
        }

        if (selectedJobId === id) {
            setSelectedJobId(null)
        }

        setJobMessage('Annonce supprimée avec succès !')
    }

    function cancelJobEdit() {
        setEditingId(null)
        setForm({ ...emptyJobForm })
    }

    function handleApplicationStatus(applicationId, newStatus) {
        setApplications((previousApplications) =>
            previousApplications.map((application) =>
                application.id === applicationId
                    ? { ...application, status: newStatus }
                    : application
            )
        )
    }

    function startProfileEdit() {
        setProfileForm({ ...companyProfile })
        setIsEditingProfile(true)
        setProfileMessage('')
    }

    function handleProfileChange(event) {
        const { name, value } = event.target

        setProfileForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }))
    }

    function handleProfileSubmit(event) {
        event.preventDefault()

        setCompanyProfile({ ...profileForm })
        setIsEditingProfile(false)
        setProfileMessage('Profil mis à jour avec succès !')
    }

    function cancelProfileEdit() {
        setProfileForm({ ...companyProfile })
        setIsEditingProfile(false)
        setProfileMessage('')
    }

    return (
        <main className="company-dashboard">
            <h1>Espace employeur</h1>
            <Link to="/" className="dashboard-back-link">
                ← Retour à l'accueil
            </Link>
            <p>Gérez vos annonces et consultez les candidatures reçues.</p>

            <section className="company-profile">
                <h2>Mon profil entreprise</h2>

                {profileMessage && (
                    <p className="admin-message" role="status">
                        {profileMessage}
                    </p>
                )}

                {!isEditingProfile ? (
                    <div className="company-profile-details">
                        <p>
                            <strong>Entreprise :</strong> {companyProfile.companyName}
                        </p>
                        <p>
                            <strong>Secteur :</strong> {companyProfile.sector}
                        </p>
                        <p>
                            <strong>Description :</strong> {companyProfile.description}
                        </p>
                        <p>
                            <strong>Adresse :</strong> {companyProfile.address}
                        </p>
                        <p>
                            <strong>Ville :</strong> {companyProfile.city}
                        </p>
                        <p>
                            <strong>Site web :</strong> {companyProfile.website}
                        </p>
                        <p>
                            <strong>Téléphone :</strong> {companyProfile.phone}
                        </p>
                        <p>
                            <strong>E-mail :</strong> {companyProfile.email}
                        </p>
                        <p>
                            <strong>Responsable :</strong> {companyProfile.contactName}
                        </p>

                        <button type="button" onClick={startProfileEdit}>
                            Modifier mon profil
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleProfileSubmit}
                        className="company-profile-form"
                    >
                        {profileFields.map((field) => (
                            <div
                                key={field.name}
                                className="company-profile-field"
                            >
                                <label htmlFor={`profile-${field.name}`}>
                                    {field.label}
                                </label>

                                <input
                                    id={`profile-${field.name}`}
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={profileForm[field.name]}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </div>
                        ))}

                        <div className="company-profile-field">
                            <label htmlFor="company-description">
                                Description de l'entreprise
                            </label>

                            <textarea
                                id="company-description"
                                name="description"
                                value={profileForm.description}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>

                        <button type="submit">
                            Enregistrer les modifications
                        </button>

                        <button
                            type="button"
                            onClick={cancelProfileEdit}
                        >
                            Annuler
                        </button>
                    </form>
                )}
            </section>

            <section>
                <h2>Mes annonces ({jobs.length})</h2>

                {jobMessage && (
                    <p className="admin-message" role="status">
                        {jobMessage}
                    </p>
                )}

                {jobs.length === 0 && (
                    <p>Vous n'avez aucune annonce pour le moment.</p>
                )}

                {jobs.map((job) => {
                    const jobApplications = applications.filter(
                        (application) => application.jobId === job.id
                    )

                    return (
                        <div key={job.id} className="company-job">
                            <h3>{job.title}</h3>
                            <p>Ville : {job.location}</p>
                            <p>{job.description}</p>

                            <p>
                                Candidatures reçues : {jobApplications.length}
                            </p>

                            <button
                                type="button"
                                onClick={() => handleEdit(job)}
                            >
                                Modifier
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(job.id)}
                            >
                                Supprimer
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedJobId(
                                        selectedJobId === job.id ? null : job.id
                                    )
                                }
                            >
                                {selectedJobId === job.id
                                    ? 'Masquer les candidatures'
                                    : 'Voir les candidatures'}
                            </button>

                            {selectedJobId === job.id && (
                                <div className="company-applications">
                                    <h4>Candidatures reçues</h4>

                                    {jobApplications.length === 0 && (
                                        <p>Aucune candidature pour cette annonce.</p>
                                    )}

                                    {jobApplications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="company-application"
                                        >
                                            <p>
                                                <strong>{application.name}</strong>
                                            </p>

                                            <p>{application.email}</p>
                                            <p>Statut : {application.status}</p>

                                            <label htmlFor={`status-${application.id}`}>
                                                Modifier le statut
                                            </label>

                                            <select
                                                id={`status-${application.id}`}
                                                value={application.status}
                                                onChange={(event) =>
                                                    handleApplicationStatus(
                                                        application.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="En attente">
                                                    En attente
                                                </option>
                                                <option value="Acceptée">
                                                    Acceptée
                                                </option>
                                                <option value="Refusée">
                                                    Refusée
                                                </option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </section>

            {editingId !== null && (
                <form
                    onSubmit={handleSubmit}
                    className="company-edit-form"
                >
                    <h2>Modifier l'annonce</h2>

                    <label htmlFor="company-job-title">
                        Intitulé du poste
                    </label>
                    <input
                        id="company-job-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="company-job-location">
                        Ville
                    </label>
                    <input
                        id="company-job-location"
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="company-job-description">
                        Description
                    </label>
                    <textarea
                        id="company-job-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Enregistrer
                    </button>

                    <button
                        type="button"
                        onClick={cancelJobEdit}
                    >
                        Annuler
                    </button>
                </form>
            )}
        </main>
    )
}

export default CompanyDashboard
