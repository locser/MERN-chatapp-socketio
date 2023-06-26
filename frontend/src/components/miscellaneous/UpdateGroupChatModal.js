import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  Input,
  FormControl,
  Spinner,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import { UserListItem } from '../userAvatar/UserListItem';
import axios from 'axios';

const UpdateGroupChatModal = ({
  selectedChat,
  setSelectedChat,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const { user } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleSearch = async (searchValue) => {
    searchValue = searchValue.trim();
    if (!searchValue || searchValue.length === 0) {
      setSearchResult();
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const dataJson = await axios.get(
        `/api/user?search=${searchValue}`,
        config
      );
      //get user from dataJson
      //   {
      //     "status": "success",
      //     "length": 1,
      //     "data": [
      //         {
      //             "picture": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      //             "_id": "6481ac728c25b34f8b55a8e2",
      //             "name": "alex",
      //             "email": "alex@gmail.com",
      //             "pic": ""
      //         }
      //     ]
      // }

      // console.log(dataJson);
      const data = dataJson.data.data;

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataJson = await axios.put(
        'api/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      const data = dataJson.data.data;

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      setRenameLoading(false);
      console.log(err);
      toast({
        title: 'Error Occured!',
        description: 'Failed to rename the Chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
    setGroupChatName('');
  };
  const handleAddUser = async (user1, selectedChat1) => {
    const groupAdminId = selectedChat1.groupAdmin;
    console.log(selectedChat1);

    if (selectedChat1.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'User Already in group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (groupAdminId !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataJson = await axios.put(
        `/api/chat/group/add`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      const data = dataJson.data.data;

      setSelectedChat(data);
      console.log(`chat group after ADDing user + ${data}`);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: 'Error Occured!',
        description: 'Fail to add user to chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
    // setGroupChatName('');
  };
  const handleRemove = async (user1, selectedChat1) => {
    console.log(selectedChat1);
    const groupAdminId = selectedChat1.groupAdmin;
    if (user._id !== groupAdminId && user1._id !== user._id) {
      console.log(user1._id, selectedChat.groupAdmin._id, user._id);
      toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const dataJson = await axios.put(
        `/api/chat/group/remove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      const data = dataJson.data.data;
      setSelectedChat(data);
      console.log('group chat after remove user ' + data);
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain); // send to useEffect to fetch chats ()
      // fetchMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Occured!',
        description: 'Failed to remove user',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
    // setGroupChatName('');
  };
  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u, selectedChat)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => {
                  e.persist();
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user, selectedChat)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
