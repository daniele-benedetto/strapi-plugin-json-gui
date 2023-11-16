import React from "react"

import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

type Props = {
    name: string,
    value: string,
    placeholder?: string,
    label?: string,
    onChange?: (value:boolean, key:string, path: string[], type: string) => void
    path?:string[],
    keyOfValue?: string
};

const BooleanInput = ({
    label = " ", 
    name,
    value, 
    placeholder,
    onChange,
    path = [],
    keyOfValue
}: Props) => {
    return (
        <SingleSelect 
            name={name}
            onChange={ onChange && keyOfValue
                ? (e:boolean) => onChange(e, keyOfValue, path, 'boolean') 
                : null
            }
            label={label} 
            placeholder={placeholder} 
            value={value}>
            <SingleSelectOption value={true}>True</SingleSelectOption>
            <SingleSelectOption value={false}>False</SingleSelectOption>
        </SingleSelect>
    )   
};

export default BooleanInput;