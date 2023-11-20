import React, { useEffect, useState } from 'react';

import { Divider } from '@strapi/design-system';

import ObjectRow from '../rows/ObjectRow';
import OtherRow from '../rows/OtherRow';
 
type Props = {
    json: any;
    path?: string[];
    margin?: number;
    handleModal?: (type: string, path: string[]) => void;
    editKey?: (value: any, key: string, path: string[], type: string) => void;
    editValue?: (value: any, key: string, path: string[], type: string) => void;
    cloneElement?: (key: string, path: string[], type: string) => void;
    deleteElement?: (key: string, path: string[]) => void;
    editType?: (key: string, path: string[], type: string) => void;
    jsonTypes: string[];
    isArray?: boolean;
};

const JsonGuiGenerator = ({
    json,
    path = [],
    margin = 0,
    editValue,
    editKey,
    deleteElement,
    cloneElement,
    handleModal,
    jsonTypes,
    editType,
    isArray
}: Props) => {

    const [marginLeftStyle, setMarginLeftStyle] = useState(0);

    useEffect(() => {
        setMarginLeftStyle(margin * 20);
    }, [margin]);

    return (
        <>
            {json && Object.keys(json).map((itemKey) => {
                const currentPath = [...path, itemKey];
                return (
                    <>
                        {typeof json[itemKey] === 'object' ? (
                            <>
                                <ObjectRow
                                    isArray={isArray}
                                    jsonTypes={jsonTypes}
                                    editKey={editKey}
                                    handleModal={handleModal}
                                    cloneElement={cloneElement}
                                    deleteElement={deleteElement}
                                    path={path}
                                    value={json[itemKey]}
                                    item={itemKey}
                                    margin={marginLeftStyle}
                                    editType={editType}
                                />
                                <Divider />
                                <JsonGuiGenerator
                                    isArray={Array.isArray(json[itemKey])}
                                    handleModal={handleModal}
                                    cloneElement={cloneElement}
                                    editValue={editValue}
                                    deleteElement={deleteElement}
                                    json={json[itemKey]}
                                    path={currentPath}
                                    jsonTypes={jsonTypes}
                                    margin={margin + 1}
                                    editKey={editKey}
                                    editType={editType}
                                />
                            </>
                        ) : (
                            <>
                                <OtherRow
                                    isArray={isArray}
                                    jsonTypes={jsonTypes}
                                    editType={editType}
                                    cloneElement={cloneElement}
                                    deleteElement={deleteElement}
                                    editKey={editKey}
                                    editValue={editValue}
                                    path={path}
                                    item={itemKey}
                                    margin={marginLeftStyle}
                                    type={typeof json[itemKey]}
                                    json={json}
                                />
                                <Divider />
                            </>
                        )}
                    </>
                );
            })}
        </>
    );
};

export default JsonGuiGenerator;
