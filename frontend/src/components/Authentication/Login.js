import { FormControl, FormLabel, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { InputGroup } from '@chakra-ui/react';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleClickPassword = () => setShow(!show);

  const submitHandler = () => {};

  return (
    <VStack spacing="10px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          id="email"
          type=""
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            id="password"
            type={show ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickPassword}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width={'100%'}
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
