import Constants from 'expo-constants';
import {StatusBar} from 'expo-status-bar';
import {useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import InputBar from './components/InputBar';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('km');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <InputBar
            text={text}
            onChangeText={setText}
            unit={unit}
            onUnitChange={setUnit}
          />
        </View>
        <View style={styles.mapContainer}>
          <Text>{text}</Text>
          <Text>{unit}</Text>
        </View>
        <View style={styles.footerContainer}></View>
        <StatusBar style="light" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  inputContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#EE2C38',
  },
  mapContainer: {
    flex: 10,
    width: Dimensions.get('window').width,
    backgroundColor: '#FAA030',
  },
  footerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#32B76C',
  },
});
