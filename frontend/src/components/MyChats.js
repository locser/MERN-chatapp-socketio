import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import { ChatLoading } from './ChatLoading';
import { GroupChatModal } from './miscellaneous/GroupChatModal';

//show all my chat messages
export const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const dataJson = await axios.get('/api/chat', config);

      /* json : 
      {
        "status": "success",
        "data": [
            {
                "_id": "64907517b644dd09648ef37c",
                "chatName": "Jane Doe",
                "isGroupChat": false,
                "users": [
                    {
                        "_id": "649068eb3d28aa9bf0a6dd9d",
                        "name": "alex",
                        "email": "alex@gmail.com",
                        "picture": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar…"
                    },
                    {
                        "picture": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
                        "_id": "6481ade98c25b34f8b55a8f1",
                        "name": "Jane Doe",
                        "email": "jane@gmail.com",
                        "pic": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                ],
                "createdAt": "2023-06-19T15:32:39.829Z",
                "updatedAt": "2023-06-19T15:32:39.829Z",
                "__v": 0
            }
        ]
    }
    */

      const data = dataJson.data.data;

      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  /***
   * Sử dụng localStorage.getItem('userInfo') để lấy thông tin người dùng từ localStorage.
    Sử dụng JSON.parse() để chuyển đổi chuỗi JSON thành đối tượng JavaScript.
    Sử dụng setLoggedUser để cập nhật giá trị của loggedUser thành đối tượng người dùng được lấy từ localStorage.
    Gọi hàm fetchChats() để tải danh sách cuộc trò chuyện.
    fetchAgain được sử dụng trong mảng dependency của useEffect để đảm bảo useEffect được gọi lại khi giá trị của fetchAgain thay đổi. Điều này có thể được sử dụng để kích hoạt useEffect và thực hiện lại các công việc trong trường hợp cần thiết.
   */
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#F8F8F8"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text
        pb={3}
        px={3}
        fontSize={{ base: '22px', md: '22px' }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal user={user} chats={chats} setChats={setChats}>
          <Button
            display="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Text>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
