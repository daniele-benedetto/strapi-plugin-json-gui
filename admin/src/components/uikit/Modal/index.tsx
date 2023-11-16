import React, { ReactNode } from 'react';

import {ModalLayout, ModalHeader, Typography, ModalBody, ModalFooter, Button} from '@strapi/design-system';

type Props = {
    title: string,
    content: string | ReactNode,
    handleClose: (arg:string) => void,
    handleClick?: () => void,
    btnText?: string
    name: string
};

const Modal = ({
    title,
    content,
    handleClick,
    handleClose,
    name,
    btnText
}:Props) => {
    return (
        <ModalLayout onClose={() => handleClose(name)} labelledBy="title">
            <ModalHeader>
                <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
                    {title}
                </Typography>
            </ModalHeader>
            <ModalBody>
                {typeof content === 'string' ? (
                    <Typography fontWeight="bold" textColor="neutral800" as="p" id="content">
                        {content}
                    </Typography>
                ) : (
                    <>
                        {content}
                    </>
                )}
            </ModalBody>
            <ModalFooter 
                endActions={<>
                    <Button onClick={() => handleClose(name)} variant="secondary">Cancel</Button>
                    { handleClick && <Button onClick={handleClick}>{btnText}</Button> }
                </>} />
        </ModalLayout>
    )
}

export default Modal