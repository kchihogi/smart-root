import PropTypes from 'prop-types';
import {Pressable, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

/**
 * CrossHairButton
 * @param {string} icon icon name.
 * @param {func} onPress function when the button pressed.
 * @return {Pressable} CrossHairButton.
 */
export default function CrossHairButton({icon, onPress}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={24} color="black" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 42,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    opacity: 0.7,
  },
});

CrossHairButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
