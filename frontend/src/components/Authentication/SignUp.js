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
  const [imageUrlBlob, setImageUrlBlob] = useState('');
  const [picLoading, setPicLoading] = useState();
  const toast = useToast();

  const handleClickPassword = () => setShow(!show);
  //postDetails should only upload an image and temporarily save it to localstorage, when you click register, you will upload
  //  that image to the cloudinary, and receive the data then register the user
  const postDetails = async (pic) => {
    // Create loading animation
    setPicLoading(true);
    console.log(pic);

    if (!pic) {
      // toast({
      //   title: 'Please Select an Image!',
      //   status: 'warning',
      //   duration: 5000,
      //   isClosable: true,
      //   position: 'top',
      // });
      localStorage.removeItem('temporaryPic');
      setPicLoading(false);
      return;
    }

    // lấy, xử lý đường dẫn ảnh với blob
    const file = pic;
    const reader = new FileReader();

    reader.onload = (e) => {
      const imagePath = e.target.result;
      console.log(imagePath); // Đường dẫn ảnh sẽ được in ra console

      fetch(imagePath)
        .then((response) => response.blob())
        .then((blob) => {
          const imageUrl = URL.createObjectURL(blob);
          this.setState({ imageSrc: imageUrl });
        })

        .catch((error) => {
          console.error('Lỗi:', error);
        });
    };
    // console.log(localStorage.getItem('tempImageUrlBlob'));
    console.log(this.state.imageSrc);
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      // localStorage.setItem('temporaryPic', JSON.stringify(pic));
    }
    setPicLoading(false);
  };

  //when i click Sign up button
  const submitHandler = () => {
    //create loading animation
    setPicLoading(true);

    // check image if user dont select image, localStorage null
    if (!localStorage.getItem('temporaryPic')) {
    } else {
      // upload image to Cloudinary and get image information
    }
    //The backend handles user registration
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
            placeholder="Enter your password"
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
          value={pic}
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

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

// TODO: when click signup get all information and pic, upload image to cloud storage
// const postDetails = (pics) => {
//   setLoading(true);
//   // if (pics === undefined) {
//   if (!pics) {
//     toast({
//       title: 'Please select an Image!',
//       status: 'Warning',
//       duration: 5000,
//       isClosable: true,
//       position: 'top',
//     });

//     return;
//   }

//   if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
//     const dataPic = new FormData();
//     dataPic.append('file', pics);
//     dataPic.append('upload_preset', 'chat-app');
//     dataPic.append('cloud_name', 'cloudianry-chat-app');

//     // fetch('https://api.cloudinary.com/v1_1/cloudianry-chat-app')
//     // TODO:  gọi hàm upload Image từ backend. axios
//   }
// };

// const postDetails = async (pic) => {
//   setLoading(true);
//   //check image
//   if (!pic) {
//     toast({
//       title: 'Please select an Image!',
//       status: 'warning',
//       duration: 5000,
//       isClosable: true,
//       position: 'top',
//     });
//     return;
//   }

//   // Lưu trữ tạm thời hình ảnh vào localStorage
//   localStorage.setItem('temporaryPic', JSON.stringify(pic));

//   try {
//     // Tạo FormData và thêm các dữ liệu cần gửi lên backend
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('password', password);
//     // Thêm hình ảnh vào FormData
//     formData.append('pic', pic);

//     // Gửi dữ liệu lên backend
//     //route register - (router.route('/').post(registerUser);)
//     const response = await axios.post('/', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Xử lý response từ backend (nếu cần)
//     // ...

//     // Xóa hình ảnh tạm thời khỏi localStorage sau khi hoàn thành
//     localStorage.removeItem('temporaryPic');
//   } catch (error) {
//     console.error(error);
//     // Xử lý lỗi (nếu cần)
//     // ...
//   }
// };

// class ImageUploader extends React.Component {
//   handleImageChange = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const imagePath = e.target.result;
//       console.log(imagePath); // Đường dẫn ảnh sẽ được in ra console

//       fetch(imagePath)
//         .then(response => response.blob())
//         .then(blob => {
//           const imageUrl = URL.createObjectURL(blob);
//           this.setState({ imageSrc: imageUrl });
//         })
//         .catch(error => {
//           console.error('Lỗi:', error);
//         });
//     };

//     reader.readAsDataURL(file);
//   };

//   render() {
//     return (
//       <div>
//         <input
//           type="file"
//           id="image-input"
//           onChange={this.handleImageChange}
//         />
//         <img src={this.state.imageSrc} alt="Uploaded Image" />
//       </div>
//     );
//   }
// }

// export default ImageUploader;
