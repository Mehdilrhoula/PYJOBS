function PublishJobButton({ userRole, onPublish }) {
  if (userRole !== 'company') {
    return null
  }

  return (
    <button type="button" onClick={onPublish}>
      Publier une offre
    </button>
  )
}

export default PublishJobButton
