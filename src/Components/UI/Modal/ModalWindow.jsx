import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap'; // если вы используете react-bootstrap

const ModalWindow = ({title, body, closeAction}) => {
    return (
        <div>
            <Modal show={true} onHide={closeAction}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: 40, paddingBottom: 40}}>
                    {body}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ModalWindow;