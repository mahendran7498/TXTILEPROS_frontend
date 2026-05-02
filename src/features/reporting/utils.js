export function getWeekStartValue(date = new Date()) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  const day = value.getDay()
  const diff = day === 0 ? -6 : 1 - day
  value.setDate(value.getDate() + diff)
  return value.toISOString().slice(0, 10)
}

export function readFiles(files) {
  return Promise.all(
    Array.from(files)
      .slice(0, 4)
      .map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result })
            reader.onerror = () => reject(new Error(`Unable to read ${file.name}`))
            reader.readAsDataURL(file)
          })
      )
  )
}

export async function readSingleFile(file, kind) {
  const [photo] = await readFiles([file])
  return { ...photo, kind }
}

export function normalizeReportPhotos(photos = []) {
  const items = Array.isArray(photos) ? photos : []
  let beforeAssigned = false
  let afterAssigned = false

  return items.map((photo, index) => {
    const rawKind = String(photo?.kind || '').toLowerCase()

    if (rawKind === 'before' && !beforeAssigned) {
      beforeAssigned = true
      return { ...photo, displayKind: 'before' }
    }

    if (rawKind === 'after' && !afterAssigned) {
      afterAssigned = true
      return { ...photo, displayKind: 'after' }
    }

    if (!beforeAssigned) {
      beforeAssigned = true
      return { ...photo, displayKind: 'before' }
    }

    if (!afterAssigned) {
      afterAssigned = true
      return { ...photo, displayKind: 'after' }
    }

    return { ...photo, displayKind: index === 0 ? 'before' : 'after' }
  })
}

export function getPhotoSrc(photo) {
  return photo?.dataUrl || photo?.url || ''
}
