import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/modal";
import { Button, Heading, ModalOverlay } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback, useContext, useState } from "react";
import socket from "../../socket";
import TextField from "../TextField";
import { FriendContext } from "./Home";
import * as Yup from "yup";

const friendSchema = Yup.object({
  friendName: Yup.string()
    .required("Username required")
    .min(6, "Invalid username!")
    .max(28, "Invalid username!"),
});
const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const { setFriendList } = useContext(FriendContext);
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
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
              ({ errorMsg, done, newFriend }) => {
                console.log("newFriendnewFriend", newFriend, done);
                if (done) {
                  setFriendList((c) => [newFriend, ...c]);
                  closeModal();
                  return;
                }
                setError(errorMsg);
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
