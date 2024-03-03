import { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const UserInfo = ({ onComplete }) => {
    const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [formValues, setFormValues] = useState({
    height: '',
    gender: 'Male',
  });

  const handleUserInfoComplete = async (formValues, navigate) => {
    
    try {
      // Store formValues in AsyncStorage
      await AsyncStorage.setItem('userFormValues', JSON.stringify(formValues));
    //   onComplete(formValues); // Notify parent component
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error storing form values:', error);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.formLabel}>Height:</Text>
              <TextInput
                style={styles.input}
                placeholder='Height'
                onChangeText={(text) =>
                  setFormValues({ ...formValues, height: text })
                }
                value={formValues.height}
                keyboardType='numeric'
              />
              <Text style={styles.formLabel}>Gender:</Text>
              <Picker
                style={styles.picker}
                selectedValue={formValues.gender}
                onValueChange={(itemValue) =>
                  setFormValues({ ...formValues, gender: itemValue })
                }
              >
                <Picker.Item label='Male' value='Male' />
                <Picker.Item label='Female' value='Female' />
              </Picker>
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                handleUserInfoComplete(formValues);
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 50,
    backgroundColor: '#EBE4E3',
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
    height: 400,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 5,
    width: 200,
  },
  formLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
  },
  picker: {
    height: 20,
    width: 200,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
