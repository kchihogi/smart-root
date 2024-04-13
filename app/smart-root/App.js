// import Constants from 'expo-constants';
import React, {useState} from 'react';
import {Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-notifications';

import MainView from './components/MainView';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  const [showMainScreen, setShowMainScreen] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#000000" />
      {showMainScreen ? (
          <View>
            {/* <Button
              title="Go to Screen 2"
              onPress={() => setShowMainScreen(false)}
            /> */}
            <MainView/>
          </View>
      ) : (
        <View>
          <Text>Screen 2</Text>
          <Button
            title="Go to Screen 1"
            onPress={() => setShowMainScreen(true)}
          />
        </View>
      )}
      <Toast swipeEnabled={true} ref={(ref) => global['toast'] = ref} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
});
