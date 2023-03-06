import Constants from 'expo-constants';
import * as Location from 'expo-location';
import {StatusBar} from 'expo-status-bar';
import {useState, useEffect} from 'react';
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
import GoogleMapViewer from './components/GoogleMapViewer';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  const [showFooter, setShowFooter] = useState(true);
  const [userLocation, setUserLocation] = useState(true);
  const [coordinates, setCoordinates] = useState([]);
  const [rootResult, setRootResult] = useState();
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('km');

  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation(null);
        return;
      }
    })();
  }, []);

  const onReset = () => {
    Keyboard.dismiss();
    setShowFooter(true);
  };

  const disableFooter = () => {
    setShowFooter(false);
  };

  const onRefreshPress = () => {
    console.log('onRefreshPress');
    console.log(`inputVal: ${text}`);
    console.log(`inputUnit: ${unit}`);
    console.log(userLocation);
    setCoordinates(
        [
          {latitude: userLocation.latitude, longitude: userLocation.longitude},
          {
            latitude: (userLocation.latitude + 0.001),
            longitude: (userLocation.longitude + 0.001),
          },
          {
            latitude: (userLocation.latitude - 0.001),
            longitude: (userLocation.longitude + 0.001),
          },
          {
            latitude: (userLocation.latitude + 0.001),
            longitude: (userLocation.longitude - 0.001),
          },
          {
            latitude: (userLocation.latitude - 0.001),
            longitude: (userLocation.longitude - 0.001),
          },
          {latitude: userLocation.latitude, longitude: userLocation.longitude},
        ],
    );
  };

  const onSavePress = () => {
    console.log('onSavePress');
    console.log(coordinates);
    console.log(`Distance: ${rootResult.distance} km`);
    console.log(`Duration: ${rootResult.duration} min.`);
    console.log(rootResult);
  };

  const onSettingsPress = () => {
  };

  return (
    <TouchableWithoutFeedback onPress={onReset}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mapContainer}>
          <GoogleMapViewer
            inputVal={text}
            setInputVal={setText}
            inputUnit={unit}
            setInputUnit={setUnit}
            coordinates={coordinates}
            setUserLocation={setUserLocation}
            setRootResult={setRootResult}
            onInputFocus={disableFooter}
          />
        </View>
        {showFooter ? (
          <View style={styles.footerContainer}>
            <Footer
              onRefreshPress={onRefreshPress}
              onSavePress={onSavePress}
              onSettingsPress={onSettingsPress}
            />
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
  mapContainer: {
    flex: 9,
    width: Dimensions.get('window').width,
    backgroundColor: '#FAA030',
  },
  footerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#32B76C',
  },
});
