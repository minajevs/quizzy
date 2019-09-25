export class Maybe<T> {
    private constructor(
        private value: T | null,
        private cancelled: boolean = false
    ) { }

    static some<T>(value: T) {
        if (!value) {
            throw Error("Provided value must not be empty");
        }
        return new Maybe(value);
    }

    static none<T>() {
        return new Maybe<T>(null);
    }

    static cancelled<T>() {
        return new Maybe<T>(null, true);
    }

    static fromValue<T>(value: T) {
        return value ? Maybe.some(value) : Maybe.none<T>();
    }

    getOrElse(defaultValue: T) {
        return this.value === null ? defaultValue : this.value;
    }

    mapOrElse<R>(f: (wrapped: T) => R, g: () => void): Maybe<R> {
        if (this.cancelled) return Maybe.cancelled<R>();
        if (this.value === null) {
            g();
            return Maybe.cancelled<R>();
        } else {
            return Maybe.fromValue(f(this.value));
        }
    }

    map<R>(f: (wrapped: T) => R): Maybe<R> {
        if (this.value === null) {
            return Maybe.none<R>();
        } else {
            return Maybe.fromValue(f(this.value));
        }
    }

    flatMap<R>(f: (wrapped: T) => Maybe<R>): Maybe<R> {
        if (this.value === null) {
            return Maybe.none<R>();
        } else {
            return f(this.value);
        }
    }
}