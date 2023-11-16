import React from "react";
import { Box, Flex, GridLayout, Typography } from '@strapi/design-system';
import { jsonTypes } from '../utils/const';
import { getIconForType } from '../utils/helpers';

type Props = {
    addJsonElement: (type: string) => void;
    json: any;
};

const JsonGuiMenu = ({
    addJsonElement,
    json
}: Props) => {
    return (
        <Box padding={8} background="neutral100">
            <GridLayout>
                {jsonTypes.length > 0 && jsonTypes.map((type) => {
                    let active: boolean = true;
                    if (!json) {
                        if (type !== 'object' && type !== 'array') {
                            active = false;
                        }
                    }
                    return (
                        <Box
                            key={type}
                            padding={4}
                            hasRadius
                            background={active ? 'neutral150' : 'neutral0'}
                            shadow="tableShadow"
                            className={active ? 'cursorPointer' : ''}
                            onClick={active ? () => addJsonElement(type) : () => {}}
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Typography fontWeight="bold" variant="delta">
                                    {type}
                                </Typography>
                                {getIconForType(type)}
                            </Flex>
                        </Box>
                    );
                })}
            </GridLayout>
        </Box>
    );
};

export default JsonGuiMenu;
