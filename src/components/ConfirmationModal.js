import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/core";

const ConfirmationModal = ({ onClose, isOpen, onConfirm, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4}>{children}</Box>
        </ModalBody>
        <ModalFooter>
          <Button variantColor="blue" type="button" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ghost" type="submit" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
