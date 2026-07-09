import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Footer from '../../components/Footer'
import AccessDeniedPanel from '../../components/AccessDeniedPanel'
import SalesLoginScreen from './components/SalesLoginScreen'
import useSalesPortal from './useSalesPortal'
import { isOwner, isSalesManager, isSalesUser } from './utils'

function SalesNavigation({ activePath, user }) {
  const canManageSales = isOwner(user) || isSalesManager(user)
  const items = canManageSales
    ? [
        { label: 'Overview', path: '/sales/dashboard' },
        { label: 'All Sales Orders', path: '/sales/admin/orders' },
        { label: 'Sales Team', path: '/sales/admin/employees' },
        ...(isOwner(user) ? [{ label: 'Owner Hub', path: '/owner/dashboard' }] : []),
      ]
    : [
        { label: 'Overview', path: '/sales/dashboard' },
        { label: 'Add New Order', path: '/sales/orders/new' },
        { label: 'My Orders', path: '/sales/orders' },
      ]

  return (
    <nav className="glass-card section-card admin-nav-shell">
      <div className="admin-nav-list">
        {items.map((item) => (
          <Link
            className={`admin-nav-link${activePath === item.path ? ' active' : ''}`}
            key={item.path}
            to={item.path}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function SalesSummary({ dashboard }) {
  return (
    <div className="sales-stats-row">
      <article className="stat-card glass-card">
        <span>Total Orders</span>
        <strong>{dashboard.totalOrders || 0}</strong>
        <small>Visible in your sales workspace</small>
      </article>
      <article className="stat-card glass-card">
        <span>Pending Orders</span>
        <strong>{dashboard.pendingOrders || 0}</strong>
        <small>Current backlog</small>
      </article>
      <article className="stat-card glass-card">
        <span>Completed Orders</span>
        <strong>{dashboard.completedOrders || 0}</strong>
        <small>Based on non-pending status</small>
      </article>
    </div>
  )
}

function SalesOrderForm({ form, onFileChange, onSubmit, saving, setForm }) {
  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">New order</div>
          <h3>Add sales order</h3>
        </div>
      </div>

      <form className="report-grid employee-form-grid" onSubmit={onSubmit}>
        <label className="field"><span>Customer name</span><input required value={form.customer_name} onChange={(event) => setForm((current) => ({ ...current, customer_name: event.target.value }))} /></label>
        <label className="field"><span>Phone number</span><input required value={form.phone_number} onChange={(event) => setForm((current) => ({ ...current, phone_number: event.target.value }))} /></label>
        <label className="field"><span>Email</span><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
        <label className="field field-wide"><span>Address</span><textarea required rows="3" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} /></label>
        <label className="field field-wide">
          <span>Company ID photo</span>
          <input accept=".jpg,.jpeg,.png,image/jpeg,image/png" required type="file" onChange={onFileChange} />
        </label>
        <button className="primary-button field-wide" disabled={saving} type="submit">
          {saving ? 'Saving order...' : 'Submit sales order'}
        </button>
      </form>
    </section>
  )
}

function OrdersTable({ orders, title, subtitle }) {
  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Sales orders</div>
          <h3>{title}</h3>
          <p className="muted">{subtitle}</p>
        </div>
      </div>

      <div className="table-wrap admin-table-wrap">
        <table className="data-table admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created By</th>
              <th>ID Photo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || order.id}>
                <td><strong>{order.customer_name}</strong><div className="muted">{order.email || '-'}</div></td>
                <td>{order.phone_number}</td>
                <td><span className="status-pill status-pending">{order.order_status || 'Pending'}</span></td>
                <td>{order.created_by}</td>
                <td><a href={order.company_id_photo} rel="noreferrer" target="_blank">View photo</a></td>
              </tr>
            ))}
            {!orders.length ? (
              <tr>
                <td colSpan="5"><span className="muted">No sales orders found.</span></td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SalesEmployeesSection({ form, onSubmit, salesUsers, saving, setForm }) {
  return (
    <div className="admin-dual-grid">
      <section className="glass-card section-card admin-panel">
        <div className="section-head">
          <div>
            <div className="eyebrow">Sales access</div>
            <h3>Create sales user</h3>
            <p className="muted">Users created here are added to the Sales department with either Employee or Manager access.</p>
          </div>
        </div>

        <form className="report-grid" onSubmit={onSubmit}>
          <label className="field"><span>Name</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
          <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label className="field"><span>Password</span><input required type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </label>
          <label className="field"><span>Employee code</span><input value={form.employeeCode} onChange={(event) => setForm((current) => ({ ...current, employeeCode: event.target.value }))} /></label>
          <label className="field"><span>Phone</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label>
          <label className="field"><span>Department</span><input disabled value="Sales" /></label>
          <button className="primary-button field-wide" disabled={saving} type="submit">
            {saving ? 'Creating user...' : 'Create sales user'}
          </button>
        </form>
      </section>

      <section className="glass-card section-card admin-panel">
        <div className="section-head">
          <div>
            <div className="eyebrow">Sales team</div>
            <h3>Current sales employees</h3>
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
              </tr>
            </thead>
            <tbody>
              {salesUsers.map((salesUser) => (
                <tr key={salesUser.id || salesUser._id}>
                  <td><strong>{salesUser.name}</strong><div className="muted">{salesUser.email}</div></td>
                  <td><span className="status-pill status-completed">{salesUser.role}</span></td>
                  <td><span className="table-soft-text">{salesUser.department || '-'}</span></td>
                  <td><span className="table-soft-text">{salesUser.employeeCode || '-'}</span></td>
                  <td><span className={`status-pill status-${salesUser.active ? 'completed' : 'blocked'}`}>{salesUser.active ? 'Active' : 'Disabled'}</span></td>
                </tr>
              ))}
              {!salesUsers.length ? (
                <tr>
                  <td colSpan="5"><span className="muted">No sales employees created yet.</span></td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function SalesOverviewSection({ dashboard, user }) {
  const canManageSales = isOwner(user) || isSalesManager(user)

  return (
    <section className="glass-card section-card employee-panel">
      <div className="section-head employee-section-head">
        <div>
          <div className="eyebrow">Module overview</div>
          <h3>{canManageSales ? 'Sales operations overview' : 'Sales workspace overview'}</h3>
          <p className="muted">
            {canManageSales
              ? 'Use the separate sections below to manage sales staff and review all sales orders.'
              : 'Use the separate sections below to add new orders and review only your own sales records.'}
          </p>
        </div>
      </div>

      <div className="admin-dual-grid">
        {canManageSales ? (
          <>
            <Link className="glass-card section-card owner-link-card" to="/sales/admin/orders">
              <div className="eyebrow">Orders</div>
              <h3>All Sales Orders</h3>
              <p className="muted">Review every order across the full sales team.</p>
            </Link>
            <Link className="glass-card section-card owner-link-card" to="/sales/admin/employees">
              <div className="eyebrow">People</div>
              <h3>Sales Employees</h3>
              <p className="muted">Create sales users and see the current sales roster.</p>
            </Link>
          </>
        ) : (
          <>
            <Link className="glass-card section-card owner-link-card" to="/sales/orders/new">
              <div className="eyebrow">Orders</div>
              <h3>Add New Order</h3>
              <p className="muted">Create a new sales order with company ID photo upload.</p>
            </Link>
            <Link className="glass-card section-card owner-link-card" to="/sales/orders">
              <div className="eyebrow">Tracking</div>
              <h3>My Orders</h3>
              <p className="muted">Review only the orders created by your sales account.</p>
            </Link>
          </>
        )}
      </div>

      <div className="employee-inline-metrics">
        <span className="status-pill status-completed">Total: {dashboard.totalOrders || 0}</span>
        <span className="status-pill status-pending">Pending: {dashboard.pendingOrders || 0}</span>
        <span className="status-pill">Completed: {dashboard.completedOrders || 0}</span>
      </div>
    </section>
  )
}

export default function SalesPortalPage() {
  const {
    credentials,
    dashboard,
    form,
    handleFileChange,
    handleLogin,
    handleLogout,
    handleOrderSubmit,
    handleSalesEmployeeSubmit,
    loading,
    orders,
    path,
    salesEmployeeForm,
    salesUsers,
    setCredentials,
    setForm,
    setSalesEmployeeForm,
    user,
  } = useSalesPortal()
  const activePath = path === '/sales/login' ? '/sales/dashboard' : path

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <SalesLoginScreen credentials={credentials} loading={loading} onSubmit={handleLogin} setCredentials={setCredentials} />
        <Footer />
      </>
    )
  }

  if (!isSalesUser(user) && !isSalesManager(user) && !isOwner(user)) {
    return <AccessDeniedPanel message="Only Sales employees, Sales managers, and Owner can access the sales module." />
  }

  return (
    <>
      <Toaster position="top-right" />
      <main className="app-shell">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <section className="hero-panel">
          <header className="dashboard-header">
            <div>
              <div className="eyebrow">Independent sales workspace</div>
              <h2>{isOwner(user) ? 'Owner sales view' : isSalesManager(user) ? 'Sales manager dashboard' : 'Sales dashboard'}</h2>
              <p className="muted">Signed in as {user.name} ({user.role}){user.department ? ` | ${user.department}` : ''}</p>
            </div>
            <div className="header-actions">
              {isOwner(user) ? (
                <Link className="secondary-button" to="/dashboard/admin">
                  Service Module
                </Link>
              ) : null}
              <button className="ghost-button" onClick={handleLogout} type="button">Logout</button>
            </div>
          </header>

          <SalesNavigation activePath={activePath} user={user} />
          {path === '/sales/dashboard' ? <SalesSummary dashboard={dashboard} /> : null}

          {path === '/sales/dashboard' ? <SalesOverviewSection dashboard={dashboard} user={user} /> : null}

          {isSalesUser(user) && path === '/sales/orders/new' ? (
            <SalesOrderForm form={form} onFileChange={handleFileChange} onSubmit={handleOrderSubmit} saving={loading} setForm={setForm} />
          ) : null}

          {isSalesUser(user) && path === '/sales/orders' ? (
            <OrdersTable orders={orders} subtitle="Only orders created by your sales account are visible here." title="My Orders" />
          ) : null}

          {(isOwner(user) || isSalesManager(user)) && path === '/sales/admin/orders' ? (
            <OrdersTable orders={orders} subtitle="Owner can review every sales order across the system." title="All Sales Orders" />
          ) : null}

          {(isOwner(user) || isSalesManager(user)) && path === '/sales/admin/employees' ? (
            <SalesEmployeesSection
              form={salesEmployeeForm}
              onSubmit={handleSalesEmployeeSubmit}
              salesUsers={salesUsers}
              saving={loading}
              setForm={setSalesEmployeeForm}
            />
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  )
}
