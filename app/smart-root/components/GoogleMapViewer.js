
import Constants from 'expo-constants';
import PropTypes from 'prop-types';
import React, {useState, useRef} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import CrossHairButton from './CrossHairButton';
import InputBar from './InputBar';
import {LOG} from '../config';

/**
 * GoogleMapViewer
 * @param {text} inputVal input bar text
 * @param {func} setInputVal set input bar text
 * @param {text} inputUnit input bar text
 * @param {func} setInputUnit set input bar unit
 * @param {array} coordinates coordinates of root
 * @param {func} setUserLocation set user location
 * @param {func} setRootResult set result of Direction API
 * @param {func} onInputFocus function when the InputBar focused.userLocation
 * @return {View} Google Map.
 */
export default function GoogleMapViewer({
  inputVal,
  setInputVal,
  inputUnit,
  setInputUnit,
  coordinates,
  setUserLocation,
  setRootResult,
  onInputFocus}) {
  const mapRef = useRef();
  const [region, setRegion] = useState({
    latitude: 35.689521,
    longitude: 139.691704,
    latitudeDelta: 0.0460,
    longitudeDelta: 0.0260,
  });
  const [followUser, setFollowUser] = useState(true);

  let MAP_API_KEY = '';
  if (Platform.OS === 'android') {
    LOG.debug('android');
    MAP_API_KEY = Constants.manifest.extra.googleMaps.android.apiKey;
  } else {
    LOG.debug('ios');
    MAP_API_KEY = Constants.manifest.extra.googleMaps.ios.apiKey;
  };
  LOG.debug(MAP_API_KEY);

  const onRegionChange = (region) => {
    const lat = region.latitudeDelta;
    const lon = region.longitudeDelta;
    setRegion((region) => ({
      ...region,
      latitudeDelta: lat,
      longitudeDelta: lon,
    }));
  };

  const onPressCrossHairButton = () => {
    setFollowUser(true);
  };

  const onUserLocationChange = (event) => {
    const newRegion = event.nativeEvent.coordinate;
    setUserLocation(newRegion);
    if (followUser) {
      setRegion((region) => ({
        ...region,
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      }));
      mapRef.current.animateToRegion(region, 500);
    }
  };

  const onPanDrag = () => {
    setFollowUser(false);
  };

  const onMapDirStart = (params) => {
  };

  const onMapDirReady = (result) => {
    setRootResult(result);
    mapRef.current.fitToCoordinates(
        result.coordinates,
        {animated: true},
    );
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView ref={mapRef} style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        mapType='standard'
        userInterfaceStyle='light'
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onRegionChange={onRegionChange}
        onUserLocationChange={onUserLocationChange}
        onPanDrag={onPanDrag}
      >
        {(coordinates.length >= 2) && (
          <MapViewDirections
            origin={coordinates[0]}
            waypoints={
              (coordinates.length > 2) ? coordinates.slice(1, -1): undefined
            }
            destination={coordinates[coordinates.length-1]}
            apikey={MAP_API_KEY}
            language='ja'
            mode='WALKING'
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={onMapDirStart}
            onReady={onMapDirReady}
          />
        )}
      </MapView>
      <View style={styles.inputContainer}>
        <InputBar
          text={inputVal}
          onChangeText={setInputVal}
          unit={inputUnit}
          onUnitChange={setInputUnit}
          onFocus={onInputFocus}
        />
      </View>
      <View style={{position: 'absolute', right: '2%', bottom: '1%'}}>
        <CrossHairButton
          followUser={followUser}
          onPress={onPressCrossHairButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '100%',
    position: 'absolute',
  },
});

GoogleMapViewer.propTypes = {
  inputVal: PropTypes.string,
  setInputVal: PropTypes.func,
  inputUnit: PropTypes.string,
  setInputUnit: PropTypes.func,
  coordinates: PropTypes.array,
  setUserLocation: PropTypes.func,
  setRootResult: PropTypes.func,
  onInputFocus: PropTypes.func,
};
