import React from 'react';
import { TextInput } from '@strapi/design-system';

type Props = {
    name: string,
    value: number,
    placeholder?: string,
    label?: string,
    labelAction?: string,
    onChange?: (value:number, key:string, path: string[], type: string) => void
    path?:string[],
    keyOfValue?: string
};

const NumberInput = ({
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
        <TextInput
            onChange={onChange && keyOfValue
                ? (e:any) => {
                    const input = e.target.value
                    const regex = /^-?\d*\.?\d*$/
                    if (regex.test(input)) {
                        const parsedValue = parseFloat(input)
                        if (!isNaN(parsedValue)) {
                            onChange(parsedValue, keyOfValue, path, 'number')
                        }
                    }
                } : null
            }    
            placeholder={placeholder}
            label={label}
            name={name}
            value={value}
            labelAction={labelAction} />
    )
};

export default NumberInput;