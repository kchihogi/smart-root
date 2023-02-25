import Constants from 'expo-constants';
import {StatusBar} from 'expo-status-bar';
import {useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Footer from './components/Footer';
import InputBar from './components/InputBar';
import GoogleMapViewer from './components/GoogleMapViewer';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('km');
  const [showFooter, setShowFooter] = useState(true);

  const onReset = () => {
    Keyboard.dismiss();
    setShowFooter(true);
  };

  const disableFooter = () => {
    setShowFooter(false);
  };

  return (
    <TouchableWithoutFeedback onPress={onReset}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <InputBar
            text={text}
            onChangeText={setText}
            unit={unit}
            onUnitChange={setUnit}
            onFocus={disableFooter}
          />
        </View>
        <View style={styles.mapContainer}>
          <GoogleMapViewer/>
        </View>
        {showFooter ? (
          <View style={styles.footerContainer}>
            <Footer/>
          </View>
        ) : (
          <View/>
        )}
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
    width: Dimensions.get('window').width,
    zIndex: 1,
    position: 'absolute',
    top: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
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
