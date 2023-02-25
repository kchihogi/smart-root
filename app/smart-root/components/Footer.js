import {
  StyleSheet,
  View,
} from 'react-native';

import IconButton from './IconButton';

const onReset = () => {
  //
};

/**
 * Footer
 * @return {View} The footer view.
 */
export default function Footer() {
  return (
    <View style={styles.box}>
      <IconButton icon="refresh" label="Refresh" onPress={onReset} />
      <IconButton icon="star" label="Save" onPress={onReset} />
      <IconButton icon="settings" label="Settings" onPress={onReset} />
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

