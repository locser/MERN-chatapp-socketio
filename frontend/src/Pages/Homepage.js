import React, { useState } from 'react';
// import axios from 'axios';
// import { useEffect } from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import { SignUp } from '../components/Authentication/SignUp';

export const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={'white'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWith="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Talk A Tive
        </Text>
      </Box>
      <Box
        p={4}
        bg={'white'}
        w="100%"
        borderRadius="lg"
        color="black"
        borderWith="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
