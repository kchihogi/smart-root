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
 * @return {View} The footer view.
 */
export default function Footer({onRefreshPress, onSavePress, onSettingsPress}) {
  return (
    <View style={styles.box}>
      <IconButton icon="refresh" label="Refresh" onPress={onRefreshPress} />
      <IconButton icon="star" label="Save" onPress={onSavePress} />
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
};
