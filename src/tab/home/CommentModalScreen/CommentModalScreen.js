import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../../../components/CustomInput';



const CommentModalScreen = ({ newsId, user, visible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments for the selected post
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await firestore()
          .collection('newsfeed')
          .doc(newsId)
          .collection('comments')
          .orderBy('timestamp', 'desc') // Order comments by timestamp, latest first
          .get();

        const commentsData = commentsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (visible && newsId) {
      fetchComments();
    }
  }, [visible, newsId]);

  const saveComment = async () => {
    if (!user) {
      alert('Please log in to comment on this post');
      return;
    }

    try {
      // Add a new comment to Firestore
      await firestore()
        .collection('newsfeed')
        .doc(newsId)
        .collection('comments')
        .add({
          userId: user.uid,
          text: newComment,
          timestamp: new Date(),
        });

      // Update the comment count for the post
      await firestore().collection('newsfeed').doc(newsId).update({
        commentCount: firestore.FieldValue.increment(1),
      });

      // Clear the comment input
      setNewComment('');

      // Fetch comments again to include the newly added comment
      fetchComments();
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Existing comments */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text>{item.text}</Text>
                {/* You can display other comment details like user, timestamp, etc. */}
              </View>
            )}
          />

          {/* New comment input */}
          <TextInput
            placeholder="Enter your comment"
            value={newComment}
            onChangeText={(text) => setNewComment(text)}
            multiline
            style={styles.commentInput}
          />

          <Button title="Save Comment" onPress={saveComment} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      marginVertical: 8,
    },
    title: {
      fontWeight: 'bold',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    commentInput: {
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      padding: 10,
    },
    commentItem: {
      marginBottom: 10,
      padding: 10,
      borderColor: 'gray',
      borderWidth: 1,
    },
  });
  export default CommentModalScreen
