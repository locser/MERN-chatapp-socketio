import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { loggedUser, setLoggedUser } = useState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);
      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return <div>My Chats</div>;
};
