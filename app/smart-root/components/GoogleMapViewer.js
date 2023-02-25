// import PropTypes from 'prop-types';
import React from 'react';
import MapView from 'react-native-maps';
import {StyleSheet} from 'react-native';

/**
 * GoogleMapViewer
 * @return {View} Google Map.
 */
export default function GoogleMapViewer() {
  return (
    <MapView style={styles.map} />
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

// GoogleMapViewer.propTypes = {
// };
