import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {LOG} from '../config';
import Footer from './Footer';
import GoogleMapViewer from './GoogleMapViewer';
import SettingsModal from './SettingsModal';

/**
 * MainView
 * @return {View} The main screen of the app.
 */
export default function MainView() {
  const [showFooter, setShowFooter] = useState(true);
  const [userLocation, setUserLocation] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [rootResult, setRootResult] = useState();
  const [text, setText] = useState('');
  const [unit, setUnit] = useState('minutes');
  const [isModalVisible, setModalVisible] = useState(false);
  const [walkSpeed, setWalkSpeed] = useState(80);

  useEffect(() => {
    if (null != rootResult) {
      let distMeg = '';
      let unitDistMsg = '';
      if (rootResult.distance < 1) {
        distMeg = (rootResult.distance * 1000).toFixed(0);
        unitDistMsg = 'm';
      } else {
        distMeg = (rootResult.distance).toFixed(1);
        unitDistMsg = 'km';
      }
      let timeMeg = '';
      let unitTimeMsg = '';
      if (rootResult.duration >= 60) {
        timeMeg = (rootResult.duration/60).toFixed(1);
        unitTimeMsg = '時間';
      } else {
        timeMeg = (rootResult.duration).toFixed(0);
        unitTimeMsg = '分間';
      }

      let message = `ルートが見つかりました。\r\n`;
      message += `距離は${distMeg}${unitDistMsg}。時間は${timeMeg}${unitTimeMsg}。`;
      toast.show(message, {
        type: 'normal',
        duration: 5000,
      });
      LOG.info(`Distance: ${rootResult.distance} km.`);
      LOG.info(`Duration: ${rootResult.duration} min.`);
    }
    (async () => {
      const savedWalkSpeed = await AsyncStorage.getItem('walkSpeed');
      if (savedWalkSpeed) {
        setWalkSpeed(parseInt(savedWalkSpeed));
      }
    })();
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        LOG.error('Permission to access location was denied');
        setUserLocation(null);
        return;
      }
    })();

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isModalVisible) {
            setModalVisible(false);
            return true;
          }
          return false;
        },
    );
    return () => BackHandler.removeEventListener(
        'hardwareBackPress', backHandler,
    );
  }, [rootResult, isModalVisible]);

  const onReset = () => {
    Keyboard.dismiss();
    setShowFooter(true);
  };

  const disableFooter = () => {
    setShowFooter(false);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onRefreshPress = () => {
    LOG.info('onRefreshPress');
    const walkSpeedInMinutePerMeter = walkSpeed;
    const points = 8;
    const lanLonList = [];
    LOG.debug(`walkSpeedInMinutePerMeter: ${walkSpeedInMinutePerMeter}`);
    LOG.debug(`inputVal: ${text}`);
    LOG.debug(`inputUnit: ${unit}`);
    LOG.debug(userLocation);
    const num = parseFloat(text);
    if (isNaN(num)) {
      LOG.warn(`failed to parse ${text}`);
      toast.show('時間や距離を入力してください。', {
        type: 'warning',
        duration: 3000,
      });
      return;
    }

    let timeInMinute = 0;
    let distanceInMeter = 0;
    if (unit == 'km' || unit == 'm') {
      if (unit == 'km') {
        distanceInMeter = num * 1000;
      } else {
        distanceInMeter = num;
      }
      if ((distanceInMeter < 500) | (distanceInMeter > 300 * 1000)) {
        LOG.warn(`distanceInMeter within valid range. ${distanceInMeter}`);
        toast.show('500m-300kmの範囲で指定してください。', {
          type: 'warning',
          duration: 3000,
        });
        return;
      }
    } else {
      if (unit == 'hours') {
        timeInMinute = num * 60;
      } else {
        timeInMinute = num;
      }
      if ((timeInMinute < 10) | (timeInMinute > 60 * 12)) {
        LOG.warn(`timeInMinute within valid range. ${timeInMinute}`);
        toast.show('10分-12時間の範囲で指定してください。', {
          type: 'warning',
          duration: 3000,
        });
        return;
      }
      distanceInMeter = timeInMinute * walkSpeedInMinutePerMeter;
    }

    LOG.debug(`distanceInMeter:${distanceInMeter}`);
    const lengthOfSide = distanceInMeter/(points -1);
    const maxDistance = lengthOfSide/(2*Math.sin(Math.PI/(points -1)));
    LOG.debug(`maxDistance:${maxDistance}`);

    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    const maxDistanceDegrees = maxDistance / 111319;
    for (let i = 0; i < (points-2); i++) {
      const r = maxDistanceDegrees * Math.sqrt(Math.random());
      const theta = Math.random() * 2.0 * Math.PI;
      const lat = userLocation.latitude + (r * Math.cos(theta));
      const lng = userLocation.longitude + (r * Math.sin(theta));
      lanLonList.push({latitude: lat, longitude: lng});
    }
    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    setCoordinates(lanLonList);
    setShowRoute(true);
  };

  const onSavePress = () => {
    LOG.info('onSavePress');
  };

  const onSettingsPress = () => {
    LOG.info('onSettingsPress');
    handleModalOpen();
  };

  const onOpenMapPress = () => {
    LOG.info('onOpenMapPress');
    if (null != rootResult) {
      LOG.debug(coordinates);
      if (coordinates.length >= 2) {
        let url = `https://www.google.com/maps/dir/?api=1`;
        url += `&origin=${coordinates[0].latitude}`;
        url += `%2C${coordinates[0].longitude}`;
        let waypoints='';
        for (let i = 0; i < rootResult.waypointOrder[0].length; i++) {
          waypoints += `${coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].latitude}`;
          waypoints += `%2C${ coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].longitude}|`;
        }
        waypoints=waypoints.substring(0, waypoints.length-1);
        url += `&waypoints=${waypoints}`;
        url += `&destination=${coordinates[coordinates.length-1].latitude}`;
        url += `%2C${coordinates[coordinates.length-1].longitude}`;
        LOG.debug(url);
        Linking.openURL(url);
      }
    } else {
      toast.show('Route meボタンを押してルートを表示してください。', {
        type: 'warning',
        duration: 3000,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onReset}>
      <View style={styles.container}>
        <SettingsModal
          isVisible={isModalVisible}
          onClose={handleModalClose}
          walkSpeed={walkSpeed}
          onWalkSpeedChange={setWalkSpeed}
          onRequestClose={handleModalClose}
        />
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
            onInputEndEdit={onReset}
            onSettingsPress={onSettingsPress}
          />
        </View>
        {showFooter ? (
          <View style={styles.footerContainer}>
            <Footer
              isRouteShown={showRoute}
              onRefreshPress={onRefreshPress}
              onSavePress={onSavePress}
              onOpenMapPress={onOpenMapPress}
            />
          </View>
        ) : (
          <View/>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
