import Constants from 'expo-constants';
import {StatusBar} from 'expo-status-bar';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

/**
 * App
 * @return {View} The main screen of the app.
 */
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}></View>
      <View style={styles.mapContainer}></View>
      <View style={styles.footerContainer}></View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  inputContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  mapContainer: {
    flex: 10,
    width: Dimensions.get('window').width,
  },
  footerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
