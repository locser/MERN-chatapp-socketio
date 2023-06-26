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
  FormControl,
  Input,
  Box,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { UserListItem } from '../userAvatar/UserListItem';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

export const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  //it takes me 4 hours to fix :v i only search with keyword searchValue instead of
  // setSearch and search.
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
      // console.log('search with config : ' + searchValue);
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
      setLoading(false);
      console.log(error);
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the fields',
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
      const dataJson = await axios.post(
        '/api/chat/group',
        {
          name: groupChatName,
          users: selectedUsers,
          // users: JSON.stringify(selectedUsers.map((u) => u._id)),
          //    "users": ["6481ad158c25b34f8b55a8e4", "6481ad1222234f8b55a8e4", "6481a333b34f8b55a8e4"]
        },
        config
      );

      // console.log(selectedUsers);

      const data = dataJson.data.data;

      //miss1
      // Add newly created group to an existing MyChat
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New group chat created!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: 'Failed to create group chat',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  const handleDelete = (delUser) => {
    const updateSelectedUser = selectedUsers.filter(
      (user) => user._id !== delUser._id
    );
    setSelectedUsers(updateSelectedUser);
    // console.log('updateSelectedUsers', updateSelectedUser);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      {/* update group chat, delete user   */}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                value={search}
                mb={1}
                onChange={(e) => {
                  e.persist();
                  setSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              Group member:
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

/* FIXME: Vấn đề bạn đang gặp phát sinh do sự trễ trong việc cập nhật giá trị của search trong hàm handleSearch. Khi bạn gọi handleSearch trong sự kiện onChange của Input, việc cập nhật giá trị của search bằng setSearch không diễn ra ngay lập tức.

Để giải quyết vấn đề này, bạn có thể sử dụng hàm event.persist() để duy trì sự kiện và truy cập vào giá trị đã nhập. Sau đó, bạn có thể gọi handleSearch sau khi giá trị search đã được cập nhật.

      e.persist(); // Duy trì sự kiện
      setSearch(e.target.value);
      handleSearch(e.target.value); // Gọi handleSearch với giá trị mới của search

Bằng cách sử dụng e.persist() và truyền giá trị mới của search vào handleSearch, bạn sẽ có được kết quả mong muốn khi gọi hàm tìm kiếm ngay sau khi giá trị của search được cập nhật.


---------- tôi đã thử nhiều cách với stackoverflow nhưng không thành công và tôi đã sử udjng chatGPT cho vấn đề này
*/

/*
  FIXME: English: 
  The issue you're experiencing is due to the delay in updating the value of search in the handleSearch function. When you call handleSearch in the onChange event of the Input, the value of search is not immediately updated when you use setSearch.

To address this issue, you can use the event.persist() function to persist the event and access the entered value. Then, you can call handleSearch after the search value has been updated.

e.persist(); // Preserve the event
      setSearch(e.target.value);
      handleSearch(e.target.value); // Call handleSearch with the updated value of search
*/

//miss1
/*
Đoạn mã trên có một chức năng là lấy thông tin người dùng và danh sách các cuộc trò chuyện từ ChatContext bằng cách sử dụng hook useContext.

Sau đó, nó sử dụng setChats để cập nhật danh sách cuộc trò chuyện. Dòng mã setChats([data, ...chats]) có nghĩa là thêm một phần tử mới vào đầu danh sách cuộc trò chuyện. Phần tử mới này được đại diện bởi biến data.

Ví dụ: Nếu danh sách cuộc trò chuyện ban đầu là [chat1, chat2, chat3], và biến data chứa thông tin về một cuộc trò chuyện mới, thì sau khi gọi setChats([data, ...chats]), danh sách cuộc trò chuyện sẽ trở thành [data, chat1, chat2, chat3].
*/
