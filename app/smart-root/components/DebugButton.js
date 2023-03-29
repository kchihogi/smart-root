import * as FileSystem from 'expo-file-system';
// import PropTypes from 'prop-types';
// import {StyleSheet} from 'react-native';
import IconButton from './IconButton';
import {LOG} from '../config';

/**
 * App
 * @return {View} debug button with label.
 */
export default function DebugButton() {
  const onDebugPress = () => {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
        (files) => {
          files.forEach((element) => {
            const filePath = FileSystem.documentDirectory+element;
            LOG.info(filePath);
            FileSystem.readAsStringAsync(filePath).then(
                (content) => {
                  alert(content);
                },
            );
          });
        },
    );
  };

  return (
    <IconButton
      icon="build"
      label="Debug"
      onPress={onDebugPress}
    />
  );
}

// const styles = StyleSheet.create({
// });

// IconButton.propTypes = {
// };
