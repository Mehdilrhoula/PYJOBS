
function AuthForm({
  showRegister,
  setShowRegister,
  registerRole,
  setRegisterRole,
  showPassword,
  setShowPassword,
  authMessage,
  setAuthMessage,
  handleAuthSubmit,
}) {
  function toggleRegister() {
    setShowRegister((previous) => !previous)
    setAuthMessage('')
    setShowPassword(false)
  }

  return (
    <div id="login-panel" className="login-panel">
      <h2>{showRegister ? 'Créer un compte' : 'Connexion'}</h2>

      <form className="login-form" onSubmit={handleAuthSubmit}>
        {showRegister && (
          <>
            <label htmlFor="register-role">Type de compte</label>
            <select
              id="register-role"
              name="role"
              value={registerRole}
              onChange={(event) => {
                setRegisterRole(event.target.value)
                setAuthMessage('')
              }}
              required
            >
              <option value="candidate">Candidat</option>
              <option value="company">Société</option>
            </select>

            <label htmlFor="register-name">
              {registerRole === 'company'
                ? 'Raison sociale'
                : 'Nom complet'}
            </label>
            <input
              key={registerRole}
              id="register-name"
              name="name"
              type="text"
              placeholder={
                registerRole === 'company'
                  ? 'Exemple : Entreprise ABC'
                  : 'Exemple : Jean Dupont'
              }
              required
            />

            <label htmlFor="register-phone">
              Téléphone (facultatif)
            </label>
            <input
              id="register-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Exemple : 06 12 34 56 78"
            />

            {registerRole === 'company' && (
              <>
                <label htmlFor="register-website">
                  Site internet (facultatif)
                </label>
                <input
                  id="register-website"
                  name="website"
                  type="url"
                  placeholder="https://www.exemple.fr"
                />
              </>
            )}
          </>
        )}

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Votre adresse email"
          required
        />

        <label htmlFor="login-password">Mot de passe</label>
        <input
          key={showRegister ? 'register-password' : 'login-password'}
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete={
            showRegister ? 'new-password' : 'current-password'
          }
          placeholder="Votre mot de passe"
          required
        />

        {showRegister && (
          <>
            <label htmlFor="confirm-password">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Retapez votre mot de passe"
              required
            />
          </>
        )}

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-pressed={showPassword}
        >
          {showPassword
            ? 'Masquer le mot de passe'
            : 'Afficher le mot de passe'}
        </button>

        {authMessage && <p role="status">{authMessage}</p>}

        <button type="submit">
          {showRegister ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>

      <p className="register-prompt">
        {showRegister
          ? 'Déjà un compte ?'
          : 'Pas encore de compte ?'}
      </p>

      <button type="button" onClick={toggleRegister}>
        {showRegister
          ? 'Revenir à la connexion'
          : 'Créer un compte'}
      </button>
    </div>
  )
}

export default AuthForm
