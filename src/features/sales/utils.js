function normalizeDepartment(department) {
  return String(department || '').trim().toLowerCase()
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read the selected file.'))
    reader.readAsDataURL(file)
  })
}

export function isSalesUser(user) {
  return user?.role === 'employee' && normalizeDepartment(user?.department).includes('sales')
}

export function isOwner(user) {
  return user?.role === 'admin'
}

export function isSalesManager(user) {
  return user?.role === 'manager' && normalizeDepartment(user?.department).includes('sales')
}
