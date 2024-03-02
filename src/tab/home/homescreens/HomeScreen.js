import React, { useState, useEffect, useSelector } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button,FlatList,Image } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../AuthContext';
import CustomInput from '../../../components/CustomInput';
const CommentModal = ({ newsId, user, visible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const commentsSnapshot = await firestore()
        .collection('newsfeed')
        .doc(newsId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .get();
  
      const commentsData = await Promise.all(
        commentsSnapshot.docs.map(async (doc) => {
          const commentData = doc.data();
          const userDoc = await firestore().collection('users').doc(commentData.userId).get();
          const username = userDoc.exists ? userDoc.data().username : 'Unknown'; 
          return {
            ...commentData,
            id: doc.id,
            username,
          };
        })
      );
  
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  useEffect(() => {
    // Fetch comments for the selected post
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
      const newsDocRef = firestore().collection('newsfeed').doc(newsId);

      const newsDocSnapshot = await newsDocRef.get();

      if (newsDocSnapshot.exists) {
        await newsDocRef.update({
          commentCount: firestore.FieldValue.increment(1),
        });

        await newsDocRef.collection('comments').add({
          userId: user.uid,
          text: newComment,
          timestamp: new Date(),
        });
      } else {
        console.error(`News document with ID ${newsId} not found.`);
      }

      setNewComment('');
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
          <View style={styles.modalHeader}>
            <Text style={{ color: 'blue' }}>Comments</Text>
          </View>

          {/* Existing comments */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />

          {/* New comment input */}
          <CustomInput
            placeholder="Enter your comment"
            value={newComment}
            setValue={setNewComment}
            multiline
          />
          <View style={styles.commentButton}>
          <Button
           
           title="Close"
           onPress={onClose}
         />
          <Button
           // style={{ padding: 20, marginVertical: 5 }}
            title="Save Comment"
            onPress={saveComment}
          />
          
          </View>
        </View>
      </View>
    </Modal>
  );
};
const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [newsArray, setNews] = useState([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [dislikedPosts, setDislikedPosts] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    const subscriber = firestore()
      .collection('newsfeed')
      .onSnapshot((querySnapshot) => {
        const newsArray = [];

        querySnapshot.forEach((documentSnapshot) => {
          newsArray.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setNews(newsArray);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const handleLike = async (newsId) => {
    if (!user) {
      alert('Please LogIn to Your Account to react the post');
      return;
    }
  
    try {
      const likedRef = firestore()
        .collection('newsfeed')
        .doc(newsId)
        .collection('likes')
        .doc(user.uid);
  
      const likedDoc = await likedRef.get();
  
      if (!likedDoc.exists) {
        // If not liked, update the likes count and add the user to the likes subcollection
        await firestore().collection('newsfeed').doc(newsId).update({
          likes: firestore.FieldValue.increment(1),
        });
  
        await likedRef.set({
          timestamp: new Date(),
        });
  
        // If user has previously disliked the post, update the dislikes count and remove from dislikes subcollection
        const dislikedRef = firestore()
          .collection('newsfeed')
          .doc(newsId)
          .collection('dislikes')
          .doc(user.uid);
  
        const dislikedDoc = await dislikedRef.get();
  
        if (dislikedDoc.exists) {
          await firestore().collection('newsfeed').doc(newsId).update({
            dislikes: firestore.FieldValue.increment(-1),
          });
  
          await dislikedRef.delete();
        }
  
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, newsId]);
        setDislikedPosts((prevDislikedPosts) => prevDislikedPosts.filter((id) => id !== newsId));
      } else {
        // User has already liked the post, handle accordingly (remove like)
        await firestore().collection('newsfeed').doc(newsId).update({
          likes: firestore.FieldValue.increment(-1),
        });
  
        await likedRef.delete();
  
        setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((id) => id !== newsId));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };
  
  const handleDislike = async (newsId) => {
    if (!user) {
      alert('Please LogIn to Your Account to react the post');
      return;
    }
  
    try {
      const dislikedRef = firestore()
        .collection('newsfeed')
        .doc(newsId)
        .collection('dislikes')
        .doc(user.uid);
  
      const dislikedDoc = await dislikedRef.get();
  
      if (!dislikedDoc.exists) {
        // If not disliked, update the dislikes count and add the user to the dislikes subcollection
        await firestore().collection('newsfeed').doc(newsId).update({
          dislikes: firestore.FieldValue.increment(1),
        });
  
        await dislikedRef.set({
          timestamp: new Date(),
        });
  
        // If user has previously liked the post, update the likes count and remove from likes subcollection
        const likedRef = firestore()
          .collection('newsfeed')
          .doc(newsId)
          .collection('likes')
          .doc(user.uid);
  
        const likedDoc = await likedRef.get();
  
        if (likedDoc.exists) {
          await firestore().collection('newsfeed').doc(newsId).update({
            likes: firestore.FieldValue.increment(-1),
          });
  
          await likedRef.delete();
        }
  
        setDislikedPosts((prevDislikedPosts) => [...prevDislikedPosts, newsId]);
        setLikedPosts((prevLikedPosts) => prevLikedPosts.filter((id) => id !== newsId));
      } else {
        // User has already disliked the post, handle accordingly (remove dislike)
        await firestore().collection('newsfeed').doc(newsId).update({
          dislikes: firestore.FieldValue.increment(-1),
        });
  
        await dislikedRef.delete();
  
        setDislikedPosts((prevDislikedPosts) => prevDislikedPosts.filter((id) => id !== newsId));
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };
  
  const handleComment = (newsId) => {
    if (!user) {
      alert('Please log in to comment on this post');
      return;
    }

    setCommentModalVisible(true);
    setSelectedNewsId(newsId);
  };
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      {newsArray.map((news) => (
        <Card key={news.id} style={styles.card}>
          <Card.Title
            title={news.name}
            subtitle="new user"
            left={() => <Avatar.Image source={{ uri: news.avatar }} size={40} />}
          />
          {news.photo && <Card.Cover source={{ uri: news.photo }} />}
          <Card.Content>
            <Title style={styles.title}>{news.title}</Title>
            <Paragraph>{news.content}</Paragraph>
            <View style={styles.buttonsContainer}>

            <TouchableOpacity onPress={() => handleLike(news.key)}>
                        <Icon
                          name="thumbs-up"
                          size={20}
                          color={likedPosts.includes(news.key) ? 'blue' : 'grey'}
                          solid={likedPosts.includes(news.key)} // solid prop to control outline or solid icon
                        />
                        <Text>Like {news.likes}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleDislike(news.key)}>
                        <Icon
                          name="thumbs-down"
                          size={20}
                          color={dislikedPosts.includes(news.key) ? 'red' : 'grey'}
                          solid={dislikedPosts.includes(news.key)} // solid prop to control outline or solid icon
                        />
                        <Text>Dislike {news.dislikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleComment(news.key)}>
                <Icon name="comment" size={20} color={'red'} />
                <Text>Comment {news.commentCount}</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}

<CommentModal
        newsId={selectedNewsId}
        user={user}
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
      />
    </ScrollView>
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
    width:'100%',
    justifyContent: 'flex-start',
    alignItems: 'flext-start',
    marginTop: 22,
  },
  modalView: {
    flex:1,
    width:'100%',
    margin: 20,
    marginBottom:20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
   
  },
  modalHeader: {
    marginBottom: 15,
      color:'blue',
  
  },
  commentContainer: {
    //marginBottom: 10,
  },
  commentUsername: {
    fontWeight: 'bold',
   // marginBottom: 5,
    color:'#3eee'
  },
  commentText:{
    padding:10,
    color:'black'
  },
  commentButton:{
    flex:2,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'space-between'
  }
});

export default HomeScreen;
