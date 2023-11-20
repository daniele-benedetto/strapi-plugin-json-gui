
import React from 'react'
import { TextInput } from '@strapi/design-system';

type Props = {
    name: string
    value: string
    placeholder?: string
    label?: string
    labelAction?: string
    onChange?: (value:string, key:string, path: string[], type: string) => void
    path?:string[]
    keyOfValue?: string
    json?: any
}

const StringInput = ({
    label = " ", 
    name,
    value, 
    placeholder,
    labelAction,
    onChange,
    path = [],
    keyOfValue = "",
    json
}: Props) => {
    return (
        <>
        <TextInput
            onChange={(e:any) => {
                if(onChange) {
                    onChange(e.target.value, keyOfValue, path, 'string');  
                }
            }}
            placeholder={placeholder}
            label={label}
            name={name}
            value={value}
            labelAction={labelAction} />
        </>
    )
}

export default StringInput
