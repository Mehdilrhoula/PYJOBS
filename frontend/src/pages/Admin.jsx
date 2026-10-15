
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EMPTY_USER = {
  name: "",
  email: "",
  role: "candidate",
  password: "",
  is_active: true,
};

const EMPTY_AD = {
  title: "",
  company_id: "",
  category: "",
  city: "",
  contract_type: "CDI",
  salary_min: "",
  salary_max: "",
  work_mode: "Sur site",
  work_time: "Temps plein",
  experience_level: "Débutant",
  description: "",
};

const STATUS_LABELS = {
  pending: "En attente",
  accepted: "Retenue",
  rejected: "Refusée",
};

function errorMessage(data) {
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([field, value]) => {
        const message = Array.isArray(value)
          ? value.join(", ")
          : String(value);

        return `${field} : ${message}`;
      })
      .join(" | ");
  }

  return "Une erreur est survenue.";
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  // PYJOBS-ADMIN-V2
  const [activeTab, setActiveTab] = useState("candidates");
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [adFormOpen, setAdFormOpen] = useState(false);
  const [companyFormOpen, setCompanyFormOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);

  const [userForm, setUserForm] = useState(EMPTY_USER);
  const [editingUserId, setEditingUserId] = useState(null);

  const [adForm, setAdForm] = useState(EMPTY_AD);
  const [editingAdId, setEditingAdId] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [companyOwnerId, setCompanyOwnerId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function apiRequest(url, options = {}, csrfToken = null) {
    const headers = {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    };

    const response = await fetch(url, {
      credentials: "same-origin",
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data =
      response.status === 204
        ? null
        : await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(errorMessage(data));
    }

    return data;
  }

  async function loadData() {
    const [userData, adData, companyData, applicationData] =
      await Promise.all([
        apiRequest("/api/admin/users/"),
        apiRequest("/api/ads/"),
        apiRequest("/api/admin/companies/"),
        apiRequest("/api/applications/"),
      ]);

    setUsers(userData.results ?? userData);
    setAds(adData.results ?? adData);
    setCompanies(companyData.results ?? companyData);
    setApplications(applicationData.results ?? applicationData);
  }

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const currentSession = await apiRequest("/api/session/");

        if (cancelled) return;

        setSession(currentSession);

        if (
          !currentSession.authenticated ||
          currentSession.user?.role !== "admin"
        ) {
          return;
        }

        await loadData();
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  async function execute(action, successMessage) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await action();
      await loadData();
      setMessage(successMessage);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function csrf() {
    return session?.csrfToken;
  }


  function scrollToAdminForm() {
    window.setTimeout(() => {
      const form = document.querySelector(
        ".admin-section .admin-form"
      );

      if (form) {
        form.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }, 100);
      }
    });
  }

  function resetUserForm() {
    setUserForm({ ...EMPTY_USER });
    setEditingUserId(null);
  }

  function editUser(user) {
    if (user.role === "admin") {
      setError("Les comptes administrateurs ne sont pas modifiables ici.");
      return;
    }

    setUserForm({
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role,
      password: "",
      is_active: user.is_active,
    });

    setEditingUserId(user.id);
    setUserFormOpen(true);
    setError("");

    scrollToAdminForm();
  }

  function saveUser(event) {
    event.preventDefault();

    const editing = editingUserId !== null;
    const payload = { ...userForm };

    if (editing && !payload.password) {
      delete payload.password;
    }

    execute(async () => {
      await apiRequest(
        editing
          ? `/api/admin/users/${editingUserId}/`
          : "/api/admin/users/",
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
        csrf()
      );

      resetUserForm();
    }, editing ? "Utilisateur modifié." : "Utilisateur créé.");
  }

  function deleteUser(user) {
    if (
      !window.confirm(
        `Supprimer définitivement le compte de ${user.name} (${user.email}) ?`
      )
    ) {
      return;
    }

    execute(
      () =>
        apiRequest(
          `/api/admin/users/${user.id}/`,
          { method: "DELETE" },
          csrf()
        ),
      "Compte supprimé."
    );
  }

  function toggleUser(user) {
    execute(
      () =>
        apiRequest(
          `/api/admin/users/${user.id}/`,
          {
            method: "PATCH",
            body: JSON.stringify({
              is_active: !user.is_active,
            }),
          },
          csrf()
        ),
      user.is_active ? "Compte désactivé." : "Compte réactivé."
    );
  }

  function resetAdForm() {
    setAdForm({ ...EMPTY_AD });
    setEditingAdId(null);
  }

  function editAd(ad) {
    setAdForm({
      title: ad.title ?? "",
      company_id: String(ad.company?.company_id ?? ""),
      category: ad.category ?? "",
      city: ad.city ?? "",
      contract_type: ad.contract_type ?? "",
      salary_min: ad.salary_min ?? "",
      salary_max: ad.salary_max ?? "",
      work_mode: ad.work_mode ?? "",
      work_time: ad.work_time ?? "",
      experience_level: ad.experience_level ?? "",
      description: ad.description ?? "",
    });

    setEditingAdId(ad.ad_id);
    setAdFormOpen(true);
    setError("");
    scrollToAdminForm();
  }

  function saveAd(event) {
    event.preventDefault();

    const editing = editingAdId !== null;

    const payload = {
      ...adForm,
      company_id: Number(adForm.company_id),
      salary_min:
        adForm.salary_min === "" ? null : Number(adForm.salary_min),
      salary_max:
        adForm.salary_max === "" ? null : Number(adForm.salary_max),
    };

    execute(async () => {
      await apiRequest(
        editing ? `/api/ads/${editingAdId}/` : "/api/ads/create/",
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
        csrf()
      );

      resetAdForm();
    }, editing ? "Annonce modifiée." : "Annonce créée.");
  }

  function deleteAd(ad) {
    if (
      !window.confirm(
        `Supprimer définitivement l'annonce "${ad.title}" ?\n\n` +
        "Attention : les candidatures liées peuvent également être supprimées."
      )
    ) {
      return;
    }

    execute(
      () =>
        apiRequest(
          `/api/ads/${ad.ad_id}/`,
          { method: "DELETE" },
          csrf()
        ),
      "Annonce supprimée."
    );
  }


  function createAdminCompany(event) {
    event.preventDefault();

    execute(async () => {
      await apiRequest(
        "/api/admin/companies/create/",
        {
          method: "POST",
          body: JSON.stringify({
            name: companyName.trim(),
            owner_id: Number(companyOwnerId),
          }),
        },
        csrf()
      );

      setCompanyName("");
      setCompanyOwnerId("");
    }, "Entreprise créée.");
  }

  function deleteApplication(application) {
    if (
      !window.confirm(
        `Supprimer définitivement la candidature de ${application.person} ` +
        `pour "${application.ad}" ?`
      )
    ) {
      return;
    }

    execute(
      () =>
        apiRequest(
          `/api/admin/applications/${application.application_id}/`,
          { method: "DELETE" },
          csrf()
        ),
      "Candidature supprimée."
    );
  }

  function renameCompany(company) {
    const name = window.prompt(
      "Nouveau nom de l'entreprise :",
      company.name
    );

    if (name === null || !name.trim()) return;

    execute(
      () =>
        apiRequest(
          `/api/companies/${company.company_id}/`,
          {
            method: "PATCH",
            body: JSON.stringify({ name: name.trim() }),
          },
          csrf()
        ),
      "Entreprise renommée."
    );
  }

  function deleteCompany(company) {
    if (
      !window.confirm(
        `Supprimer l'entreprise "${company.name}" ?\n` +
        "La suppression sera refusée si elle possède encore des annonces."
      )
    ) {
      return;
    }

    execute(
      () =>
        apiRequest(
          `/api/admin/companies/${company.company_id}/`,
          { method: "DELETE" },
          csrf()
        ),
      "Entreprise supprimée."
    );
  }

  function updateApplicationStatus(application, newStatus) {
    execute(
      () =>
        apiRequest(
          `/api/applications/${application.application_id}/status/`,
          {
            method: "PATCH",
            body: JSON.stringify({ status: newStatus }),
          },
          csrf()
        ),
      "Statut de candidature modifié."
    );
  }

  if (loading) {
    return (
      <main className="admin-page">
        <p>Chargement de l'administration...</p>
      </main>
    );
  }

  if (!session?.authenticated) {
    return (
      <main className="admin-page">
        <h1>Connexion nécessaire</h1>
        <p>Connecte-toi pour accéder à cette page.</p>
        <Link to="/login">Se connecter</Link>
      </main>
    );
  }

  if (session.user?.role !== "admin") {
    return (
      <main className="admin-page">
        <h1>Accès refusé</h1>
        <p>Cette page est réservée aux administrateurs.</p>
        <Link to="/">Retour à l'accueil</Link>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Administration PYJOBS</h1>
        <p>Gestion de la plateforme</p>
        <Link to="/jobs">Retour aux annonces</Link>
      </div>

      <div className="admin-overview">
          <div className="admin-stat"><span>Candidats</span><strong>{users.filter(u => u.role === "candidate").length}</strong></div>
          <div className="admin-stat"><span>Employeurs</span><strong>{users.filter(u => u.role === "employer").length}</strong></div>
          <div className="admin-stat"><span>Annonces</span><strong>{ads.length}</strong></div>
          <div className="admin-stat"><span>Candidatures</span><strong>{applications.length}</strong></div>
        </div>
        <div className="admin-tabs">
        <button className={activeTab === "applications" ? "admin-tab-active" : ""} className={activeTab === "companies" ? "admin-tab-active" : ""} className={activeTab === "ads" ? "admin-tab-active" : ""} className={activeTab === "employers" ? "admin-tab-active" : ""} className={activeTab === "candidates" ? "admin-tab-active" : ""}
          type="button"
          onClick={() => { setActiveTab("candidates"); resetUserForm(); setUserFormOpen(false); }}
        >
          Candidats ({users.filter(u => u.role === "candidate").length})
        </button>

        <button type="button"
          onClick={() => { setActiveTab("employers"); resetUserForm(); setUserFormOpen(false); }}>
          Employeurs ({users.filter(u => u.role === "employer").length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ads")}
        >
          Annonces ({ads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("companies")}
        >
          Entreprises ({companies.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
        >
          Candidatures ({applications.length})
        </button>
      </div>

      {error && <p role="alert" className="error-message">{error}</p>}
      {message && <p role="status">{message}</p>}

      {(activeTab === "candidates" || activeTab === "employers") && (
        <section className="admin-section">
          <div className="admin-section-top">
          <div>
            <h2>{activeTab === "candidates" ? "Gestion des candidats" : "Gestion des employeurs"}</h2>
            <p>Gérez les comptes et leurs accès à PYJOBS.</p>
          </div>
          <button type="button" onClick={() => {
            resetUserForm();
            setUserForm({ ...EMPTY_USER, role: activeTab === "candidates" ? "candidate" : "employer" });
            setUserFormOpen(!userFormOpen);
          }}>
            {userFormOpen ? "Fermer" : "+ Créer un compte"}
          </button>
        </div>
        {userFormOpen && <div className="admin-editor">
          <h2>
            {editingUserId !== null
              ? "Modifier un utilisateur"
              : "Créer un utilisateur"}
          </h2>

          <form onSubmit={saveUser} className="admin-form">
            <label>
              Nom
              <input
                required
                value={userForm.name}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    name: event.target.value,
                  })
                }
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                required
                value={userForm.email}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    email: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Rôle
              <select
                value={userForm.role}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    role: event.target.value,
                  })
                }
              >
                <option value="candidate">Candidat</option>
                <option value="employer">Employeur</option>
              </select>
            </label>

            <label>
              {editingUserId !== null
                ? "Nouveau mot de passe (facultatif)"
                : "Mot de passe"}
              <input
                type="password"
                required={editingUserId === null}
                value={userForm.password}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    password: event.target.value,
                  })
                }
              />
            </label>

            <label>
              <input
                type="checkbox"
                checked={userForm.is_active}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    is_active: event.target.checked,
                  })
                }
              />
              Compte actif
            </label>

            <button type="submit" disabled={busy}>
              {editingUserId !== null
                ? "Enregistrer les modifications"
                : "Créer le compte"}
            </button>

            {editingUserId !== null && (
              <button type="button" onClick={resetUserForm}>
                Annuler
              </button>
            )}
          </form>

          </div>}
          <h2>{activeTab === "candidates" ? "Liste des candidats" : "Liste des employeurs"}</h2>

          <div className="admin-list">
            {users.filter(user => user.role === (activeTab === "candidates" ? "candidate" : "employer")).map((user) => (
              <article key={user.id} className="admin-card">
                <h3>{user.name || "Sans nom"}</h3>
                <p>{user.email}</p>
                <p>Rôle : {user.role}</p>
                <p>
                  Statut : {user.is_active ? "Actif" : "Désactivé"}
                </p>

                {user.role !== "admin" && (
                  <div className="admin-actions">
                    <button className="admin-btn-edit"
                      disabled={busy}
                      onClick={() => editUser(user)}
                    >
                      Modifier
                    </button>

                    <button className="admin-btn-toggle"
                      disabled={busy}
                      onClick={() => toggleUser(user)}
                    >
                      {user.is_active ? "Désactiver" : "Réactiver"}
                    </button>

                    <button className="admin-btn-delete"
                      disabled={busy}
                      onClick={() => deleteUser(user)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "ads" && (
        <section className="admin-section">
          <div className="admin-section-top">
          <h2>Gestion des annonces</h2>
          <button type="button" onClick={() => {
            resetAdForm();
            setAdFormOpen(!adFormOpen);
          }}>
            {adFormOpen ? "Fermer" : "+ Créer une annonce"}
          </button>
        </div>
        {adFormOpen && <div className="admin-editor">
          <h2>
            {editingAdId !== null
              ? "Modifier une annonce"
              : "Créer une annonce"}
          </h2>

          <form onSubmit={saveAd} className="admin-form">
            <label>
              Titre
              <input
                required
                value={adForm.title}
                onChange={(event) =>
                  setAdForm({ ...adForm, title: event.target.value })
                }
              />
            </label>

            <label>
              Entreprise
              <select
                required
                value={adForm.company_id}
                onChange={(event) =>
                  setAdForm({
                    ...adForm,
                    company_id: event.target.value,
                  })
                }
              >
                <option value="">Choisir une entreprise</option>
                {companies.map((company) => (
                  <option
                    key={company.company_id}
                    value={company.company_id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </label>

            {[
              ["category", "Catégorie"],
              ["city", "Ville"],
              ["contract_type", "Type de contrat"],
              ["work_mode", "Mode de travail"],
              ["work_time", "Temps de travail"],
              ["experience_level", "Expérience"],
            ].map(([field, label]) => (
              <label key={field}>
                {label}
                <input
                  required
                  value={adForm[field]}
                  onChange={(event) =>
                    setAdForm({
                      ...adForm,
                      [field]: event.target.value,
                    })
                  }
                />
              </label>
            ))}

            <label>
              Salaire minimum
              <input
                type="number"
                min="0"
                value={adForm.salary_min}
                onChange={(event) =>
                  setAdForm({
                    ...adForm,
                    salary_min: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Salaire maximum
              <input
                type="number"
                min="0"
                value={adForm.salary_max}
                onChange={(event) =>
                  setAdForm({
                    ...adForm,
                    salary_max: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Description
              <textarea
                required
                rows="6"
                value={adForm.description}
                onChange={(event) =>
                  setAdForm({
                    ...adForm,
                    description: event.target.value,
                  })
                }
              />
            </label>

            <button disabled={busy} type="submit">
              {editingAdId !== null
                ? "Enregistrer l'annonce"
                : "Créer l'annonce"}
            </button>

            {editingAdId !== null && (
              <button type="button" onClick={resetAdForm}>
                Annuler
              </button>
            )}
          </form>

          </div>}
          <h2>Liste des annonces</h2>

          <div className="admin-list">
            {ads.map((ad) => (
              <article key={ad.ad_id} className="admin-card">
                <h3>{ad.title}</h3>
                <p>Entreprise : {ad.company?.name}</p>
                <p>Ville : {ad.city}</p>
                <p>Contrat : {ad.contract_type}</p>

                <div className="admin-actions">
                  <button className="admin-btn-edit"
                    disabled={busy}
                    onClick={() => editAd(ad)}
                  >
                    Modifier
                  </button>

                  <button className="admin-btn-delete"
                    disabled={busy}
                    onClick={() => deleteAd(ad)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "companies" && (
        <section className="admin-section">

          <div className="admin-section-top">
          <h2>Gestion des entreprises</h2>
          <button type="button" onClick={() => setCompanyFormOpen(!companyFormOpen)}>
            {companyFormOpen ? "Fermer" : "+ Créer une entreprise"}
          </button>
        </div>
        {companyFormOpen && <div className="admin-editor">
          <h2>Créer une entreprise</h2>

          <form onSubmit={createAdminCompany} className="admin-form">
            <label>
              Nom de l'entreprise
              <input
                required
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
              />
            </label>

            <label>
              Employeur propriétaire
              <select
                required
                value={companyOwnerId}
                onChange={(event) =>
                  setCompanyOwnerId(event.target.value)
                }
              >
                <option value="">Choisir un employeur</option>
                {users
                  .filter(
                    (user) =>
                      user.role === "employer" && user.is_active
                  )
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} — {user.email}
                    </option>
                  ))}
              </select>
            </label>

            <button type="submit" disabled={busy}>
              Créer l'entreprise
            </button>
          </form>

          </div>}
          <h2>Entreprises ({companies.length})</h2>

          <div className="admin-list">
            {companies.map((company) => (
              <article
                key={company.company_id}
                className="admin-card"
              >
                <h3>{company.name}</h3>
                <p>Identifiant : {company.company_id}</p>

                <div className="admin-actions">
                  <button className="admin-btn-edit"
                    disabled={busy}
                    onClick={() => renameCompany(company)}
                  >
                    Renommer
                  </button>

                  <button className="admin-btn-delete"
                    disabled={busy}
                    onClick={() => deleteCompany(company)}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "applications" && (
        <section className="admin-section">
          <h2>Candidatures ({applications.length})</h2>

          <div className="admin-list">
            {applications.map((application) => (
              <article
                key={application.application_id}
                className="admin-card"
              >
                <h3>{application.ad}</h3>
                <p>Candidat : {application.person}</p>
                <p>Date : {application.application_date}</p>
                <p>Message : {application.message}</p>

                <button className="admin-btn-delete"
                  type="button"
                  disabled={busy}
                  onClick={() => deleteApplication(application)}
                >
                  Supprimer la candidature
                </button>

                <label>
                  Statut
                  <select
                    disabled={busy}
                    value={application.status}
                    onChange={(event) =>
                      updateApplicationStatus(
                        application,
                        event.target.value
                      )
                    }
                  >
                    {Object.entries(STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
