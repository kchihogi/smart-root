import {Pressable, StyleSheet} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

/**
 * App
 * @param {string} icon icon name.
 * @param {func} onPress function called when the botton pressed.
 * @return {View} icon button with label.
 */
export default function NoLabelIconButton({icon, onPress}) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={20} color="#000" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

NoLabelIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

