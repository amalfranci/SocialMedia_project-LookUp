import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/layout';
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../miscellaneous/profileModal';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import axios from 'axios';


function SingleChat({ fetchAgain, setFetchAgain }) {

    const [messages, setMessages] = useState([]);
      const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();


    
    

     const { selectedChat, setSelectedChat, user, notification, setNotification } =
        ChatState();


    const sendMessage = async(event) => {
        if (event.key === "Enter" && newMessage)
        {
            try {

                 const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
                };
   setNewMessage("")
 const { data } = await axios.post("http://localhost:8800/users/sendmessage",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
                );
                

      console.log("mesages form my",data)
        setMessages([...messages, data]);
               
           }catch(error)
            {
                 toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
                
           }   
        
        }
        
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        
    }
    
  return (
      <>
          {selectedChat ? (
              <>
                <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
                      alignItems="center">
                       <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
                          onClick={() => setSelectedChat("")} />
                      {!selectedChat.isGroupChat ? (
                          <>{getSender(user, selectedChat.users)}
                           <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                          </>
                      ) : (
                              <>{selectedChat.chatName.toUpperCase()}
                                  <UpdateGroupChatModal
                                      fetchAgain={fetchAgain}
                                      setFetchAgain={setFetchAgain} />
                              </>
                      )}
                      
                  </Text>
                 <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="90%"
            borderRadius="lg"
            overflowY="hidden"
          >
                      {loading ? (
                          <Spinner
                              size="xl"
                              w={20}
                              h={20}
                              alignSelf="center"
                              margin="auto"
                          />
                      ) : (
                          <>
                            {/* messages */}
                        </>
                              
                )}

                     <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                  
                          <Input
                              variant="filled"
                              bg="#E0E0E0"
                              placeholder='Enter a message..'
                              onChange={typingHandler}
                              value={newMessage}
                          />
                              </FormControl >

                  </Box>
              </>
          ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                      <Text fontSize="3xl" pb={3} fontFamily="work sans">
                          Click on a user to start chatting
                      </Text>
                      
                  </Box>
       )}      
      </>
  )
}

export default SingleChat