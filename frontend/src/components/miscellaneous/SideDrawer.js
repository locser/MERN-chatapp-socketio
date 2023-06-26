import { useToast } from '@chakra-ui/toast';
import React, { useState } from 'react';
import { Button } from '@chakra-ui/button';
import {
  Avatar,
  Box,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  effect,
  useDisclosure,
} from '@chakra-ui/react';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import ProfileModal from './ProfileModal.js';
import NotificationButton from './NotificationButton.js';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { UserListItem } from '../userAvatar/UserListItem.js';
import { ChatLoading } from '../ChatLoading.js';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider.js';
import { BrowserRouter, useHistory } from 'react-router-dom';
import NotificationBadge from 'react-notification-badge';
import { getSender } from '../../config/ChatLogics.js';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

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
      setLoading(false);

      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const dataJson = await axios.get(`/api/user?search=${search}`, config);

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
      // console.log(data);
      const length = dataJson.data.length;
      // console.log(length + ' users');

      if (length > 0) {
        setSearchResult(data);
        setLoading(false);
      } else {
        setLoading(false);

        toast({
          title: 'Not found user with keyword',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
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

  // create chat with selected user
  const accessChat = async (userId) => {
    console.log('Chat with user: ' + userId);
    try {
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const dataJson = await axios.post(`/api/chat`, { userId }, config);

      const data = dataJson.data.data;

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast({
        title: 'Error Occured!',
        description: 'Failed to Access the Chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
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
            <Text display={{ base: 'none', md: 'flex' }} px="4">
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
              <NotificationBadge
                count={notification.length}
                effect={effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
              {/* FIXME: NotificationBadge peer react 16, my version is 18 
                u can add --force to install 
                npm install react-notification-badge --force
              */}
              {/* <NotificationButton /> */}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && 'No New Messages'}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
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
