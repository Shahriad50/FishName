import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity,Dimensions, ActivityIndicator, Modal, TextInput, Button,FlatList,Image } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../AuthContext';
import CustomInput from '../../../components/CustomInput';
import { WebView } from 'react-native-webview';
import styles from './App.sass'; 
import { gsap, Back,Power2, Elastic, AutoKillTweens } from 'gsap-rn';
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
        <View style={styles.modalview}>
          <View style={styles.modalheader}>
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
          <View style={{
            padding:30,
            gap:10,
            flexDirection:'row',
            justifyContent:'space-between',
           // alignItems:'center',
          }}>
           
          <Button
           title="Close"
           onPress={onClose}
         />
          <Button
            title="Comment"
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Number of posts per page


  const ref = useRef(null);
  const loadingDot = useRef([]);
  const tl = useRef(null);

 
  useEffect(() => {
    AutoKillTweens.tweensOf(tl.current);
    tl.current = gsap.timeline();
    tl.current.to(loadingDot.current, {
      duration: 1,
      transform: { y: -100, scale: 0.8 },
      ease: Power2.easeInOut,
      stagger: { amount: 0.3 },
      repeat:-1,
      delay:0.1,
      yoyo: true
    });
    tl.current.to(loadingDot.current, {
      duration: 0.3,
      transform: { y: 0, scale: 1 },
      ease: Elastic.easeOut,
      stagger: { amount: 0.3 },
      repeat:-1,
      delay:0.1,
      yoyo: true,
    });

    return()=> tl.revert();
  }, []);
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  useEffect(() => {
    let subscriber;
    const fetchData = async () => {
      subscriber = firestore()
        .collection('newsfeed')
        .onSnapshot(async (querySnapshot) => {
          const newsArray = [];

         for (const doc of querySnapshot.docs) {
            const newsData = doc.data();
            const userDoc = await firestore().collection('users').doc(newsData.uid).get();
            const userData = userDoc.data();

            newsArray.push({
              ...newsData,
              key: doc.id,
              user: userData, // Store user details in the news item
            });
          }


          setNews(newsArray);
          setLoading(false);
        });
    };
    fetchData();

    // Unsubscribe from events when no longer in use
    return () => subscriber?.();
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
  
  
  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AutoKillTweens tweens={tl.current} />
        <Text>Loading</Text>
        <View style={{ flexDirection: "row" }}>
         
          {[...Array(3)].map((_, i) => (
            <View key={i} ref={ref => (loadingDot.current[i] = ref)} style={styles.dots} />
          ))}
        </View>
       
      </View>
     )}
       <FlatList
        data={newsArray.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)}
        renderItem={({ item: news }) => {
          const newsUser = news ? news.user : null;
          const isYoutubeLink = news?.content?.startsWith('https://www.youtube.com/');
          return (
            <Card key={news?.id} style={styles.card}>
              <Card.Title  style={{fontWeight:'bold'}}
                title={newsUser ? newsUser.username : "undefined"}
                subtitle="new user"
                left={() => {newsUser&& newsUser ? <Avatar.Image source={{ uri: newsUser.profileImageUri }} size={40}/>:<Avatar.Image source={{ uri: 'https://example.com/avatar2.jpg' }} size={40}/>}}
                />
                {news.photo && <Card.Cover source={{ uri: news.photo }} />}
               <Card.Content>
                 <Title style={styles.title}>{news?.title}</Title>
                 <Paragraph>{isYoutubeLink ? null : news?.content}</Paragraph>
                <View style={styles.buttonsContainer}>

                <TouchableOpacity onPress={() => handleLike(news?.key)}>
                            <Icon
                              name="thumb-up"
                              size={20}
                              color={likedPosts.includes(news?.key) ? 'blue' : 'grey'}
                              solid={likedPosts.includes(news?.key)} // solid prop to control outline or solid icon
                            />
                            <Text>Like {news?.likes}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleDislike(news?.key)}>
                            <Icon
                              name="thumb-down"
                              size={20}
                              color={dislikedPosts.includes(news?.key) ? 'red' : 'grey'}
                              solid={dislikedPosts.includes(news?.key)} // solid prop to control outline or solid icon
                            />
                            <Text>Dislike {news?.dislikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleComment(news?.key)}>
                      <Icon name="comment" size={20} color={'red'} />
                      <Text>Comment {news?.commentCount}</Text>
                </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          );
        }}
        keyExtractor={(item) => item?.id}
      />
    
<CommentModal
        newsId={selectedNewsId}
        user={user}
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
      />
      
      {!loading &&
      <View style={styles.pagination}>
      <TouchableOpacity
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
        style={[styles.paginationButton, currentPage === 1 && { opacity: 0.0 }]}
      >
      <Text style={styles.paginationButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={styles.pageNumber}>{currentPage}</Text>
      <TouchableOpacity
        onPress={handleNextPage}
        disabled={currentPage === Math.ceil(newsArray.length / postsPerPage)}
        style={[styles.paginationButton, currentPage === Math.ceil(newsArray.length / postsPerPage) && { opacity: 0.5 }]}
      >
        <Text style={styles.paginationButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
}
    </ScrollView>
  );
};



  

export default HomeScreen;
