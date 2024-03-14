import {Pressable, StyleSheet, Text} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

/**
 * App
 * @param {string} icon icon name.
 * @param {string} label label text for the icon.
 * @param {func} onPress function called when the botton pressed.
 * @return {View} icon button with label.
 */
export default function IconButton({icon, label, onPress}) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#fff" />
      <Text style={styles.iconButtonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonLabel: {
    color: '#fff',
    marginTop: 12,
  },
});

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

