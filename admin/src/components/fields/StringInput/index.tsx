
import React from 'react'
import { TextInput } from '@strapi/design-system';

type Props = {
    name: string,
    value: string,
    placeholder?: string,
    label?: string,
    labelAction?: string,
    onChange?: (value:string, key:string, path: string[], type: string) => void
    path?:string[],
    keyOfValue?: string
}

const StringInput = ({
    label = " ", 
    name,
    value, 
    placeholder,
    labelAction,
    onChange,
    path = [],
    keyOfValue
}: Props) => {
    return (
        <>
        <TextInput
            onChange={onChange && keyOfValue
                ? (e:any) => onChange(e.target.value, keyOfValue, path, 'string') 
                : onChange && !keyOfValue
                ? (e:any) => onChange(e.target.value, "", path, 'string')
                : null
            }
            placeholder={placeholder}
            label={label}
            name={name}
            value={value}
            labelAction={labelAction} />
        </>
    )
}

export default StringInput
