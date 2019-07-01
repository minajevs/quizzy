import Member from 'models/member'

export default class Result{
    member: Member
    answer?: number | string
    score?: number
    difference?: number | string
    points: number
    isAuthor: boolean
    shouldAnswer: boolean
}