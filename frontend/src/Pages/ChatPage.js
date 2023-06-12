import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { MyChats } from '../components/MyChats';
import { useHistory } from 'react-router';
import ChatBox from '../components/ChatBox';

export const ChatPage = () => {
  const history = useHistory();

  const [user, setUser] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    setUser(user);
    // console.log(userInfo);

    if (!user) {
      // history.push('/');
    }
  }, [history]);

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer user={user} />}
      {/* {<SideDrawer />} */}
      <Box>
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
