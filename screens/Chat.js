import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Auth, database } from '../config/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export default function Chat({ route }) {
  const [messages, setMessages] = useState([]);
  const currentUserEmail = Auth.currentUser.email;
  const chatPartnerEmail = route.params.friend; // Email of the chat partner

  // Firestore collection reference for storing messages
  const messagesRef = collection(database, 'messages');

  // Function to add a new message to Firestore
  const addMessageToFirestore = async (message) => {
    await addDoc(messagesRef, {
      text: message[0].text,
      sender: currentUserEmail,
      receiver: chatPartnerEmail,
      timestamp: serverTimestamp(),
    });
  };

  // Load initial messages from Firestore
  useEffect(() => {
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp'),
      where('sender', 'in', [currentUserEmail, chatPartnerEmail]),
      where('receiver', 'in', [currentUserEmail, chatPartnerEmail])
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        if (messageData.timestamp && messageData.timestamp.seconds) {
          // Check if timestamp and seconds property exist before accessing
          messageList.push({
            _id: doc.id,
            text: messageData.text,
            createdAt: new Date(messageData.timestamp.seconds * 1000),
            user: {
              _id: messageData.sender,
              name: Auth.currentUser.displayName,
              avatar: 'https://icones.pro/wp-content/uploads/2022/07/icones-d-administration-jaunes.png',
            },
          });
        }
      });
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [currentUserEmail, chatPartnerEmail]);

  // Function to send a message
  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    addMessageToFirestore(newMessages);
  };

  // Custom bubble style to hide the date
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'lightgray', // Customize the bubble background color
          },
          right: {
            backgroundColor: 'blue', // Your outgoing message bubble color
          },
        }}
        textStyle={{
          right: {
            color: 'white',
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUserEmail,
          name: Auth.currentUser.displayName,
          avatar: '',
        }}
        renderBubble={renderBubble}
        showUserAvatar
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
