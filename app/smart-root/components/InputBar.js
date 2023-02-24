import {Picker} from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function InputBar({text, onChangeText, unit, onUnitChange}) {
  return (
    <View style={styles.box}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="分数や距離を入力してください"
        keyboardType="numeric"
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
    paddingVertical: 5,
  },
  input: {
    flex: 6,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    textAlign: 'center',
  },
  picker: {
    flex: 4,
    textAlign: 'center',
  },
});

InputBar.propTypes = {
  text: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  onUnitChange: PropTypes.func.isRequired,
};
