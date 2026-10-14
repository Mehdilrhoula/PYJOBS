
import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialJobs = [
    {
        id: 1,
        title: 'Développeur React',
        company: 'Tech Solutions',
        location: 'Marseille',
    },
    {
        id: 2,
        title: 'Data Analyst',
        company: 'Data France',
        location: 'Aix-en-Provence',
    },
]

const initialUsers = [
    {
        id: 1,
        name: 'Alice Martin',
        email: 'alice@example.com',
        role: 'candidate',
    },
    {
        id: 2,
        name: 'Tech Solutions',
        email: 'contact@techsolutions.fr',
        role: 'company',
    },
]

const emptyJobForm = {
    title: '',
    company: '',
    location: '',
}

const emptyUserForm = {
    name: '',
    email: '',
    role: 'candidate',
}

function Admin() {
    const [activeTab, setActiveTab] = useState('jobs')
    const [adminMessage, setAdminMessage] = useState('')

    const [jobs, setJobs] = useState(initialJobs)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyJobForm)

    const [users, setUsers] = useState(initialUsers)
    const [editingUserId, setEditingUserId] = useState(null)
    const [userForm, setUserForm] = useState(emptyUserForm)

    function changeTab(tab) {
        setActiveTab(tab)
        setAdminMessage('')
    }

    function handleChange(event) {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value,
        })
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (editingId !== null) {
            setJobs(
                jobs.map((job) =>
                    job.id === editingId
                        ? { ...job, ...form }
                        : job
                )
            )

            setAdminMessage('Annonce modifiée avec succès !')
        } else {
            const newJob = {
                ...form,
                id: crypto.randomUUID(),
            }

            setJobs([...jobs, newJob])
            setAdminMessage('Annonce créée avec succès !')
        }

        setForm({ ...emptyJobForm })
        setEditingId(null)
    }

    function handleEdit(job) {
        setForm({
            title: job.title,
            company: job.company,
            location: job.location,
        })

        setEditingId(job.id)
        setAdminMessage('')
    }

    function handleDelete(id) {
        if (window.confirm('Voulez-vous supprimer cette annonce ?')) {
            setJobs(jobs.filter((job) => job.id !== id))

            if (editingId === id) {
                setEditingId(null)
                setForm({ ...emptyJobForm })
            }

            setAdminMessage('Annonce supprimée avec succès !')
        }
    }

    function cancelJobEdit() {
        setEditingId(null)
        setForm({ ...emptyJobForm })
        setAdminMessage('')
    }

    function handleUserChange(event) {
        const { name, value } = event.target

        setUserForm({
            ...userForm,
            [name]: value,
        })
    }

    function handleUserSubmit(event) {
        event.preventDefault()

        const emailAlreadyExists = users.some(
            (user) =>
                user.email.toLowerCase() === userForm.email.trim().toLowerCase() &&
                user.id !== editingUserId
        )

        if (emailAlreadyExists) {
            setAdminMessage('Cette adresse e-mail est déjà utilisée.')
            return
        }

        const cleanedUser = {
            ...userForm,
            name: userForm.name.trim(),
            email: userForm.email.trim(),
        }

        if (editingUserId !== null) {
            setUsers(
                users.map((user) =>
                    user.id === editingUserId
                        ? { ...user, ...cleanedUser }
                        : user
                )
            )

            setAdminMessage('Utilisateur modifié avec succès !')
        } else {
            const newUser = {
                ...cleanedUser,
                id: crypto.randomUUID(),
            }

            setUsers([...users, newUser])
            setAdminMessage('Utilisateur créé avec succès !')
        }

        setUserForm({ ...emptyUserForm })
        setEditingUserId(null)
    }

    function handleUserEdit(user) {
        setUserForm({
            name: user.name,
            email: user.email,
            role: user.role,
        })

        setEditingUserId(user.id)
        setAdminMessage('')
    }

    function handleUserDelete(id) {
        if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
            setUsers(users.filter((user) => user.id !== id))

            if (editingUserId === id) {
                setEditingUserId(null)
                setUserForm({ ...emptyUserForm })
            }

            setAdminMessage('Utilisateur supprimé avec succès !')
        }
    }

    function cancelUserEdit() {
        setEditingUserId(null)
        setUserForm({ ...emptyUserForm })
        setAdminMessage('')
    }

    return (
        <main className="admin-page">
            <h1>Tableau de bord administrateur</h1>
            <p>Bienvenue dans l'espace de gestion de PYJOBS.</p>
            <Link to="/" className="dashboard-back-link">
                ← Retour à l'accueil
            </Link>
            {adminMessage && (
                <p className="admin-message" role="status">
                    {adminMessage}
                </p>
            )}

            <div className="admin-tabs">
                <button
                    type="button"
                    className={activeTab === 'jobs' ? 'active' : ''}
                    onClick={() => changeTab('jobs')}
                >
                    Gestion des annonces
                </button>

                <button
                    type="button"
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => changeTab('users')}
                >
                    Gestion des utilisateurs
                </button>
            </div>

            {activeTab === 'jobs' && (
                <section className="admin-section">
                    <h2>Gestion des annonces</h2>

                    <form onSubmit={handleSubmit}>
                        <h3>
                            {editingId !== null
                                ? 'Modifier une annonce'
                                : 'Créer une annonce'}
                        </h3>

                        <label htmlFor="job-title">Intitulé du poste</label>
                        <input
                            id="job-title"
                            type="text"
                            name="title"
                            placeholder="Intitulé du poste"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="job-company">Entreprise</label>
                        <input
                            id="job-company"
                            type="text"
                            name="company"
                            placeholder="Entreprise"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="job-location">Ville</label>
                        <input
                            id="job-location"
                            type="text"
                            name="location"
                            placeholder="Ville"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            {editingId !== null ? 'Enregistrer' : 'Créer'}
                        </button>

                        {editingId !== null && (
                            <button type="button" onClick={cancelJobEdit}>
                                Annuler
                            </button>
                        )}
                    </form>

                    <h3>Liste des annonces ({jobs.length})</h3>

                    {jobs.length === 0 && (
                        <p>Aucune annonce disponible.</p>
                    )}

                    {jobs.map((job) => (
                        <div key={job.id} className="admin-job">
                            <h4>{job.title}</h4>
                            <p>
                                {job.company} — {job.location}
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
                        </div>
                    ))}
                </section>
            )}

            {activeTab === 'users' && (
                <section className="admin-section">
                    <h2>Gestion des utilisateurs</h2>

                    <form
                        onSubmit={handleUserSubmit}
                        className="admin-user-form"
                    >
                        <h3>
                            {editingUserId !== null
                                ? 'Modifier un utilisateur'
                                : 'Créer un utilisateur'}
                        </h3>

                        <label htmlFor="user-name">Nom</label>
                        <input
                            id="user-name"
                            type="text"
                            name="name"
                            placeholder="Nom ou entreprise"
                            value={userForm.name}
                            onChange={handleUserChange}
                            required
                        />

                        <label htmlFor="user-email">Adresse e-mail</label>
                        <input
                            id="user-email"
                            type="email"
                            name="email"
                            placeholder="Adresse e-mail"
                            value={userForm.email}
                            onChange={handleUserChange}
                            required
                        />

                        <label htmlFor="user-role">Type de compte</label>
                        <select
                            id="user-role"
                            name="role"
                            value={userForm.role}
                            onChange={handleUserChange}
                        >
                            <option value="candidate">Candidat</option>
                            <option value="company">Entreprise</option>
                        </select>

                        <button type="submit">
                            {editingUserId !== null
                                ? 'Enregistrer les modifications'
                                : 'Créer le compte'}
                        </button>

                        {editingUserId !== null && (
                            <button
                                type="button"
                                onClick={cancelUserEdit}
                            >
                                Annuler
                            </button>
                        )}
                    </form>

                    <h3>Liste des utilisateurs ({users.length})</h3>

                    {users.length === 0 && (
                        <p>Aucun utilisateur disponible.</p>
                    )}

                    {users.map((user) => (
                        <div key={user.id} className="admin-user">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                            <p>
                                Type : {user.role === 'candidate'
                                    ? 'Candidat'
                                    : 'Entreprise'}
                            </p>

                            <button
                                type="button"
                                onClick={() => handleUserEdit(user)}
                            >
                                Modifier
                            </button>

                            <button
                                type="button"
                                onClick={() => handleUserDelete(user.id)}
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                </section>
            )}
        </main>
    )
}

export default Admin
