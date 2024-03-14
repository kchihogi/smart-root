import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import PropTypes from 'prop-types';

const CustomButton = (props) => {
  const {onPress, title, buttonStyle, textStyle} = props;
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

CustomButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

CustomButton.defaultProps = {
  buttonStyle: {},
  textStyle: {},
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#32B76C',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CustomButton;
