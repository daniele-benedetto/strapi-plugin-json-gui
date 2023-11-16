import React from 'react';
import { Boolean, Enumeration, Json, Number, Text } from '@strapi/icons';

/**
 * Returns an empty value for the specified type.
 * 
 * @param {string} type - The type for which an empty value is generated.
 * @returns {any} - The empty value for the specified type.
 */
export const getValueForType = (type:any) => {
    switch (type) {
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'object':
            return {};
        case 'array':
            return [];
        default:
            return '';
    }
};

/**
 * Returns an appropriate icon based on the specified type.
 *
 * @param {string} type - The type for which an empty value is generated.
 * @returns {ReactNode} - The icon component for the specified type.
 */
export const getIconForType = (type:string) => {
    switch (type) {
        case 'number':
            return <Number className="icon" />;
        case 'boolean':
            return <Boolean className="icon" />;
        case 'object':
            return <Json className="icon" />;
        case 'array':
            return <Enumeration className="icon" />;
        default:
            return <Text className="icon" />;
    }
};


/**
 * Checks for the presence of duplicate keys within a specified path of the JSON object.
 *
 * @param {object} json - The JSON object to be checked for duplicate keys.
 * @param {string} value - The value to be checked for duplication within the specified path.
 * @param {string[]} path - The path within the JSON structure to examine for the duplicate value.
 * @returns {boolean} - Returns true if the value already exists within the specified path, otherwise returns false.
 */
export const checkDuplicateKey = (json:any, value:string, path:string[]) => {
    let currentRef = json;

    for (let i = 0; i < path.length; i++) {
        if (currentRef.hasOwnProperty(path[i])) {
            currentRef = currentRef[path[i]];
        } else {
            return false; 
        }
    }

    return currentRef.hasOwnProperty(value); 
};