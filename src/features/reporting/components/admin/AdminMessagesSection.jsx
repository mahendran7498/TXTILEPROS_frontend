import { useState } from 'react'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'
import AdminSectionIntro from './AdminSectionIntro'

function formatMessageDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export default function AdminMessagesSection({ messages, onStatusUpdate, updatingMessageId }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedMessages = messages.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)
  const newMessagesCount = messages.filter((message) => message.status === 'new').length

  return (
    <>
      <AdminSectionIntro
        aside={<span className="status-pill status-pending">{newMessagesCount} new inquiries</span>}
        description="Review website contact form submissions, follow up with leads, and keep message status up to date."
        eyebrow="Inbox"
        title="Contact messages"
      />

      {messages.length === 0 ? (
        <div className="empty-state">No contact form messages received yet.</div>
      ) : (
        <section className="glass-card section-card admin-panel">
          <div className="table-wrap admin-table-wrap">
            <table className="data-table admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paginatedMessages.map((message) => {
                  const isUpdating = updatingMessageId === message._id

                  return (
                    <tr key={message._id}>
                      <td>
                        <strong>{message.name}</strong>
                        <div className="muted">{message.email}</div>
                        <div className="muted">{message.phone}</div>
                      </td>
                      <td>
                        <strong>{message.subject || 'General Inquiry'}</strong>
                      </td>
                      <td>
                        <div style={{ maxWidth: 320, whiteSpace: 'pre-wrap' }}>{message.message}</div>
                      </td>
                      <td>
                        <span className="table-soft-text">{formatMessageDate(message.createdAt)}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${message.status === 'replied' ? 'completed' : message.status}`}>
                          {message.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {message.status !== 'read' ? (
                            <button className="ghost-button inline-button" disabled={isUpdating} onClick={() => onStatusUpdate(message._id, 'read')} type="button">
                              Mark read
                            </button>
                          ) : null}
                          {message.status !== 'replied' ? (
                            <button className="secondary-button inline-button" disabled={isUpdating} onClick={() => onStatusUpdate(message._id, 'replied')} type="button">
                              Mark replied
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <AdminPagination
            currentPage={safeCurrentPage}
            itemLabel="messages"
            onPageChange={setCurrentPage}
            totalItems={messages.length}
          />
        </section>
      )}
    </>
  )
}
