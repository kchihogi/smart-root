import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import IconButton from './IconButton';

/**
 * Footer
 * @param {func} onRefreshPress function when the refresh button pressed.
 * @param {func} onSavePress function when the save button pressed.
 * @param {func} onSettingsPress function when the settings button pressed.
 * @param {func} onOpenMapPress function when the open map button pressed.
 * @return {View} The footer view.
 */
export default function Footer(
    {
      onRefreshPress,
      onSavePress,
      onSettingsPress,
      onOpenMapPress,
    },
) {
  return (
    <View style={styles.box}>
      <IconButton icon="refresh" label="Refresh" onPress={onRefreshPress} />
      <IconButton icon="star" label="Save" onPress={onSavePress} />
      <IconButton icon="map" label="Open map" onPress={onOpenMapPress} />
      <IconButton icon="settings" label="Settings" onPress={onSettingsPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

Footer.propTypes = {
  onRefreshPress: PropTypes.func.isRequired,
  onSavePress: PropTypes.func.isRequired,
  onSettingsPress: PropTypes.func.isRequired,
  onOpenMapPress: PropTypes.func.isRequired,
};
