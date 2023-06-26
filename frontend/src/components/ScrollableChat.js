import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((mess, index) => {
          return (
            <div style={{ display: 'flex' }} key={mess._id}>
              {(isSameSender(messages, mess, index, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={mess.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={mess.sender.name}
                    src={mess.sender.picture}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    mess.sender._id === user.id ? '#BEE3F8' : '#B9F5D0'
                  }`,
                  borderRadius: '20px',
                  padding: '5px 15px',
                  maxWidth: '75%',
                  marginLeft: isSameSenderMargin(
                    messages,
                    mess,
                    index,
                    user._id
                  ),
                  marginTop: isSameUser(messages, mess, index, user._id)
                    ? 5
                    : 10,
                }}
              >
                {mess.content}
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
