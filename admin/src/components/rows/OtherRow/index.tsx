import React from "react";

import { Flex, Box, Badge } from '@strapi/design-system';
import { Trash, Duplicate } from '@strapi/icons';

import StringInput from '../../fields/StringInput';
import NumberInput from '../../fields/NumberInput';
import BooleanInput from '../../fields/BooleanInput';
import SelectInput from '../../fields/SelectInput';

type Props = {
    margin?: number;
    item: string;
    type: string;
    json: any;
    path: string[];
    isArray?: boolean;
    editKey?: (value:any, key:string, path: string[], type: string) => void;
    editValue?: (value:any, key:string, path: string[], type: string) => void;
    cloneElement?: (key:string, path: string[], type: string) => void;
    deleteElement?: (key:string, path: string[]) => void;
    editType?: (key: string, path: string[], type: string) => void;
    jsonTypes: string[];
}
const OtherRow = ({
    margin = 0,
    item,
    type,
    json,
    path = [],
    editValue,
    editKey,
    deleteElement,
    cloneElement,
    editType,
    jsonTypes,
    isArray
}: Props) => {

    const setJsonInputType = (keyOfValue:string, value: any) => {
        switch (typeof value) { 
            case 'string': 
                return <StringInput 
                    onChange={editValue}
                    path={path}
                    name={value} 
                    keyOfValue={keyOfValue}
                    value={value} /> ;
                    break;
            case 'number':
                return <NumberInput 
                    onChange={editValue}
                    path={path}
                    name={value.toString()} 
                    keyOfValue={keyOfValue}
                    value={value} /> ;
                    break;
            case 'boolean':
                return <BooleanInput 
                    onChange={editValue}
                    path={path}
                    name={value.toString()} 
                    keyOfValue={keyOfValue}
                    value={value.toString()} /> ;
                    break;
            default:
                return <StringInput 
                    onChange={editValue}
                    path={path}
                    keyOfValue={keyOfValue}
                    name={value} 
                    value={value} /> ;
        };
    };

    return (
        <Flex style={{marginLeft: margin}} className="marginBottom5" justifyContent="space-between" padding={2}>
            <Flex>
                { !isArray && <Box className="marginRight10" >
                    <StringInput
                        onChange={editKey}
                        path={path}
                        name={item} 
                        keyOfValue={item}
                        value={item} 
                    />
                </Box> }
                { isArray && <Box className="marginRight10" >
                    <Badge className="badge">{item}</Badge>
                </Box> }
                <Box className="marginRight10" >
                    <SelectInput 
                        path={path}
                        keyOfValue={item}
                        onChange={editType}
                        name={type}
                        value={type}
                        options={jsonTypes} 
                    />
                </Box>
                <Box>
                    {setJsonInputType(item, json[item])}
                </Box>
            </Flex>
            <Flex>
                <Box 
                    className="cursorPointer fillWhite"            
                    onClick={ cloneElement
                        ? () => cloneElement(item, path, 'string')
                        : null
                    }
                >
                    <Duplicate />
                </Box>
                <Box 
                    marginLeft={4}
                    className="cursorPointer fillWhite"            
                    onClick={ deleteElement
                        ? () => deleteElement(item, path)
                        : null
                    }
                >
                    <Trash />
                </Box>
            </Flex>
        </Flex>
    )
}

export default OtherRow