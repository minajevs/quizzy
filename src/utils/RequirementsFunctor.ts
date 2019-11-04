export default class RequirementsFunctor<TP, TN> {
    private constructor(
        private positiveValue: TP | null,
        private negativeValue: TN | null = null
    ) { }


    static ok<TP, TN>(value: TP) {
        return new RequirementsFunctor<TP, TN>(value)
    }

    static fail<TP, TN>(value: TN) {
        return new RequirementsFunctor<TP, TN>(null, value);
    }

    get<T>(defaultValue: T) {
        return this.negativeValue === null
            ? defaultValue
            : this.negativeValue;
    }

    static validateValue<TP, TN>(positiveValue: TP | null, negativeValue: TN) {
        return positiveValue !== null
            ? new RequirementsFunctor<TP, TN>(positiveValue)
            : new RequirementsFunctor<TP, TN>(null, negativeValue)

    }

    validate<RP, RN>(f: (wrapped: TP) => RP | null, negativeValue: RN): RequirementsFunctor<RP, TN | RN> {
        if (this.negativeValue !== null) {
            return RequirementsFunctor.fail<RP, TN | RN>(this.negativeValue)
        } else if (this.positiveValue === null) {
            return RequirementsFunctor.fail<RP, TN | RN>(negativeValue)
        } else {
            const result = f(this.positiveValue)
            return result !== null
                ? RequirementsFunctor.ok<RP, RN>(result)
                : RequirementsFunctor.fail<RP, RN>(negativeValue)
        }
    }

    map<RP>(f: (wrapped: TP) => RP): RequirementsFunctor<RP, TN> {
        if (this.negativeValue !== null) {
            return RequirementsFunctor.fail<RP, TN>(this.negativeValue)
        } else if (this.positiveValue === null) {
            throw new ReferenceError(`'positiveValue' of 'RequirementsFunctor' must have a value if 'negativeValue' is not null`)
        } else {
            return RequirementsFunctor.ok(f(this.positiveValue));
        }
    }
}