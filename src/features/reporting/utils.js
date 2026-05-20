import imageCompression from 'browser-image-compression'
import { MAX_BEFORE_WORK_PHOTOS, MAX_REPORT_PHOTO_SIZE_BYTES } from './constants'

const REPORT_PHOTO_LIMIT_MB = MAX_REPORT_PHOTO_SIZE_BYTES / (1024 * 1024)
const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: REPORT_PHOTO_LIMIT_MB,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.8,
}

function padDatePart(value) {
  return String(value).padStart(2, '0')
}

export function getLocalDateInputValue(date = new Date()) {
  const value = new Date(date)
  return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`
}

export function getLocalMonthInputValue(date = new Date()) {
  const value = new Date(date)
  return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}`
}

export function getWeekStartValue(date = new Date()) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  const day = value.getDay()
  const diff = day === 0 ? -6 : 1 - day
  value.setDate(value.getDate() + diff)
  return getLocalDateInputValue(value)
}

async function compressReportImage(file) {
  if (!(file instanceof File)) {
    throw new Error('Invalid image file selected.')
  }

  if (!String(file.type || '').startsWith('image/')) {
    throw new Error('Only image files can be uploaded.')
  }

  try {
    return await imageCompression(file, IMAGE_COMPRESSION_OPTIONS)
  } catch {
    throw new Error(`Unable to compress ${file.name}. Please try another image.`)
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export function readFiles(files) {
  return Promise.all(
    Array.from(files)
      .slice(0, MAX_BEFORE_WORK_PHOTOS)
      .map(async (file) => {
        const compressedFile = await compressReportImage(file)

        if (compressedFile.size > MAX_REPORT_PHOTO_SIZE_BYTES) {
          throw new Error('Each report photo must be 4MB or smaller after compression.')
        }

        const dataUrl = await readFileAsDataUrl(compressedFile)

        return {
          name: file.name,
          size: compressedFile.size,
          type: compressedFile.type || file.type,
          dataUrl,
        }
      })
  )
}

export async function readSingleFile(file, kind) {
  const [photo] = await readFiles([file])
  return { ...photo, kind }
}

export async function readMultipleFiles(files, kind) {
  const photos = await readFiles(files)
  return photos.map((photo) => ({ ...photo, kind }))
}

export function normalizeReportPhotos(photos = []) {
  const items = Array.isArray(photos) ? photos : []

  return items.map((photo, index) => {
    const rawKind = String(photo?.kind || '').toLowerCase()

    if (rawKind === 'before' || rawKind === 'after') {
      return { ...photo, displayKind: rawKind }
    }

    return { ...photo, displayKind: index === items.length - 1 ? 'after' : 'before' }
  })
}

export function getPhotoSrc(photo) {
  return photo?.dataUrl || photo?.url || ''
}
