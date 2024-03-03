import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import {useEffect, useState} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {ResponseType, useAuthRequest} from 'expo-auth-session';
import { UserInfo } from './UserInfo'
// import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

const discovery = {
  authorizationEndpoint: 
  "https://accounts.spotify.com/authorize",
  tokenEndpoint: 
  "https://accounts.spotify.com/api/token",
};
const LoginScreen = ({}) => {
  const navigation = useNavigation();
  // const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = 
  useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "98ddd400251d47abb23cccd2a97a60df",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      // In order to follow the "Authorization Code Flow" 
      // to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://192.168.1.69:8081/--/spotify-auth-callback",
    },
    discovery
  );

  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");
      console.log("access token", accessToken);
      console.log("expiration date", expirationDate);
  
      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // here the token is still valid
          navigation.replace("UserInfo");
        } else {
          // token has expired
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
    };
  
    checkTokenValidity();
  }, []);
  

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      console.log(token);
      const expirationDate = new Date(token.accessTokenExpirationDate).getTime();
      AsyncStorage.setItem("token", token);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.navigate("UserInfo")
    }
  });

  return (
    <LinearGradient colors={['#040306', '#131624']} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: 'center' }}
          name='spotify'
          size={80}
          color='white'
        />
        <Text
          style={{
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          {'PaceJams\n'}& Spotify
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          onPress={() => {
          promptAsync();
        }}
          style={{
            backgroundColor: '#1DB954',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>Sign In With Spotify</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
          }}
        >
          <MaterialIcons name='phone-android' size={24} color='white' />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Continue with phone number
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
          }}
        >
          <AntDesign name='google' size={24} color='red' />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Continue with Google
          </Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#131624',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            borderColor: '#C0C0C0',
            borderWidth: 0.8,
          }}
        >
          <AntDesign name='facebook-square' size={24} color='blue' />
          <Text
            style={{
              fontWeight: '500',
              color: 'white',
              textAlign: 'center',
              flex: 1,
            }}
          >
            Sign in with Facebook
          </Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
