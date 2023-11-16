import React from "react";

import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

type Props = {
    name: string;
    value: string;
    placeholder?: string;
    label?: string;
    options: string[];
    onChange?: (key:string, path: string[], type: string) => void
    path?:string[],
    keyOfValue?: string
};

const SelectInput = ({
    label = " ", 
    name,
    value, 
    placeholder,
    options,
    onChange,
    path = [],
    keyOfValue
}: Props) => {
    return (
        <SingleSelect 
            name={name}
            label={label} 
            placeholder={placeholder} 
            value={value}
            onChange={ onChange && keyOfValue
                ? (e:any) => onChange(keyOfValue, path, e) 
                : null
            }
        >
            {options && options.length > 0 && options.map((option) => (
                <SingleSelectOption key={option} value={option}>
                    {option}
                </SingleSelectOption>
            ))}
        </SingleSelect>
    )   
};

export default SelectInput;