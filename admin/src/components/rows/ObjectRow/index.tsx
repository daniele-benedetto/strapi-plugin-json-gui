import React from "react";

import { Flex, Box, Badge } from '@strapi/design-system';
import { Trash, Duplicate, Plus } from '@strapi/icons';

import StringInput from '../../fields/StringInput';
import SelectInput from '../../fields/SelectInput';

type Props = {
    margin?: number;
    item: string;
    type: string;
    value: any;
    path: string[];
    isArray?: boolean;
    editKey?: (value:any, key:string, path: string[], type: string) => void;
    cloneElement?: (key:string, path: string[], type: string) => void;
    deleteElement?: (key:string, path: string[]) => void;
    handleModal?: (type:string, path: string[]) => void;
    editType?: (key: string, path: string[], type: string) => void;
    jsonTypes: string[];
};

const ObjectRow = ({
    margin = 0,
    item,
    type,
    value,
    path = [],
    deleteElement,
    cloneElement,
    handleModal,
    editKey,
    jsonTypes,
    editType,
    isArray
}: Props) => {

    return (
        <Flex style={{marginLeft: margin}} className="marginBottom5" justifyContent="space-between" padding={2}>
            <Flex>
                { !isArray && <Box className="marginRight10" >
                    <StringInput
                        onChange={editKey}
                        path={path}
                        name={item}
                        keyOfValue={item}
                        value={item} />
                </Box> }
                { isArray && <Box className="marginRight10" >
                    <Badge className="badge">{item}</Badge>
                </Box> }
                <Box className="marginRight10" >
                    { Array.isArray(value) 
                    ? <SelectInput 
                        name={'array'}
                        value={'array'}
                        options={jsonTypes} 
                        path={path}
                        keyOfValue={item}
                        onChange={editType}
                    /> : <SelectInput 
                        name={'object'}
                        value={'object'}
                        options={jsonTypes} 
                        path={path}
                        keyOfValue={item}
                        onChange={editType}
                    /> }
                </Box>
            </Flex>            
            <Flex>
                <Box 
                    className="cursorPointer fillWhite"            
                    onClick={ handleModal
                        ? () => handleModal('add', [...path, item])
                        : null
                    } 
                >
                    <Plus />
                </Box>
                <Box 
                    marginLeft={4}  
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
};

export default ObjectRow;