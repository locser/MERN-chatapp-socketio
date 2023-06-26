import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { MyChats } from '../components/MyChats';
// import { useHistory } from 'react-router';
import ChatBox from '../components/ChatBox';
import { ChatState } from '../Context/ChatProvider';

export const ChatPage = () => {
  // const history = useHistory();

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem('userInfo'));
  //   setUser(user);
  //   // console.log(userInfo);

  //   if (!user) {
  //     history.push('/');
  //   }
  // }, [history]);

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer user={user} />}
      {/* {<SideDrawer />} */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};
