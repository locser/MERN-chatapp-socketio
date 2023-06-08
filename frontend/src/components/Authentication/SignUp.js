import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useState } from 'react';

export const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [pic, setPic] = useState();
  // const [imageUrlBlob, setImageUrlBlob] = useState('');
  const [picLoading, setPicLoading] = useState();
  const toast = useToast();

  const handleClickPassword = () => setShow(!show);

  //reset pic when user pick another image
  const handleInputChange = (e) => {
    setPicLoading(true);
    const selectedPic = e.target.files[0];
    if (!selectedPic) {
      setPic(null);
    } else {
      setPic(selectedPic);
    }
    // postDetails(selectedPic);
    // wait 3s
    setPicLoading(false);
  };

  const submitHandler = (e) => {
    signUpHandler(pic);
  };
  //when i click Sign up button, Push data to the backend and process it
  const signUpHandler = async (image) => {
    //create loading animation
    setPicLoading(true);

    if (!name || !email || !password || !passwordConfirm) {
      toast({
        title: 'Please fill all the fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      // setTimeout(3000);  set time out avoid spamming the click event
      setPicLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: 'Passwords do not match!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      // setTimeout(3000); set time out avoid spamming the click event
      setPicLoading(false);
      return;
    }

    try {
      // Gửi dữ liệu lên backend
      //http://localhost:3001/api/user/uploadAvatar route backend server
      // Access to XMLHttpRequest at 'http://localhost:3001/user/uploadAvatar' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
      // FIXME: use CORS to fix
      // get Pic
      let imgAvatar = '';
      if (pic !== null) {
        const formData = new FormData();
        formData.append('image', image);
        console.log(formData.get('image'));

        const response = await axios.post(
          'http://127.0.0.1:3001/api/user/uploadAvatar',
          formData
        );
        imgAvatar = response.data.data;
        console.log(response);
      }

      //sign up -  call backend: router.route('/').post(registerUser);
      console.log(name, email, password, imgAvatar);

      setPicLoading(false);
    } catch (error) {
      setPicLoading(false);
      console.log(error);
    }
    setPicLoading(false);
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name">
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
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

      <FormControl id="passwordConfirm" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            value={passwordConfirm}
            type={show ? 'text' : 'password'}
            placeholder="Confirm password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickPassword}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={handleInputChange}
        />
      </FormControl>
      {/* {imageUrlBlob ? <img src={imageUrlBlob} alt="Uploaded Image" /> : null} */}

      <Button
        colorScheme="blue"
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
