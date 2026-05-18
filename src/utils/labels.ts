export function getAgeGroupLabel(age: string): string {
  const labels: Record<string, string> = {
    baby: '0-5 anos',
    child: '6-12 anos',
    adolescent: '>12 anos',
  }
  return labels[age] ?? age
}

export function getTraumaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    fracture: 'Fratura',
    avulsion: 'Avulsão',
    luxation: 'Luxação',
    bleeding: 'Sangramento',
    other: 'Outro',
  }
  return labels[type] ?? type
}

export function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    female: 'Feminino',
    male: 'Masculino',
    'prefer-not-to-say': 'Prefiro não informar',
  }
  return labels[gender] ?? gender
}

export function getToothTypeLabel(toothType: string): string {
  const labels: Record<string, string> = {
    baby: 'Dente de Leite',
    permanent: 'Dente Permanente',
    unknown: 'Não Identificado',
  }
  return labels[toothType] ?? toothType
}
