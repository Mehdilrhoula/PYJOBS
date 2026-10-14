
function JobPublicationForm({
  onClose,
  jobPublicationMessage,
  setJobPublicationMessage,
}) {
  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const jobData = Object.fromEntries(formData.entries())

    if (
      jobData.salaryMin !== '' &&
      jobData.salaryMax !== '' &&
      Number(jobData.salaryMin) > Number(jobData.salaryMax)
    ) {
      setJobPublicationMessage(
        'Erreur : le salaire minimum ne peut pas dépasser le salaire maximum.'
      )
      return
    }

    console.log('Nouvelle offre :', jobData)

    setJobPublicationMessage(
      "Votre offre est prête ! Elle pourra être publiée après la connexion au backend."
    )
  }

  return (
    <section className="job-publication">
      <h2>Publier une offre d'emploi</h2>

      <p>
        Complétez les informations ci-dessous pour créer votre annonce.
      </p>

      <form className="job-publication-form" onSubmit={handleSubmit}>
        <label htmlFor="job-title">Intitulé du poste</label>
        <input
          type="text"
          id="job-title"
          name="title"
          placeholder="Ex : Développeur React"
          required
        />

        <label htmlFor="job-company">Nom de l'entreprise</label>
        <input
          type="text"
          id="job-company"
          name="company"
          placeholder="Ex : PYJOBS"
          required
        />

        <label htmlFor="job-location">Lieu du poste</label>
        <input
          type="text"
          id="job-location"
          name="location"
          placeholder="Ex : Marseille"
          required
        />

        <label htmlFor="job-category">Catégorie</label>
        <select
          id="job-category"
          name="category"
          required
          defaultValue=""
        >
          <option value="" disabled>Choisir une catégorie</option>
          <option value="Informatique">Informatique</option>
          <option value="Marketing">Marketing</option>
          <option value="Commercial">Commercial</option>
          <option value="Ressources humaines">Ressources humaines</option>
          <option value="Finance">Finance</option>
          <option value="Autre">Autre</option>
        </select>

        <label htmlFor="job-contract">Type de contrat</label>
        <select
          id="job-contract"
          name="contractType"
          required
          defaultValue=""
        >
          <option value="" disabled>Choisir un contrat</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Alternance">Alternance</option>
          <option value="Stage">Stage</option>
          <option value="Freelance">Freelance</option>
        </select>

        <label htmlFor="job-salary-min">
          Salaire annuel minimum (€ brut)
        </label>
        <input
          type="number"
          id="job-salary-min"
          name="salaryMin"
          placeholder="Ex : 30000"
          min="0"
          step="1"
        />

        <label htmlFor="job-salary-max">
          Salaire annuel maximum (€ brut)
        </label>
        <input
          type="number"
          id="job-salary-max"
          name="salaryMax"
          placeholder="Ex : 40000"
          min="0"
          step="1"
        />

        <label htmlFor="job-work-mode">Mode de travail</label>
        <select
          id="job-work-mode"
          name="workMode"
          required
          defaultValue=""
        >
          <option value="" disabled>Choisir un mode de travail</option>
          <option value="Sur site">Sur site</option>
          <option value="Hybride">Hybride</option>
          <option value="Télétravail">Télétravail</option>
        </select>

        <label htmlFor="job-working-time">Temps de travail</label>
        <select
          id="job-working-time"
          name="workingTime"
          required
          defaultValue=""
        >
          <option value="" disabled>Choisir un temps de travail</option>
          <option value="Temps plein">Temps plein</option>
          <option value="Temps partiel">Temps partiel</option>
        </select>

        <label htmlFor="job-experience">Expérience demandée</label>
        <select
          id="job-experience"
          name="experienceLevel"
          required
          defaultValue=""
        >
          <option value="" disabled>Choisir un niveau</option>
          <option value="Débutant">Débutant</option>
          <option value="1 à 3 ans">1 à 3 ans</option>
          <option value="3 à 5 ans">3 à 5 ans</option>
          <option value="5 ans et plus">5 ans et plus</option>
        </select>

        <label htmlFor="job-description">Description du poste</label>
        <textarea
          id="job-description"
          name="description"
          rows="7"
          placeholder="Présentez les missions, les compétences recherchées et les avantages du poste..."
          maxLength={5000}
          required
        />

        <button type="submit" className="publish-job-button">
          Publier l'offre
        </button>

        {jobPublicationMessage && (
          <p className="job-publication-message" role="status">
            {jobPublicationMessage}
          </p>
        )}
      </form>

      <button type="button" onClick={onClose}>
        Fermer le formulaire
      </button>
    </section>
  )
}

export default JobPublicationForm
