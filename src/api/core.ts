import * as firebaseui from 'firebaseui'
import * as firebase from 'firebase/app'
import 'firebase/database'

import Team from 'models/team'
import Member from 'models/member'
import Question from 'models/question'
import Answer from 'models/answer'
import User from 'models/user'
import Result from 'models/result'

import { EventEmitter } from 'events'

const config = {
    apiKey: "AIzaSyBxqTkwT_BM87TefrBgGL5DqIFdnGPupr4",
    authDomain: "quizzy-2ba94.firebaseapp.com",
    databaseURL: "https://quizzy-2ba94.firebaseio.com",
    projectId: "quizzy-2ba94",
    storageBucket: "quizzy-2ba94.appspot.com",
    messagingSenderId: "998358783561"
}

const authConfig: firebaseui.auth.Config = {
    signInSuccessUrl: 'l',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/tos'
}

type Domain = {
    user: User | null,
    users: readonly User[] | null,
    team: Team | null,
    members: readonly Member[] | null,
    questions: readonly Question[] | null,
    answers: readonly Answer[] | null
}

export default class Core {
    // Api is a singleton service in this case
    static getInstance() {
        if (!Core.instance)
            Core.instance = new Core()

        return Core.instance
    }
    private static instance: Core

    private app: firebase.app.App | null = null
    database: firebase.database.Database | null = null
    private ui: firebaseui.auth.AuthUI | null = null

    private emitter: EventEmitter = new EventEmitter()

    private internalState: Domain = {
        user: null,
        users: null,
        team: null,
        members: null,
        questions: null,
        answers: null
    }

    get state(): Domain {
        return this.internalState
    }

    private constructor() {
        this.init()
    }

    private init = () => {
        this.app = firebase.initializeApp(config)
        this.database = this.app.database()

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        firebase.auth().onAuthStateChanged(user => {
            const mappedUser = mapUser(user)
            if (mappedUser !== null) this.updateUser(mappedUser)
            this.emit('user', mappedUser)
        })
    }
    // Auth API
    startFirebaseUi = (elementId: string, returnUrl: string) => {
        const instance = firebaseui.auth.AuthUI.getInstance()

        if (instance !== null)
            this.ui = instance
        else
            this.ui = new firebaseui.auth.AuthUI(firebase.auth())


        this.ui.start(elementId, { ...authConfig, signInSuccessUrl: returnUrl })
    }

    logOut = () => {
        firebase.auth().signOut()
    }
    /*
        Read/Write operations
    */
    private updateUser = async (user: User): Promise<void> => {
        if (!this.validRequest())
            return

        return this.database.ref(`users/${user.key}`).set(user)
    }

    // Utils
    public setData = async <T extends { key: string }>(table: string, data: T) => {
        if (!this.validRequest())
            return

        return this.database.ref(`${table}/${data.key}`).set(data)
    }

    public create = <T extends {
        key: string | null,
        team: string
    }>(path: keyof Domain, value: T) => {
        if (!this.validRequest())
            return

        return this.database.ref(path).child(value.team).push(value)
    }

    public createBatch = <T extends {
        key: string | null,
        team: string
    }>(path: keyof Domain, value: T) => {
        if (!this.validRequest())
            return

        this.database.ref(path).

        return this.database.ref(path).child(value.team).push(value)
    }

    public update = <T extends {
        key: string | null,
        team: string
    }>(path: keyof Domain, value: T) => {
        if (!this.validRequest())
            return

        return this.database.ref(`${path}/${value.team}/${value.key}`).set(value)
    }

    public createOrUpdate = <T extends {
        key: string | null,
        team: string
    }>(path: keyof Domain, value: T) => {
        if (value.key === null || value.key === '')
            return this.create(path, value)

        return this.update(path, value)
    }

    public bindTeam = async (teamKey: string) => {
        // should load in that particular sequence. Can't do promise.all
        await this.bind(`teams/${teamKey}`, 'team')
        await this.bind(`members/${teamKey}`, 'members', firebaseArrayBinder)
        await this.bind(`users`, 'users', firebaseArrayBinder)
        await this.bind(`questions/${teamKey}`, 'questions', firebaseArrayBinder)
        await this.bind(`answers/${teamKey}`, 'answers', firebaseArrayBinder)

        console.log('finished binding stuff')
    }

    private bind = async (
        path: string,
        item: keyof Domain,
        customBinder: (snap: firebase.database.DataSnapshot | null) => any = (snap) => snap !== null ? snap.val() : null
    ) => {
        if (!this.validRequest()) throw new Error("Can't bind in invalid state")

        console.log(`b: ${item}`)
        this.database.ref(path).on('value', snap =>
            this.emit(item, customBinder(snap)))
    }
    private emit = <T extends Domain[TKey], TKey extends keyof Domain>(event: TKey, data: T) => {
        this.internalState = {
            ...this.state,
            [event]: data
        }
        this.emitter.emit(event, data)
    }
    public subscribe = <T extends Domain[TKey], TKey extends keyof Domain>(event: TKey, callback: (newData: T) => void) => {
        this.emitter.addListener(event, callback)
    }
    private validRequest(): this is this & { database: firebase.database.Database } {
        if (this.database === null) return false

        return true
    }
}

/*
    Factories
*/
const mapUser = (user: firebase.User | null): User | null => {
    if (user === null) return null

    const internalUser = {
        key: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        avatarUrl: user.photoURL || 'https://cdn4.iconfinder.com/data/icons/defaulticon/icons/png/256x256/help.png'
    }

    return internalUser
}

const firebaseArrayBinder = (snap: firebase.database.DataSnapshot | null) => snap !== null
    ? arrayBinder(snap.val())
    : null

const arrayBinder = (obj: object) => Object.keys(obj || {}).map(k => ({ ...obj[k], key: k }))

/* const answersBinder = (snap: firebase.database.DataSnapshot | null) => snap !== null
    ? Object.keys(snap.val() || {}).map(k => (
        {
            answers: arrayBinder(snap.val()[k]),
            questionKey: k
        } as Answer))
    : null

    */