import {Picker} from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

/**
 * InputBar
 * @param {string} text User input text.
 * @param {func} onChangeText function called when the text changed.
 * @param {string} unit User input unit.
 * @param {func} onUnitChange function called when the unit changed.
 * @param {func} onFocus function called when focused.
 * @param {func} onEndEdit function called when end edit.
 * @return {View} The input bar for user.
 */
export default function InputBar({
  text,
  onChangeText,
  unit,
  onUnitChange,
  onFocus,
  onEndEdit}) {
  return (
    <View style={styles.box}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="時間や距離を入力してください"
        keyboardType="numeric"
        onFocus={onFocus}
        onEndEditing={onEndEdit}
      />
      <Picker
        style={styles.picker}
        selectedValue={unit}
        onValueChange={onUnitChange}
      >
        <Picker.Item label="km" value="km" />
        <Picker.Item label="m" value="m" />
        <Picker.Item label="分" value="minutes" />
        <Picker.Item label="時" value="hours" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'black',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    margin: 10,
  },
  input: {
    flex: 8,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 2,
  },
  picker: {
    flex: 3,
    textAlign: 'center',
    marginRight: 5,
  },
});

InputBar.propTypes = {
  text: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onEndEdit: PropTypes.func,
};
