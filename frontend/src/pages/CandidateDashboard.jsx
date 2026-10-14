import { useState } from 'react'
import { Link } from 'react-router-dom'

function CandidateDashboard() {
    const [activeTab, setActiveTab] = useState('applications')
    const [applications, setApplications] = useState([
        {
            id: 1,
            jobTitle: 'Développeur React',
            company: 'Tech Solutions',
            location: 'Marseille',
            date: '2026-10-10',
            status: 'En attente',
        },
        {
            id: 2,
            jobTitle: 'Data Analyst',
            company: 'Data France',
            location: 'Aix-en-Provence',
            date: '2026-10-12',
            status: 'Acceptée',
        },
        {
            id: 3,
            jobTitle: 'Chef de projet IT',
            company: 'Digital Group',
            location: 'Marseille',
            date: '2026-10-13',
            status: 'Refusée',
        },
    ])
    const initialCandidateProfile = {
        firstName: 'Alice',
        lastName: 'Martin',
        birthDate: '2000-05-15',
        email: 'alice@example.com',
        phone: '0612345678',
        city: 'Marseille',
        skills: 'React, JavaScript, HTML, CSS',
        description: 'Développeuse web à la recherche de nouvelles opportunités.',
    }

    const [candidateProfile, setCandidateProfile] = useState(initialCandidateProfile)
    const [profileForm, setProfileForm] = useState(initialCandidateProfile)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileMessage, setProfileMessage] = useState('')
    const [cvFile, setCvFile] = useState(null)
    function handleWithdraw(id) {
        const confirmation = window.confirm(
            'Voulez-vous vraiment retirer cette candidature ?'
        )

        if (confirmation) {
            setApplications(
                applications.filter((application) => application.id !== id)
            )
        }
    }
    function handleProfileChange(event) {
        const { name, value } = event.target

        setProfileForm({
            ...profileForm,
            [name]: value,
        })
    }

    function handleProfileSubmit(event) {
        event.preventDefault()

        setCandidateProfile({ ...profileForm })
        setIsEditingProfile(false)
        setProfileMessage('Profil mis à jour avec succès !')
    }

    function handleCancelProfile() {
        setProfileForm({ ...candidateProfile })
        setIsEditingProfile(false)
        setProfileMessage('')
    }

    function handleCvChange(event) {
        const file = event.target.files[0]

        if (!file) return

        if (file.type !== 'application/pdf') {
            setProfileMessage('Veuillez sélectionner un fichier PDF.')
            event.target.value = ''
            return
        }

        setCvFile(file)
        setProfileMessage('CV sélectionné. Il sera enregistré après intégration du backend.')
    }
    return (
        <main className="candidate-dashboard">
            <h1>Espace candidat</h1>
            <Link to="/" className="dashboard-back-link">
                ← Retour à l'accueil
            </Link>
            <p>Gérez votre profil et suivez vos candidatures.</p>

            <div className="candidate-tabs">
                <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                >
                    Mes candidatures
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                >
                    Mon profil
                </button>
            </div>


            {activeTab === 'applications' && (
                <section className="candidate-section">
                    <h2>Mes candidatures ({applications.length})</h2>

                    {applications.length === 0 && (
                        <p>Vous n'avez aucune candidature pour le moment.</p>
                    )}

                    {applications.map((application) => (
                        <div key={application.id} className="candidate-application">
                            <h3>{application.jobTitle}</h3>

                            <p>Entreprise : {application.company}</p>
                            <p>Ville : {application.location}</p>

                            <p>
                                Date de candidature :{' '}
                                {new Date(`${application.date}T12:00:00`).toLocaleDateString('fr-FR')}
                            </p>

                            <p>
                                Statut :{' '}
                                <span
                                    className={
                                        application.status === 'Acceptée'
                                            ? 'status-accepted'
                                            : application.status === 'Refusée'
                                                ? 'status-rejected'
                                                : 'status-pending'
                                    }
                                >
                                    {application.status}
                                </span>
                            </p>

                            <button
                                type="button"
                                onClick={() => handleWithdraw(application.id)}
                            >
                                Retirer ma candidature
                            </button>
                        </div>
                    ))}
                </section>
            )}



            {activeTab === 'profile' && (
                <section className="candidate-profile">
                    <h2>Mon profil</h2>

                    {profileMessage && (
                        <p className="admin-message" role="status">
                            {profileMessage}
                        </p>
                    )}

                    {!isEditingProfile ? (
                        <div className="candidate-profile-details">
                            <p><strong>Prénom :</strong> {candidateProfile.firstName}</p>
                            <p><strong>Nom :</strong> {candidateProfile.lastName}</p>
                            <p><strong>Date de naissance :</strong> {candidateProfile.birthDate}</p>
                            <p><strong>E-mail :</strong> {candidateProfile.email}</p>
                            <p><strong>Téléphone :</strong> {candidateProfile.phone}</p>
                            <p><strong>Ville :</strong> {candidateProfile.city}</p>
                            <p><strong>Compétences :</strong> {candidateProfile.skills}</p>
                            <p><strong>Présentation :</strong> {candidateProfile.description}</p>
                            <p><strong>CV :</strong> {cvFile ? cvFile.name : 'Aucun CV sélectionné'}</p>

                            <button
                                type="button"
                                onClick={() => {
                                    setProfileForm({ ...candidateProfile })
                                    setIsEditingProfile(true)
                                    setProfileMessage('')
                                }}
                            >
                                Modifier mon profil
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileSubmit} className="candidate-profile-form">
                            {[
                                { name: 'firstName', label: 'Prénom' },
                                { name: 'lastName', label: 'Nom' },
                                { name: 'birthDate', label: 'Date de naissance', type: 'date' },
                                { name: 'email', label: 'E-mail', type: 'email' },
                                { name: 'phone', label: 'Téléphone', type: 'tel' },
                                { name: 'city', label: 'Ville' },
                                { name: 'skills', label: 'Compétences' },
                            ].map((field) => (
                                <div key={field.name} className="candidate-profile-field">
                                    <label htmlFor={`candidate-${field.name}`}>{field.label}</label>
                                    <input
                                        id={`candidate-${field.name}`}
                                        type={field.type || 'text'}
                                        name={field.name}
                                        value={profileForm[field.name]}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                            ))}

                            <div className="candidate-profile-field">
                                <label htmlFor="candidate-description">Présentation personnelle</label>
                                <textarea
                                    id="candidate-description"
                                    name="description"
                                    value={profileForm.description}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="candidate-profile-field">
                                <label htmlFor="candidate-cv">Mon CV (PDF)</label>
                                <input
                                    id="candidate-cv"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleCvChange}
                                />
                                {cvFile && <p>Fichier sélectionné : {cvFile.name}</p>}
                            </div>

                            <button type="submit">Enregistrer les modifications</button>
                            <button type="button" onClick={handleCancelProfile}>
                                Annuler
                            </button>
                        </form>
                    )}
                </section>
            )}

        </main>
    )
}

export default CandidateDashboard
