import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface Occurrence {
  id?: number
  dateTime: string
  ageGroup: string
  gender: string
  traumaType: string
  accidentLocation: string
  observations: string
  createdAt: string
}

interface SOSDenteDB extends DBSchema {
  occurrences: {
    key: number
    value: Occurrence
    indexes: { 'by-date': string }
  }
}

class DatabaseService {
  private db: IDBPDatabase<SOSDenteDB> | null = null

  async init() {
    if (!this.db) {
      this.db = await openDB<SOSDenteDB>('sos-dente-db', 1, {
        upgrade(db) {
          const occurrenceStore = db.createObjectStore('occurrences', {
            keyPath: 'id',
            autoIncrement: true
          })
          occurrenceStore.createIndex('by-date', 'createdAt')
        }
      })
    }
    return this.db
  }

  async saveOccurrence(occurrence: Omit<Occurrence, 'id' | 'createdAt'>) {
    const db = await this.init()
    const newOccurrence: Occurrence = {
      ...occurrence,
      createdAt: new Date().toISOString()
    }
    return await db.add('occurrences', newOccurrence)
  }

  async getOccurrences(): Promise<Occurrence[]> {
    const db = await this.init()
    return await db.getAll('occurrences')
  }

  async getOccurrence(id: number): Promise<Occurrence | undefined> {
    const db = await this.init()
    return await db.get('occurrences', id)
  }

  async deleteOccurrence(id: number) {
    const db = await this.init()
    return await db.delete('occurrences', id)
  }

  async clearAll() {
    const db = await this.init()
    return await db.clear('occurrences')
  }
}

export const dbService = new DatabaseService()
export type { Occurrence }
