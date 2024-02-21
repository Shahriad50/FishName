import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { auth } from '@react-native-firebase/auth';
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [newsArray, setNews] = useState([]);

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

  // Helper function to set up real-time listeners for likes, dislikes, and comments
  const setUpListeners = (newsId) => {
    const documentRef = firestore().collection('newsfeed').doc(newsId);

    // Likes listener
    const likesListener = documentRef.onSnapshot((doc) => {
      const likesCount = doc.data()?.likes || 0;
      setNews((prevNews) =>
        prevNews.map((news) =>
          news.key === newsId ? { ...news, likes: likesCount } : news
        )
      );
    });

    // Dislikes listener
    const dislikesListener = documentRef.onSnapshot((doc) => {
      const dislikesCount = doc.data()?.dislikes || 0;
      setNews((prevNews) =>
        prevNews.map((news) =>
          news.key === newsId ? { ...news, dislikes: dislikesCount } : news
        )
      );
    });

    // Comments listener (if needed)
    // const commentsListener = documentRef.collection('comments').onSnapshot(...);

    return () => {
      likesListener();
      dislikesListener();
      // commentsListener(); // Unsubscribe comments listener if used
    };
  };

  const handleLike = async (newsId) => {
    const userId = auth().currentUser.uid;

  // Check if the user has already liked the post
  const likedRef = firestore().collection('newsfeed').doc(newsId).collection('likes').doc(userId);
  const likedDoc = await likedRef.get();

  if (!likedDoc.exists) {
    // If not liked, update the likes count and add the user to the likes subcollection
    await firestore().collection('newsfeed').doc(newsId).update({
      likes: firestore.FieldValue.increment(1),
    });

    await likedRef.set({
      timestamp: new Date(),
    });
  } else {
    // User has already liked the post, handle accordingly
    console.log('User has already liked this post.');
  }
  };

  const handleDislike = async (newsId) => {
    const userId = auth().currentUser.uid;

  // Check if the user has already disliked the post
  const dislikedRef = firestore().collection('newsfeed').doc(newsId).collection('dislikes').doc(userId);
  const dislikedDoc = await dislikedRef.get();

  if (!dislikedDoc.exists) {
    // If not disliked, update the dislikes count and add the user to the dislikes subcollection
    await firestore().collection('newsfeed').doc(newsId).update({
      dislikes: firestore.FieldValue.increment(1),
    });

    await dislikedRef.set({
      timestamp: new Date(),
    });
  } else {
    // User has already disliked the post, handle accordingly
    console.log('User has already disliked this post.');
  }
  };

  const handleComment = async (newsId) => {
    // Add a comment to Firestore
    await firestore().collection('newsfeed').doc(newsId).collection('comments').add({
      text: 'New comment',
      timestamp: new Date(),
    });
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
                <Icon name="thumbs-up" size={20} color={'blue'}></Icon>
                <Text>{news.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDislike(news.key)}>
                <Icon name="thumbs-down" size={20} color={'red'}></Icon>
                <Text>{news.dislikes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleComment(news.key)}>
                <Icon name="comment" size={20} color={'red'}></Icon>
                <Text>{news.comments}</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}
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
});

export default Home;
