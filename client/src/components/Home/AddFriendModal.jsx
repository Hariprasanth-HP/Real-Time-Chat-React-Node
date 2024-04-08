import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/modal";
import { Button, ModalOverlay, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../TextField";
import * as Yup from "yup";
import { useCallback, useContext, useState } from "react";
import socket from "../../socket";
import { FriendContext } from "./Home";

const friendSchema = Yup.object({
  friendName: Yup.string()
    .required("Username required")
    .min(6, "Invalid username!")
    .max(28, "Invalid username!"),
});
const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState(null);
  const { setFriendList } = useContext(FriendContext);
  const closeModal = useCallback(() => {
    onClose();
    setError(null);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a friend!</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: "" }}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ done, errorMsg }) => {
                if (done) {
                  setFriendList((frd) => [...frd, values.friendName]);
                  closeModal();
                  return;
                } else {
                  setError(errorMsg);
                }
              }
            );
          }}
          validationSchema={friendSchema}
        >
          <Form>
            <ModalBody>
              <Heading fontSize="xl" color="red.500" textAlign="center">
                {error}
              </Heading>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's username.."
                autoComplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
