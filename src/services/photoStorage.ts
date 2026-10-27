import { openDB } from 'idb'
import { logger } from '../utils/logger'

// As fotos da avaliação (File) não cabem no localStorage; ficam no IndexedDB
// do próprio aparelho, separado do restante do progresso. Nada aqui é enviado
// a servidor.
const DB_NAME = 'sos-dente-photos'
const STORE = 'photos'
const KEY = 'current'

const isAvailable = () => typeof indexedDB !== 'undefined'

const getDb = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE)
    }
  })

export async function savePhotos(photos: File[]): Promise<void> {
  if (!isAvailable()) return
  try {
    const db = await getDb()
    if (photos.length === 0) {
      await db.delete(STORE, KEY)
    } else {
      await db.put(STORE, photos, KEY)
    }
  } catch (error) {
    logger.error('Erro ao salvar fotos no aparelho:', error)
  }
}

export async function loadPhotos(): Promise<File[]> {
  if (!isAvailable()) return []
  try {
    const db = await getDb()
    return (await db.get(STORE, KEY)) ?? []
  } catch (error) {
    logger.error('Erro ao restaurar fotos do aparelho:', error)
    return []
  }
}

export async function clearPhotos(): Promise<void> {
  await savePhotos([])
}
