
function JobFilters({
  search,
  setSearch,
  category,
  setCategory,
  contractType,
  setContractType,
  publicationPeriod,
  setPublicationPeriod,
  minimumSalary,
  setMinimumSalary,
  workMode,
  setWorkMode,
  workingTime,
  setWorkingTime,
  experienceLevel,
  setExperienceLevel,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  resetFilters,
}) {
  return (
    <>
      <button
        type="button"
        className="filters-toggle"
        onClick={() => setShowFilters((previous) => !previous)}
        aria-expanded={showFilters}
        aria-controls="filters-panel"
      >
        {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
      </button>

      {activeFiltersCount > 0 && (
        <button
          type="button"
          className="clear-filters"
          onClick={resetFilters}
        >
          Effacer les filtres
        </button>
      )}

      <aside
        id="filters-panel"
        className="filters-panel"
        aria-labelledby="filters-title"
        hidden={!showFilters}
      >
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
            <label htmlFor="publicationPeriod">
              Date de publication
            </label>
            <select
              id="publicationPeriod"
              value={publicationPeriod}
              onChange={(event) =>
                setPublicationPeriod(event.target.value)
              }
            >
              <option value="">Toutes les dates</option>
              <option value="1">Aujourd'hui</option>
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
              onChange={(event) =>
                setMinimumSalary(event.target.value)
              }
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
              <option value="Distanciel">Distanciel</option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="workingTime">Temps de travail</label>
            <select
              id="workingTime"
              value={workingTime}
              onChange={(event) =>
                setWorkingTime(event.target.value)
              }
            >
              <option value="">Tous les temps de travail</option>
              <option value="Temps plein">Temps plein</option>
              <option value="Temps partiel">Temps partiel</option>
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="experienceLevel">
              Niveau d'expérience
            </label>
            <select
              id="experienceLevel"
              value={experienceLevel}
              onChange={(event) =>
                setExperienceLevel(event.target.value)
              }
            >
              <option value="">Tous les niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Junior">Junior</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Senior">Senior</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <button type="button" onClick={resetFilters}>
          Réinitialiser les filtres
        </button>
      </aside>
    </>
  )
}

export default JobFilters
