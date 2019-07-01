export default class Question {
    key: string
    author: string
    text: string
    description: string
    unitsMeasure: UnitsMeasure
    units: string
    answer: number | null
    date: number
    team: string
}

export type UnitsMeasure = 'free' | 'manual'