import { Box, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react';
import React from 'react';
import { Skeleton } from '@chakra-ui/react';

export const ChatLoading = () => {
  return (
    <Stack>
      <Box padding="6" boxShadow="sm" bg="gray">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={3} spacing="3" skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="sm" bg="gray">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={3} spacing="3" skeletonHeight="2" />
      </Box>
      <Box padding="6" boxShadow="sm" bg="gray">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={3} spacing="3" skeletonHeight="2" />
      </Box>
    </Stack>
  );
};
