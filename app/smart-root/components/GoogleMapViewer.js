
import Constants from 'expo-constants';
import PropTypes from 'prop-types';
import React, {useState, useRef} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import CrossHairButton from './CrossHairButton';

/**
 * GoogleMapViewer
 * @param {LocationObject} location LocationObject.
 * @return {View} Google Map.
 */
export default function GoogleMapViewer({
  location}) {
  const mapRef = useRef();
  const [region, setRegion] = useState({
    latitude: 35.689521,
    longitude: 139.691704,
    latitudeDelta: 0.0460,
    longitudeDelta: 0.0260,
  });
  const [followUser, setFollowUser] = useState(true);

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
    if (followUser) {
      const newRegion = event.nativeEvent.coordinate;
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

  const origin = {latitude: 35.689521, longitude: 139.691704};
  const destination = {latitude: 35.71968474925, longitude: 139.39490069765};
  const MAP_API_KEY = Platform.OS === 'android' ?
   Constants.manifest.android.config.googleMaps.apiKey :
   Constants.manifest.ios.config.googleMapsApiKey;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView ref={mapRef} style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        mapType='standard'
        userInterfaceStyle='light'
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        onRegionChange={onRegionChange}
        onUserLocationChange={onUserLocationChange}
        onPanDrag={onPanDrag}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={MAP_API_KEY}
        />
      </MapView>
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
});

GoogleMapViewer.propTypes = {
  location: PropTypes.object,
};
