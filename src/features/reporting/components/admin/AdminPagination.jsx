const PAGE_SIZE = 10

export default function AdminPagination({ currentPage, itemLabel = 'items', onPageChange, pageSize = PAGE_SIZE, totalItems }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  if (totalItems <= pageSize) {
    return null
  }

  return (
    <div className="admin-pagination" role="navigation" aria-label={`${itemLabel} pagination`}>
      <p className="admin-pagination-summary">
        Showing {startItem}-{endItem} of {totalItems} {itemLabel}
      </p>
      <div className="admin-pagination-controls">
        <button
          className="ghost-button inline-button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Previous
        </button>
        <span className="admin-pagination-page">Page {currentPage} of {totalPages}</span>
        <button
          className="ghost-button inline-button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export { PAGE_SIZE }
