import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState([]);
  const [recommendedSongs,setRecommendedSongs] = useState([]);
  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return 'Good Morning';
    } else if (currentTime < 16) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  const message = greetingMessage();
  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  console.log(userProfile);

  const logoURL =
    userProfile.images && userProfile.images.length > 0
      ? userProfile.images[0].url
      : null;

  const getRecommendedSongs = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/recommendations?limit=100&market=US&seed_genres=rock',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      const tracks = response.data;
      setRecommendedSongs(tracks);

    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getRecommendedSongs();
  },[])

  console.log("recommendedSongs", recommendedSongs);

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {logoURL && (
              <Image
                source={{ uri: logoURL }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            )}
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {message}
            </Text>
          </View>
        </View>
        <View
           style={{
                 paddingTop:40,
                }}
                >
          <Pressable>
            <LinearGradient colors={['#33006F', '#FFFFFF']} style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
              <Pressable
                style={{
                  height: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                   style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: "white",
                }}
                >
                Search Songs
                </Text>
              </Pressable>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
