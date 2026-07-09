import { useLocation } from 'react-router-dom'

function getFooterContent(pathname) {
  if (pathname.startsWith('/sales')) {
    return {
      title: 'TXTILPROS Sales Workspace',
      description: 'Manage orders, sales staff, and customer follow-up from one focused module.',
      chips: ['Sales Orders', 'Team Access', 'Owner Ready'],
    }
  }

  if (pathname.startsWith('/owner')) {
    return {
      title: 'TXTILPROS Owner Hub',
      description: 'A single control point for switching between the service and sales modules.',
      chips: ['Owner Control', 'Service View', 'Sales View'],
    }
  }

  return {
    title: 'TXTILPROS Service Workspace',
    description: 'Track field reporting, attendance, leaves, employees, and support activity with a cleaner dashboard flow.',
    chips: ['Service Reports', 'Attendance', 'Admin Monitoring'],
  }
}

export default function Footer() {
  const { pathname } = useLocation()
  const content = getFooterContent(pathname)

  return (
    <div className="app-footer-shell">
      <footer className="app-footer">
        <div>
          <strong>{content.title}</strong>
          <span>{content.description}</span>
        </div>
        <div className="app-footer-meta">
          {content.chips.map((chip) => (
            <span className="app-footer-chip" key={chip}>{chip}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
