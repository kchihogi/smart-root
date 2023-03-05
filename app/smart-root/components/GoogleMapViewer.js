
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

  const [coordinates, setCoordinates] = useState([
    {latitude: 35.71972830204258, longitude: 139.3949006976562},
    {latitude: 35.72124244805374, longitude: 139.3969839350085},
    {latitude: 35.72199229601006, longitude: 139.3931971193054},
    {latitude: 35.72236721734171, longitude: 139.3899952588736},
    {latitude: 35.71945419466930, longitude: 139.3831424439336},
    {latitude: 35.71972830204258, longitude: 139.3949006976562},
  ]);

  const MAP_API_KEY = Platform.OS === 'android' ?
   Constants.manifest.android.config.googleMaps.apiKey :
   Constants.manifest.ios.config.googleMapsApiKey;

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

  const onMapDirStart = (params) => {
    console.log(`Started routing between "${params.origin}"and "${params.destination}"`);
  };

  const onMapDirReady = (result) => {
    console.log(`Distance: ${result.distance} km`);
    console.log(`Duration: ${result.duration} min.`);

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
        showsCompass={true}
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
