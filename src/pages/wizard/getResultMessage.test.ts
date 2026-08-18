import { describe, it, expect } from 'vitest'
import { getResultMessage, ResultMessageInput } from './getResultMessage'

const base: ResultMessageInput = {
  traumaType: null,
  foundPiece: null,
  foundTooth: null,
  isLoose: null,
  hasBleeding: null,
  storageMethod: null
}

// Todo cenário precisa de pelo menos uma orientação prática ("O que fazer"),
// não só uma frase genérica mandando procurar um dentista.
describe('getResultMessage', () => {
  it('fratura, encontrou o pedaço, guardou em leite/soro/saliva', () => {
    const result = getResultMessage({ ...base, traumaType: 'fracture', foundPiece: true, storageMethod: 'milk' })
    expect(result.icon).toBe('success')
    expect(result.doList.length).toBeGreaterThan(0)
  })

  it('fratura, encontrou o pedaço, guardou em água', () => {
    const result = getResultMessage({ ...base, traumaType: 'fracture', foundPiece: true, storageMethod: 'water' })
    expect(result.urgency).toBe('Muito Urgente')
    expect(result.doList.length).toBeGreaterThan(0)
  })

  it('fratura, encontrou o pedaço, guardou em papel', () => {
    const result = getResultMessage({ ...base, traumaType: 'fracture', foundPiece: true, storageMethod: 'paper' })
    expect(result.doList.length).toBeGreaterThan(0)
    expect(result.dontList.length).toBeGreaterThan(0)
  })

  it('fratura, não encontrou o pedaço (bug original: ficava sem nenhuma orientação)', () => {
    const result = getResultMessage({ ...base, traumaType: 'fracture', foundPiece: false })
    expect(result.doList.length).toBeGreaterThan(0)
    expect(result.dontList.length).toBeGreaterThan(0)
  })

  it('avulsão, encontrou o dente, guardou em leite/soro/saliva', () => {
    const result = getResultMessage({ ...base, traumaType: 'avulsion', foundTooth: true, storageMethod: 'saliva' })
    expect(result.icon).toBe('success')
    expect(result.urgency).toBe('Muito Urgente')
  })

  it('avulsão, não encontrou o dente (bug original: ficava sem nenhuma orientação)', () => {
    const result = getResultMessage({ ...base, traumaType: 'avulsion', foundTooth: false })
    expect(result.doList.length).toBeGreaterThan(0)
    expect(result.dontList.length).toBeGreaterThan(0)
  })

  it('luxação, dente mole/deslocado', () => {
    const result = getResultMessage({ ...base, traumaType: 'luxation', isLoose: true })
    expect(result.doList.length).toBeGreaterThan(0)
  })

  it('luxação, sem folga (bug original: ficava sem orientação prática)', () => {
    const result = getResultMessage({ ...base, traumaType: 'luxation', isLoose: false })
    expect(result.doList.length).toBeGreaterThan(0)
    expect(result.dontList.length).toBeGreaterThan(0)
  })

  it('sangramento presente', () => {
    const result = getResultMessage({ ...base, traumaType: 'bleeding', hasBleeding: true })
    expect(result.doList.length).toBeGreaterThan(0)
  })

  it('sangramento ausente (bug original: ficava sem orientação prática)', () => {
    const result = getResultMessage({ ...base, traumaType: 'bleeding', hasBleeding: false })
    expect(result.doList.length).toBeGreaterThan(0)
    expect(result.dontList.length).toBeGreaterThan(0)
  })

  it('trauma "outro"', () => {
    const result = getResultMessage({ ...base, traumaType: 'other' })
    expect(result.doList.length).toBeGreaterThan(0)
  })

  it('fallback quando traumaType é null', () => {
    const result = getResultMessage(base)
    expect(result.doList.length).toBeGreaterThan(0)
  })
})
