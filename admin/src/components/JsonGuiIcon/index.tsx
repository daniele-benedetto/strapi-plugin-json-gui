import React from 'react';
import { Flex } from '@strapi/design-system';
import { Json }  from '@strapi/icons';

const JsonGuiIcon = () => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            width={7}
            height={6}
            padding={1}
            hasRadius
            aria-hidden>
            <Json />
        </Flex>
    );
};

export default JsonGuiIcon;
