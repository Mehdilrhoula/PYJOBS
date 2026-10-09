import { useState } from 'react'
import './App.css'

function App() {
  const [selectedJob, setSelectedJob] = useState(null)
  const jobs = [
    {
      id: 1,
      title: 'Développeur web junior',
      company: 'Entreprise Exemple',
      location: 'Marseille',
      description: 'Participer au développement de sites et applications web.',
    },
    {
      id: 2,
      title: 'Technicien informatique',
      company: 'Société Démo',
      location: 'Aix-en-Provence',
      description: 'Accompagner les utilisateurs et assurer la maintenance informatique.',
    },
  ]
  return (
    <>
      <header>
        <h1>PYJOBS</h1>
      </header>
      <main>
        <h2>Nos offres d’emploi</h2>
        {jobs.map((job) => (
          <article key={job.id}>
            <h3>{job.title}</h3>
            <p>Entreprise : {job.company}</p>
            <p>Lieu : {job.location}</p>
            <button type="button" onClick={() => setSelectedJob(job)}>
              Voir l’offre
            </button>
          </article>
        ))}
        {selectedJob && (
          <section>
            <h2>{selectedJob.title}</h2>
            <p>{selectedJob.description}</p>
            <button type="button" onClick={() => setSelectedJob(null)}>
  Fermer
</button>
          </section>
        )}
      </main>
    </>
  )
}

export default App
