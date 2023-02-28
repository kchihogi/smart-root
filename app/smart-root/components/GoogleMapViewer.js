import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import MapView,
{
  Marker,
} from 'react-native-maps';

/**
 * GoogleMapViewer
 * @param {LocationObject} location LocationObject.
 * @return {View} Google Map.
 */
export default function GoogleMapViewer({
  location}) {
  const initialRegion= {
    latitude: 35.689521,
    longitude: 139.691704,
    latitudeDelta: 0.0460,
    longitudeDelta: 0.0260,
  };

  console.log(location);

  if (location) {
    const region= {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0460,
      longitudeDelta: 0.0260,
    };
    console.log(region);
    return (
      <MapView style={styles.map}
        initialRegion={initialRegion}
        region={region}
      >
        <Marker coordinate={location.coords} />
      </MapView>
    );
  } else {
    return (
      <MapView style={styles.map}
        initialRegion={initialRegion}
        region={initialRegion}
      >
        <Marker coordinate={initialRegion} />
      </MapView>
    );
  }
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
