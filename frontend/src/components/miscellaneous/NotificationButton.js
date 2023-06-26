import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

const NotificationButton = ({ count }) => {
  return (
    <Box position="relative">
      {count > 0 && (
        <Box
          position="absolute"
          top="-2px"
          right="-2px"
          w="4px"
          h="4px"
          bg="red.500"
          borderRadius="50%"
        />
      )}
      <IconButton
        aria-label="Notifications"
        icon={<BellIcon fontSize="2xl" />}
        borderRadius="full"
        bg="transparent"
        _hover={{ bg: 'gray.200' }}
      />
    </Box>
  );
};

export default NotificationButton;
