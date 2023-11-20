import React, { useEffect, useMemo, useState } from "react";
import { Stack, Flex, Alert, Button, JSONInput, FieldLabel, Field, FieldHint, FieldError, } from '@strapi/design-system';
import { Trash, Plus, Duplicate } from '@strapi/icons';
import JsonGuiGenerator from '../JsonGuiGenerator';
import JsonGuiMenu from "../JsonGuiMenu";
import { jsonTypes } from '../utils/const';
import { getValueForType, checkDuplicateKey } from '../utils/helpers';
import Modal from '../uikit/Modal';
import '../index.css';

const JsonGui = ({
    attribute,
    name,
    onChange,
    value,
    required,
    error
}: {
    attribute: any;
    name: string;
    value: string;
    onChange(v: any): void;
    required: boolean;
    error: string;
}) => {
    
    const [json, setJson] = useState<any>(value ? JSON.parse(value) : {});
    const [modalDeleteJson, setModalDeleteJson] = useState(false);
    const [modalAddElement, setModalAddElement] = useState(false);
    const [path, setPath] = useState<string[]>([]);
    const [alert, setAlert] = useState({
        status: false,
        title: '',
        variant: '',
        message: ''
    });

    useEffect(() => {
        onChange({
            target: {
                name,
                value: JSON.stringify(json),
                type: attribute.type, 
            },
        });
    }, [json]);

    const possibleOptions = useMemo(() => {
        return (attribute['options'] || []).map((option: string) => {
            const [label, value] = [...option.split(':'), option]
            if (!label || !value) return null
            return { label, value }
        }).filter(Boolean)
    }, [attribute]);

    const fieldError = useMemo(() => {
        return error || (required && !possibleOptions.length ? 'No options' : null)
    }, [required, error, possibleOptions]);

    /**
     * Handles the addition of elements to the JSON structure based on a specified type.
     * It updates the existing JSON or initializes it if empty, and inserts elements according to the provided path.
     *
     * @param {string} type - The type of the element to be added.
     */
    const addJsonElement = (type:string) => {
        // Get the parsed value based on the provided type.
        let parsedValue = getValueForType(type);

        // If the JSON is empty or does not exist, initialize it accordingly.
        if (!json) {
            setJson(parsedValue);
            setModalAddElement(false);
            return;
        }

        // If the path is empty, update the main JSON structure.
        if (path.length === 0) {
            if (json.hasOwnProperty(type)) {
                getAlert(
                    'Error', 
                    'danger', 
                    'This key name already exists in the JSON.'
                );
            } else {
                setJson((prevJson: any) => ({ ...prevJson, [type]: parsedValue }));
            }
            setModalAddElement(false);
            return;
        }

        // Update the JSON in the specified path.
        let updatedJson = { ...json };
        let currentRef = updatedJson;

        for (let i = 0; i < path.length; i++) {
            const key = path[i];

            // If the key does not exist, create an empty object for it.
            if (!currentRef[key]) {
                currentRef[key] = {};
            }

            if (i === path.length - 1) {
                if (currentRef[key].hasOwnProperty(type)) {
                    getAlert(
                        'Error', 
                        'danger', 
                        'This key name already exists in the JSON.'                    
                    );
                } else {
                    if (Array.isArray(currentRef[key])) {
                        currentRef[key].push(parsedValue);
                    } else {
                        currentRef[key][type] = parsedValue;
                    }
                    setJson(updatedJson);
                }
            } else {
                currentRef = currentRef[key];
            }
        }

        setPath([]);
        setModalAddElement(false);
    };

    /**
     * Modifies the value of a specific key in the JSON structure.
     * If the provided key exists in the JSON structure, it updates the value.
     *
     * @param {string} value - The new value to be assigned to the key.
     * @param {string} key - The key whose value needs modification.
     * @param {string[]} path - The path to the key within the JSON structure.
     * @param {string} type - The type of modification (not explicitly used in the function body).
     */
    const editJSONValue = (value:string, key:string, path:string[], type:string) => {
        // Log the current state of the JSON object.
        console.log(json);
    
        // Create a copy of the JSON object to modify.
        let updatedObject = { ...json };
    
        // If the path is empty, modify the key at the top level of the object.
        if (path.length === 0) {
            if (updatedObject.hasOwnProperty(key)) {
                // Update only the key, creating a new copy of the object.
                updatedObject = { ...updatedObject, [key]: type === 'boolean' ? value === 'true' : value };
                setJson(updatedObject);
            } else {
                // Display an error if the key does not exist at the top level.
                getAlert(
                    'Error',
                    'danger',
                    "The key does not exist at the top level of the object."
                );
            }
        } else {
            // Modify the value at the specified path.
            for (let i = 0; i < path.length; i++) {
                // Create objects along the path if they do not exist.
                if (!updatedObject.hasOwnProperty(path[i])) {
                    updatedObject[path[i]] = {};
                }
    
                if (i === path.length - 1) {
                    // Update the value of the key at the specified path.
                    //updatedObject[path[i]][key] = value;
                    updatedObject[path[i]] = { ...updatedObject[path[i]], [key]: value };
                    setJson(updatedObject);
                } else {
                    // Traverse further along the path.
                    updatedObject = updatedObject[path[i]];
                }
            }
        }
    };
    
    /**
     * Modifies or renames a specific key within a JSON object or array at the provided path.
     * If the new key name is the same as an existing key or if a duplicate key is found,
     * it displays an error alert and prevents the modification.
     *
     * @param {string} value - The new value for the key.
     * @param {string} key - The existing key to be modified.
     * @param {string[]} path - The path to the key within the JSON structure.
     * @param {string} type - The type of modification (not explicitly used in the function body).
     */
    const editJSONKey = (value:string, key:string, path:string[], type:string) => {
        const duplicateKeyExists = checkDuplicateKey(json, value, path);
        let updatedObject = { ...json };
    
        if (duplicateKeyExists) {
            getAlert(
                'Error',
                'danger', 
                "This key already exists at the same level."
            );
            return;
        }
        
        if (path.length === 0) {
            if (updatedObject.hasOwnProperty(key) && key !== value) {
                const updatedKeys = { ...updatedObject };
                const index = Object.keys(updatedKeys).indexOf(key);
                const tempValue = updatedKeys[key];

                if (updatedKeys.hasOwnProperty(value)) {
                    getAlert(
                        'Error',
                        'danger', 
                        "This key already exists at the same level."
                    );
                    return;
                }

                updatedKeys[value] = tempValue;
                const reorderJson = moveLastKeyToIndex(updatedKeys, index);
                if(reorderJson) {
                    const updatedReorderJson: Record<string, any> = {...reorderJson};
                    delete updatedReorderJson[key];
                    setJson(updatedReorderJson);
                } else {
                    getAlert(
                        'Error', 
                        'danger', 
                        'While reordering the keys'
                    );
                }
            } else {
                getAlert(
                    'Error', 
                    'danger', 
                    'This key name already exists in the JSON.'
                );
            }
        } else {
            let current = updatedObject;    
            for (let i = 0; i < path.length; i++) {
                if (!current.hasOwnProperty(path[i])) {
                    current[path[i]] = i === path.length - 1 ? {} : [];
                }
    
                if (i === path.length - 1) {
                    if (Array.isArray(current[path[i]])) {
                        const index = current[path[i]].indexOf(key);
                        if (index > -1) {
                            current[path[i]][index] = value;
                        }
                    } else {
                        const temp = { ...current[path[i]] };
                        current[path[i]][value] = temp[key];
                        const index = Object.keys(current[path[i]]).indexOf(key);
                        const reorderJson = moveLastKeyToIndex(current[path[i]], index);
                        if(reorderJson) {
                            const updatedReorderJson: Record<string, any> = {...reorderJson};
                            delete updatedReorderJson[key];
                            current[path[i]] = updatedReorderJson;
                        } else {
                            getAlert(
                                'Error', 
                                'danger', 
                                'While reordering the keys'
                            );  
                        }
                    }
                    setJson(updatedObject);
                } else {
                    current = current[path[i]];
                }
            }
        }
    };

    /**
     * Modifies the type of a specific element within the JSON structure, emptying its content based on the new type.
     *
     * @param {string} key - The key of the element whose type is to be modified.
     * @param {string[]} path - The path to the element within the JSON structure.
     * @param {string} type - The new type to be assigned to the element.
     */
    const editElementType = (key:string, path:string[], type:string) => {
        // Create a copy of the JSON object to modify.
        let updatedObject = { ...json };

        if (path.length === 0) {
            // Modifying the type for an element at the top level.
            updatedObject[key] = getValueForType(type);
        } else {
            let current = updatedObject;

            for (let i = 0; i < path.length; i++) {
                // Create objects or arrays along the path if they do not exist.
                if (!current.hasOwnProperty(path[i])) {
                    current[path[i]] = i === path.length - 1 ? {} : [];
                }

                if (i === path.length - 1) {
                    // Modifying the type for an element in a specified path.
                    current[path[i]][key] = getValueForType(type);
                } else {
                    // Traverse further along the path.
                    current = current[path[i]];
                }
            }
        }

        setJson(updatedObject);
    };

    /**
     * Deletes the specified element from the JSON structure based on the provided key and path.
     *
     * @param {string} key - The key of the element to be deleted.
     * @param {string[]} path - The path to the element within the JSON structure.
     */
    const deleteElementFromJSON = (key:string, path:string[]) => {
        const newJson = { ...json };

        // Delete the element at the top level of the JSON structure.
        if (path.length === 0) {
            if (key in newJson) {
                delete newJson[key];
                setJson(newJson);
            }
            return;
        }

        // Delete the element within the specified path.
        let currentObject = newJson;
        let keyExists = true;

        for (let i = 0; i < path.length; i++) {
            const pathKey = path[i];
            if (pathKey in currentObject) {
                currentObject = currentObject[pathKey];
            } else {
                keyExists = false;
                break;
            }
        }

        if (keyExists && key in currentObject) {
            if (Array.isArray(currentObject)) {
                const index = currentObject.indexOf(key);
                if (index >= -1) {
                    currentObject.splice(index, 1);
                    setJson(newJson);
                }
            } else {
                delete currentObject[key];
                setJson(newJson);
            }
        }
    };

    /**
     * Clones an element within the JSON structure based on the provided key, path, and type.
     *
     * @param {string} key - The key of the element to be cloned.
     * @param {string[]} path - The path to the element within the JSON structure.
     * @param {string} type - The type of the element to be cloned.
     */
    const cloneJSONElement = (key:string, path:string[], type:string) => {
        const updatedObject = { ...json };
        let current = updatedObject;
        let cloned = false;

        // Traverse the JSON structure to reach the specified path.
        for (let i = 0; i < path.length; i++) {
            if (!current.hasOwnProperty(path[i])) {
                // Display an error if the path is invalid.
                getAlert(
                    'Error', 
                    'danger', 
                    'Invalid path.'
                );  
                return;
            }
            current = current[path[i]];
        }

        if (Array.isArray(current)) {
            // Cloning an element within an array.
            const index = current.findIndex(item => item === current[key]);
            if (index > -1) {
                const originalValue = current[index];
                let duplicatedValue;

                // Determine the type of the element and perform cloning accordingly.
                switch (type) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        duplicatedValue = originalValue;
                        break;
                    case 'object':
                        duplicatedValue = { ...originalValue };
                        break;
                    case 'array':
                        duplicatedValue = [...originalValue];
                        break;
                    default:
                        duplicatedValue = originalValue;
                }

                // Generate a unique key for the cloned element and add it to the array.
                current.splice(index + 1, 0, duplicatedValue);
                setJson(updatedObject);
                cloned = true;
            }
        } else {
            // Cloning an element within an object.
            if (current.hasOwnProperty(key)) {
                const originalValue = current[key];
                let duplicatedValue;

                // Determine the type of the element and perform cloning accordingly.
                switch (type) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        duplicatedValue = originalValue;
                        break;
                    case 'object':
                        duplicatedValue = { ...originalValue };
                        break;
                    case 'array':
                        duplicatedValue = [...originalValue];
                        break;
                    default:
                        duplicatedValue = originalValue;
                }

                // Generate a unique key for the cloned element and add it to the object if it does not exist already.
                const duplicatedKey = `${key}_clone`;
                if (!current.hasOwnProperty(duplicatedKey)) {
                    current[duplicatedKey] = duplicatedValue;
                    setJson(updatedObject);
                    cloned = true;
                }
            }
        }

        if (!cloned) {
            // Display an error if the cloning operation fails.
            getAlert(
                'Error', 
                'danger',
                'Failed to clone element within array or object.'
            );  
        }
    };

    /**
     * Copies the JSON content to the system clipboard.
     */
    const copyJSONToClipboard = () => {
        if (!json) return;

        navigator.clipboard.writeText(JSON.stringify(json)).then(() => {
            getAlert(
                'Success', 
                'success', 
                'JSON copied to clipboard.'
            );
        }).catch(err => {
            getAlert(
                'Error', 
                'danger', 
                'Failed to copy JSON to clipboard.'
            );
        });
    };

    /**
     * Deletes all content within the JSON structure by setting it to an empty object.
     * Also toggles the deletion confirmation modal state.
     */
    const deleteEntireJSON = () => {
        setJson({});
        setModalDeleteJson(prevState => !prevState);
    };

    /**
     * Toggles the visibility of the specified modal.
     *
     * @param {string} name - The name of the modal to be toggled.
     * @param {string[]} [path] - Optional. The path associated with the modal (specific to 'add' modal).
     */
    const toggleModal = (name:string, path?:string[]) => {
        switch (name) {
            case 'add':
                setModalAddElement(prevState => !prevState);
                // If a path is provided, update the path state.
                path ? setPath(path) : null;
                break;
            case 'delete':
                if (!json) return;
                setModalDeleteJson(prevState => !prevState);
                break;
            default:
                getAlert(
                    'Error', 
                    'danger', 
                    'Invalid modal name.'
                );
                break;
        }
    };

    /**
     * Displays an alert with specified details for a certain duration.
     *
     * @param {string} title - The title of the alert.
     * @param {string} variant - The style variant for the alert (e.g., 'danger', 'success').
     * @param {string} message - The message content of the alert.
     */
    const getAlert = (title:string, variant:string, message:string) => {
        setAlert({
            status: true,
            title: `${title}:`,
            variant: variant,
            message: message
        });

        setTimeout(() => {
            setAlert({ 
                status: false,
                title: '',
                variant: '',
                message: ''
            });
        }, 3000);
    };

    /**
     * Moves the last key of an object to a specified index in the object's key order.
     *
     * @param {object} json - The object whose key is to be moved.
     * @param {number} index - The index where the last key will be positioned.
     * @returns {object|void} - The modified object with the last key moved to the specified index.
     */
    function moveLastKeyToIndex(json:any, index:number) {
        const keys = Object.keys(json);
        
        if (index < 0 || index >= keys.length) {
            getAlert(
                'Error', 
                'danger', 
                'Invalid index.'
            );
            return; // Return if the index is out of range.
        }

        const lastKey = keys[keys.length - 1];
        const lastValue = json[lastKey];

        delete json[lastKey]; // Remove the last key.

        keys.splice(keys.length - 1, 1);
        keys.splice(index, 0, lastKey); // Insert the last key at the specified index.

        let newJson:any = {};

        keys.forEach(key => {
            if (key === lastKey) {
                newJson[key] = lastValue;
            } else {
                newJson[key] = json[key];
            }
        });

        return newJson;
    }

    return (
        <Field
            error={fieldError}
            name={name}
            required={required}
        >
            <Flex direction="column" alignItems="stretch" gap={1}>
                <Stack>
                    <FieldLabel className="marginBottom10">{name}</FieldLabel>
                    {modalDeleteJson && (
                        <Modal 
                            name="delete"
                            title="Are you sure you want to delete the JSON?"
                            content="This action will permanently remove the JSON file. Make sure you want to proceed as this action cannot be undone. Once deleted, the JSON cannot be restored."
                            btnText="Delete JSON"
                            handleClick={deleteEntireJSON}
                            handleClose={toggleModal}
                        />
                    )}
            
                    {modalAddElement && (
                        <Modal 
                            name="add"
                            title="Choose the type of element to add"
                            content={<JsonGuiMenu addJsonElement={addJsonElement} json={json} />}
                            handleClose={toggleModal}
                        />
                    )}

                    <Stack background="neutral100" padding={6}>
                        <Stack paddingBottom={8}>
                            <Flex justifyContent="space-between" paddingBottom={6}>
                                <Flex>
                                    <Button className="borderRadius0" onClick={() => toggleModal('add')} padding={5}>
                                        <Plus />
                                    </Button>
                                </Flex>
                                <Flex className="minHeight80">
                                    { alert.status && (
                                        <Alert 
                                            title={alert.title} 
                                            variant={alert.variant} 
                                            onClose={() => setAlert({
                                                status: false,
                                                title: '',
                                                variant: '',
                                                message: ''
                                            })}
                                        >
                                            {alert.message}
                                        </Alert>
                                    )}
                                </Flex>
                            </Flex>
                            <JsonGuiGenerator 
                                editType={editElementType}
                                jsonTypes={jsonTypes}
                                handleModal={toggleModal}
                                editKey={editJSONKey}
                                deleteElement={deleteElementFromJSON}
                                editValue={editJSONValue}
                                cloneElement={cloneJSONElement}
                                json={json} 
                            />
                        </Stack>
                        
                        <Stack className="positionRelative">
                            <JSONInput
                                value={json ? JSON.stringify(json, null, 2) : null}
                                disabled
                                className="minHeight150"
                            />
                            <Flex className="positionAbsolute">
                                <Button className="borderRadius0" onClick={copyJSONToClipboard} padding={5}>
                                    <Duplicate />
                                </Button>
                                <Button className="borderRadius0" variant="secondary" onClick={() => toggleModal('delete')} padding={5}>
                                    <Trash />
                                </Button>
                            </Flex>
                        </Stack>
                    </Stack>
                </Stack>
            </Flex>
        </Field>
    );
}

export default JsonGui;