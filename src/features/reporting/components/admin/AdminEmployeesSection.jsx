import { useState } from 'react'
import AdminPagination, { PAGE_SIZE } from './AdminPagination'
import AdminSectionIntro from './AdminSectionIntro'

export default function AdminEmployeesSection({ users, form, setForm, saving, onSubmit, onToggle }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedUsers = users.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  function handleRoleChange(role) {
    setForm((current) => ({
      ...current,
      role,
      department: current.department || 'Service',
    }))
  }

  function handleDepartmentChange(department) {
    setForm((current) => ({
      ...current,
      department,
    }))
  }

  return (
    <>
      <AdminSectionIntro
        aside={<span className="status-pill status-completed">{users.length} team members</span>}
        description="Create employee or manager accounts, then enable or disable access without leaving the dashboard."
        eyebrow="Access control"
        title="Manage employees"
      />

      <div className="admin-dual-grid">
        <section className="glass-card section-card admin-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">New account</div>
              <h3>Create employee profile</h3>
            </div>
          </div>

          <form className="report-grid" onSubmit={onSubmit}>
            <label className="field"><span>Name</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
            <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
            <label className="field"><span>Password</span><input required type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
            <label className="field">
              <span>Role</span>
              <select value={form.role} onChange={(event) => handleRoleChange(event.target.value)}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </label>
            <label className="field"><span>Employee code</span><input value={form.employeeCode} onChange={(event) => setForm((current) => ({ ...current, employeeCode: event.target.value }))} /></label>
            <label className="field"><span>Phone</span><input value={form.phone || ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label>
            <label className="field">
              <span>Department</span>
              <select value={form.department} onChange={(event) => handleDepartmentChange(event.target.value)}>
                <option value="Service">Service</option>
                <option value="Sales">Sales</option>
              </select>
            </label>
            <button className="primary-button field-wide" disabled={saving} type="submit">{saving ? 'Saving user...' : 'Create user'}</button>
          </form>
        </section>

        <section className="glass-card section-card admin-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">Team roster</div>
              <h3>Employee directory</h3>
            </div>
          </div>

          <div className="table-wrap admin-table-wrap">
            <table className="data-table admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id || user._id}>
                    <td><strong>{user.name}</strong><div className="muted">{user.email}</div></td>
                    <td><span className="status-pill status-completed">{user.role}</span></td>
                    <td><span className="table-soft-text">{user.department || '-'}</span></td>
                    <td><span className="table-soft-text">{user.employeeCode || '-'}</span></td>
                    <td><span className={`status-pill status-${user.active ? 'completed' : 'blocked'}`}>{user.active ? 'Active' : 'Disabled'}</span></td>
                    <td><button className="ghost-button inline-button" onClick={() => onToggle(user)} type="button">{user.active ? 'Disable' : 'Enable'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination
            currentPage={safeCurrentPage}
            itemLabel="employees"
            onPageChange={setCurrentPage}
            totalItems={users.length}
          />
        </section>
      </div>
    </>
  )
}
