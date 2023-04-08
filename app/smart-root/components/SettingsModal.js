import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import CustomButton from './CustomButton';

const SettingSlider = ({value, onValueChange}) => {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        value={value}
        minimumValue={70}
        maximumValue={90}
        step={1}
        onValueChange={onValueChange}
        style={styles.slider}
        thumbTintColor="#ff5c5c"
        minimumTrackTintColor="#ff5c5c"
      />
      <Text style={styles.sliderValue}>{value} m/min</Text>
    </View>
  );
};

SettingSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const SettingListItem = ({title, value, onValueChange}) => {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      <SettingSlider value={value} onValueChange={onValueChange} />
    </View>
  );
};

SettingListItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const SettingsModal = ({isVisible, onClose, walkSpeed, onWalkSpeedChange}) => {
  const handleWalkSpeedChange = async (value) => {
    onWalkSpeedChange(value);
    await AsyncStorage.setItem('walkSpeed', value.toString());
  };

  return (
    <Modal animationType="slide" visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <SettingListItem
          title="Walk Speed"
          value={walkSpeed}
          onValueChange={handleWalkSpeedChange}
        />
        <CustomButton
          title="Apply"
          onPress={onClose}
          buttonStyle={styles.applyButton}
          textStyle={styles.applyButtonText}
        />
      </View>
    </Modal>
  );
};

SettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  walkSpeed: PropTypes.number.isRequired,
  onWalkSpeedChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    marginBottom: 30,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    marginTop: 10,
  },
  slider: {},
  sliderValue: {
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  applyButton: {
    alignSelf: 'flex-end',
  },
  applyButtonText: {
    textAlign: 'center',
  },
});

export default SettingsModal;
