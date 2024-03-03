import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [genre, setGenre] = useState('Rock');
  const [minMile, setMinMile] = useState('5');

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
    const userInfo = await AsyncStorage.getItem('userFormValues');
    console.log('UserInfo>>>',userInfo);
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/recommendations?limit=100&market=US&seed_genres=rock',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data;
      setRecommendedSongs(tracks);
    } catch (err) {
      console.log(err.message);
    }
  };

  // const getUserInfo = async () => {
  //   const userInfo = await AsyncStorage.getItem('userFormValues');
  //   console.log('UserInfo', userInfo);
  // };

  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  console.log('recommendedSongs', recommendedSongs);

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
        <View style={styles.container}>
          <Text style={styles.label}>Genre:</Text>
          <Picker
            selectedValue={genre}
            style={styles.picker}
            onValueChange={(itemValue) => setGenre(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label='Rock' value='Rock' />
            <Picker.Item label='Pop' value='Pop' />
            <Picker.Item label='Alternative' value='Alternative' />
            <Picker.Item label='Country' value='Country' />
            <Picker.Item label='Rap' value='Rap' />
          </Picker>

          <Text style={styles.label}>Min/Mile:</Text>
          <Picker
            selectedValue={minMile}
            style={styles.picker}
            onValueChange={(itemValue) => setMinMile(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label='5' value='5' />
            <Picker.Item label='6' value='6' />
            <Picker.Item label='7' value='7' />
            <Picker.Item label='8' value='8' />
            <Picker.Item label='9' value='9' />
            <Picker.Item label='10' value='10' />
            <Picker.Item label='11' value='11' />
            <Picker.Item label='12' value='12' />
            <Picker.Item label='13' value='13' />
            <Picker.Item label='14' value='14' />
            <Picker.Item label='15' value='15' />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={getRecommendedSongs}>
            <Text style={styles.buttonText}>Search Songs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    margin: 20,
    color: 'white'
  },
  picker: {
    backgroundColor: 'blue',
    width: '70%',
    borderRadius: 10,
    // height: 40,
    // marginBottom: 20,
  },
  pickerItem: {
    borderRadius: 10,
    color: 'white',
    // height: 40,
    // marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
