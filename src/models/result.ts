import Member from 'models/member'

export default class Result{
    member: Member
    answer?: number
    score?: number
    difference?: number
    points: number
    isAuthor: boolean
}