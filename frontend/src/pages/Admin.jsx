
import { useState } from 'react'

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
function Admin() {
    const [activeTab, setActiveTab] = useState('jobs')
    const [jobs, setJobs] = useState(initialJobs)
    const [editingId, setEditingId] = useState(null)

    const [form, setForm] = useState({
        title: '',
        company: '',
        location: '',
    })
    const [users, setUsers] = useState(initialUsers)
    const [editingUserId, setEditingUserId] = useState(null)

    const emptyUserForm = {
        name: '',
        email: '',
        role: 'candidate',
    }

    const [userForm, setUserForm] = useState(emptyUserForm)
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
                    job.id === editingId ? { ...form, id: editingId } : job
                )
            )
        } else {
            const newJob = {
                ...form,
                id: crypto.randomUUID(),
            }

            setJobs([...jobs, newJob])
        }

        setForm({ title: '', company: '', location: '' })
        setEditingId(null)
    }

    function handleEdit(job) {
        setForm({
            title: job.title,
            company: job.company,
            location: job.location,
        })

        setEditingId(job.id)
    }

    function handleDelete(id) {
        if (window.confirm('Voulez-vous supprimer cette annonce ?')) {
            setJobs(jobs.filter((job) => job.id !== id))
        }
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

        if (editingUserId !== null) {
            setUsers(
                users.map((user) =>
                    user.id === editingUserId
                        ? { ...user, ...userForm }
                        : user
                )
            )
        } else {
            const newUser = {
                ...userForm,
                id: crypto.randomUUID(),
            }

            setUsers([...users, newUser])
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
    }

    function handleUserDelete(id) {
        if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
            setUsers(users.filter((user) => user.id !== id))
        }
    }

    function cancelUserEdit() {
        setEditingUserId(null)
        setUserForm({ ...emptyUserForm })
    }
    return (
        <main className="admin-page">
            <h1>Tableau de bord administrateur</h1>
            <p>Bienvenue dans l'espace de gestion de PYJOBS.</p>

            <div className="admin-tabs">
                <button
                    type="button"
                    className={activeTab === 'jobs' ? 'active' : ''}
                    onClick={() => setActiveTab('jobs')}
                >
                    Gestion des annonces
                </button>

                <button
                    type="button"
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Gestion des utilisateurs
                </button>
            </div>

            {activeTab === 'jobs' && (
                <section className="admin-section">
                    <h2>Gestion des annonces</h2>

                    <form onSubmit={handleSubmit}>
                        <h3>{editingId !== null ? 'Modifier une annonce' : 'Créer une annonce'}</h3>

                        <input
                            type="text"
                            name="title"
                            placeholder="Intitulé du poste"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="company"
                            placeholder="Entreprise"
                            value={form.company}
                            onChange={handleChange}
                            required
                        />

                        <input
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
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null)
                                    setForm({ title: '', company: '', location: '' })
                                }}
                            >
                                Annuler
                            </button>
                        )}
                    </form>

                    <h3>Liste des annonces</h3>

                    {jobs.map((job) => (
                        <div key={job.id} className="admin-job">
                            <h4>{job.title}</h4>
                            <p>{job.company} — {job.location}</p>

                            <button type="button" onClick={() => handleEdit(job)}>
                                Modifier
                            </button>

                            <button type="button" onClick={() => handleDelete(job.id)}>
                                Supprimer
                            </button>
                        </div>
                    ))}
                </section>
            )}


            {activeTab === 'users' && (
                <section className="admin-section">
                    <h2>Gestion des utilisateurs</h2>

                    <form onSubmit={handleUserSubmit} className="admin-user-form">
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
                            <button type="button" onClick={cancelUserEdit}>
                                Annuler
                            </button>
                        )}
                    </form>

                    <h3>Liste des utilisateurs ({users.length})</h3>

                    {users.map((user) => (
                        <div key={user.id} className="admin-user">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                            <p>
                                Type : {user.role === 'candidate' ? 'Candidat' : 'Entreprise'}
                            </p>

                            <button type="button" onClick={() => handleUserEdit(user)}>
                                Modifier
                            </button>

                            <button type="button" onClick={() => handleUserDelete(user.id)}>
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
