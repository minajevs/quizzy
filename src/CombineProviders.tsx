import * as React from 'react'

type Props = {
    providers: React.FC[]
    children: React.ReactElement
}

const CombineProviders: React.FC<Props> = props => {
    const [First, ...Rest] = props.providers
    const children = props.children

    if (First !== undefined)
        return (
            <First>
                <CombineProviders providers={Rest}>
                    {children}
                </CombineProviders>
            </First>
        )

    return children
}

export default CombineProviders