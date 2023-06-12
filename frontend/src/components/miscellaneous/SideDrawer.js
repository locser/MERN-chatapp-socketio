import { useToast } from '@chakra-ui/toast';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import {
  Avatar,
  Box,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import ProfileModal from './ProfileModal.js';
import NotificationButton from './NotificationButton.js';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { UserListItem } from '../userAvatar/UserListItem.js';
import { ChatLoading } from '../ChatLoading.js';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider.js';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    setLoading(true);

    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // FIXME: fix this api
      // const { data } = await axios.get(`/api/user?search=${search}`, config);
      // test
      const data = [
        { _id: 1, name: 'User 1' },
        { _id: 2, name: 'User 2' },
        { _id: 3, name: 'User 3' },
        { _id: 4, name: 'User 4' },
        { _id: 5, name: 'User 5' },
      ];

      setTimeout(() => {
        setSearchResult(data);
        setLoading(false);
      }, 3000);

      // setSearchResult(data);
      // setLoading(false);
    } catch (error) {
      setLoading(false);

      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      // TODO:fix this api
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (e) {
      setLoading(false);

      console.error(e);
      toast({
        title: 'Error Occured!',
        description: 'Failed to Access the Chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          CHAT WITH ME
          {/* //TODO: get name the web */}
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
              // count={notification.length}
              // effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} /> */}
              {/* FIXME: NotificationBadge peer react 16, my version is 18 */}
              <NotificationButton />
            </MenuButton>
            <MenuList pl={2}>
              {/* {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItemOption
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(
                        user,
                        notif.chat.users
                      )} efdafada`}
                </MenuItem>
              ))} */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                // name={user.name}
                // src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{' '}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((resultUser) => (
                <UserListItem
                  key={resultUser._id}
                  user={resultUser}
                  handleFunction={() => accessChat(resultUser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
