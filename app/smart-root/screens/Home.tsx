//React/React-Native
import * as React from 'react';
import { Alert } from 'react-native';

//Expo
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

//Gluestack
import { 
  ButtonText, Box,
  ChevronDownIcon, CloseIcon,
  HStack,
  Icon,
  Input,InputField,
  Pressable,
  Toast, ToastDescription, ToastTitle,
  VStack,
  Center,
  Select,SelectBackdrop,SelectContent,SelectDragIndicator,SelectDragIndicatorWrapper,SelectIcon,SelectInput,SelectItem,SelectPortal,SelectTrigger,
  Button,
} from '@gluestack-ui/themed';
import { useToast } from '@gluestack-ui/themed';

//External libraries
import { CircleX, Footprints, Locate, LocateFixed, Star, Map, PencilRuler } from 'lucide-react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

//Internal components
import { FooterButton } from '../components/FooterButton';
import { toConvexHullLatLngs, isInsidePolygon } from '../utils/calcHull';
import { useTheme } from '../hooks/ThemeContext';

export default function HomeScreen({ navigation }: any) {
  const toast = useToast()
  const mapRef = React.useRef();
  const mapEventIndex = React.useRef(0);
  const { theme } = useTheme();

  //useState
  const [userLocation, setUserLocation] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState([]);
  const [rootResult, setRootResult] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [inputUnit, setInputUnit] = React.useState('minutes');
  const [isInputValid, setIsInputValid] = React.useState(true);
  const [followUser, setFollowUser] = React.useState(true);
  const [handDrawingMode, setHandDrawingMode] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: 35.689521,
    longitude: 139.691704,
    latitudeDelta: 0.0460,
    longitudeDelta: 0.0260,
  });
  const [markers, setMarkers] = React.useState([]);
  const [coordinatesByDraw, setCoordinatesByDraw] = React.useState([]);
  const [requestCoordinates, setRequestCoordinates] = React.useState<LatLng[]>([]);

  //useEffect
  React.useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need location permissions to make this work!');
        return;
      }
    })();
  }, []);

  React.useEffect(() => {
    if (null != rootResult) {
      let distMeg = '';
      let unitDistMsg = '';
      if (rootResult.distance < 1) {
        distMeg = (rootResult.distance * 1000).toFixed(0);
        unitDistMsg = 'm';
      } else {
        distMeg = (rootResult.distance).toFixed(1);
        unitDistMsg = 'km';
      }
      let timeMeg = '';
      let unitTimeMsg = '';
      if (rootResult.duration >= 60) {
        timeMeg = (rootResult.duration/60).toFixed(1);
        unitTimeMsg = '時間';
      } else {
        timeMeg = (rootResult.duration).toFixed(0);
        unitTimeMsg = '分間';
      }

      let title = `ルートが見つかりました。`;
      let message = `距離は${distMeg}${unitDistMsg}。時間は${timeMeg}${unitTimeMsg}。`;

      toast.show({
        placement:"bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast bg="$info700" nativeID={toastId} p="$3">
              <VStack space="xs">
                <ToastTitle color="$textLight50">
                  {title}
                </ToastTitle>
                <ToastDescription color="$textLight50">
                  {message}
                </ToastDescription>
              </VStack>
              <Pressable mt="$1" onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} color="$coolGray50" />
              </Pressable>
            </Toast>
          );
        },
      });
    }
  }, [rootResult]);

  const onRegionChange = React.useCallback((newRegion) => {
    if (mapEventIndex.current % 20 !== 0) {
      return;
    }

    const { latitudeDelta, longitudeDelta } = newRegion;

    // Prevent unnecessary state updates
    setRegion((prevRegion) => {
      if (
        prevRegion.latitudeDelta !== latitudeDelta ||
        prevRegion.longitudeDelta !== longitudeDelta
      ) {
        return {
          ...prevRegion,
          latitudeDelta,
          longitudeDelta,
        };
      }
      return prevRegion;
    });
  }, []);

const onUserLocationChange = (event : any) => {
  const newRegion = event.nativeEvent.coordinate;
  setUserLocation(newRegion);
  if (followUser) {
    setRegion((region) => ({
      ...region,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    }));
    mapRef.current.animateToRegion(region, 500);
  }
};

  const handleDraw = React.useCallback((event: any) => {
    const { coordinate } = event.nativeEvent;
    setCoordinatesByDraw((prev) => [...prev, coordinate]);
    onPanDragEnd([...coordinatesByDraw, coordinate]);
  }, [coordinatesByDraw]);

  const onPanDrag = (event : any) => {
    setFollowUser(false);
    if (handDrawingMode) {
      mapEventIndex.current++;
      if (mapEventIndex.current % 5 === 0) {
        handleDraw(event);
      }
    }
  };

  const debounce = <T extends (...args: any[]) => unknown>(
    callback: T,
    delay = 250,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number // Node.jsの場合はNodeJS.Timeout型にする
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => callback(...args), delay)
    }
  }

  const onPanDragEnd = React.useCallback(
    debounce((polygonCoordinates: LatLng[]) => {
      // 始点と終点を結ぶ

      const polygonsCoordinatesConnectingStartAndEndPoints = [
        ...polygonCoordinates,
        polygonCoordinates[0],
      ];

      const convexHullLatLngs = toConvexHullLatLngs(
        polygonsCoordinatesConnectingStartAndEndPoints
      );
      setRequestCoordinates(convexHullLatLngs);
      setCoordinatesByDraw([]);
    }, 500), // delay を 500ms に指定
    []
  );

  const onLongPress = (event : any) => {
    let maxMarkers = 4;
    if (markers.length >= maxMarkers) {
      while (markers.length >= maxMarkers) {
        markers.shift();
      }
    }
    const newMarker = {
      latlng: event.nativeEvent.coordinate
    };
    setMarkers([...markers, newMarker]);
    if (requestCoordinates.length) {
      const isInside = isInsidePolygon(
        event.nativeEvent.coordinate,
        requestCoordinates
      );
      if (isInside) {
        Alert.alert('You are inside the polygon');
      } else {
        Alert.alert('You are outside the polygon');
      }
    }
  };

  const onMarkerPress = (event : any) => {
    let id = parseInt(event.nativeEvent.id);
    let newMarkers = markers.filter((marker, index) => index !== id);
    setMarkers(newMarkers);
    setFollowUser(false);
  }

  const onPressCrossHairButton = () => {
    setFollowUser(true);
    Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High}).then((location) => {
      setUserLocation(location.coords);
      setRegion((region) => ({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      mapRef.current.animateToRegion(region, 500);
    });
  };

  const onChangeInputValue = (text : string) => {
    //check if the input is only numbers
    if (!/^\d+$/.test(text)) {
      setIsInputValid(false);
      return;
    }
    setInputValue(text);
    setIsInputValid(true);
  }

  const onPressRouteMeButton = () => {
    const walkSpeedInMinutePerMeter = 80;
    const points = 8;
    const lanLonList = [];
    const num = parseFloat(inputValue);
    const unit = inputUnit;
    if (isNaN(num)) {
      Alert.alert('時間や距離を入力してください。');
      return;
    }

    let timeInMinute = 0;
    let distanceInMeter = 0;
    if (unit == 'km' || unit == 'm') {
      if (unit == 'km') {
        distanceInMeter = num * 1000;
      } else {
        distanceInMeter = num;
      }
      if ((distanceInMeter < 500) | (distanceInMeter > 300 * 1000)) {
        Alert.alert('500m-300kmの範囲で指定してください。');
        return;
      }
    } else {
      if (unit == 'hours') {
        timeInMinute = num * 60;
      } else {
        timeInMinute = num;
      }
      if ((timeInMinute < 10) | (timeInMinute > 60 * 12)) {
        Alert.alert('10分-12時間の範囲で指定してください。');
        return;
      }
      distanceInMeter = timeInMinute * walkSpeedInMinutePerMeter;
    }

    const lengthOfSide = distanceInMeter/(points -1);
    const maxDistance = lengthOfSide/(2*Math.sin(Math.PI/(points -1)));

    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });

    let lat_center = userLocation.latitude;
    let lon_center = userLocation.longitude;

    if (markers.length >= 1) {
      for (let i = 0; i < markers.length; i++) {
        lanLonList.push(markers[i].latlng);
        lat_center = Math.abs(lat_center + markers[i].latlng.latitude) / 2;
        lon_center = Math.abs(lon_center + markers[i].latlng.longitude) / 2;
      }
    }

    const maxDistanceDegrees = maxDistance / 111319;
    for (let i = 0; i < (points-2-markers.length); i++) {
      const r = maxDistanceDegrees * Math.sqrt(Math.random());
      const theta = Math.random() * 2.0 * Math.PI;
      const lat = lat_center + (r * Math.cos(theta));
      const lng = lon_center + (r * Math.sin(theta));
      lanLonList.push({latitude: lat, longitude: lng});
    }
    lanLonList.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
    setCoordinates(lanLonList);
  }

  const onPressSaveButton = () => {
      toast.show({
        placement:"bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast bg="$error700" nativeID={toastId} p="$3">
              <VStack space="xs">
                <ToastTitle color="$textLight50">
                  Account Security Alert
                </ToastTitle>
                <ToastDescription color="$textLight50">
                  Your account password was recently changed.
                  {process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}.
                  {theme}.
                </ToastDescription>
              </VStack>
              <Pressable mt="$1" onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} color="$coolGray50" />
              </Pressable>
            </Toast>
          );
        },
      });
  }

  const onPressToolsButton = () => {
    setHandDrawingMode(true);
    setCoordinatesByDraw([]);
    setRequestCoordinates([]);
  }

  const onPressFinishButton = () => {
    setHandDrawingMode(false);
    setCoordinatesByDraw([]);
    setRequestCoordinates([]);
  }

  const onPressOpenMapButton = () => {
    if (null != rootResult) {
      if (coordinates.length >= 2) {
        let url = `https://www.google.com/maps/dir/?api=1`;
        url += `&origin=${coordinates[0].latitude}`;
        url += `%2C${coordinates[0].longitude}`;
        let waypoints='';
        for (let i = 0; i < rootResult.waypointOrder[0].length; i++) {
          waypoints += `${coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].latitude}`;
          waypoints += `%2C${ coordinates.slice(1, -1)[
              rootResult.waypointOrder[0][i]
          ].longitude}|`;
        }
        waypoints=waypoints.substring(0, waypoints.length-1);
        url += `&waypoints=${waypoints}`;
        url += `&destination=${coordinates[coordinates.length-1].latitude}`;
        url += `%2C${coordinates[coordinates.length-1].longitude}`;
        Linking.openURL(url);
      }
    } else {
      Alert.alert('Route meボタンを押してルートを表示してください。');
    }
  }

  const onMapDirectionReady = (result) => {
    setRootResult(result);
    mapRef.current.fitToCoordinates(
        result.coordinates,
        {animated: true},
    );
  };

  //return
  return (
    <Box>
      <VStack>
        <Center
          w="100%"
          h="90%"
        >
          <MapView style={{width: '100%', height: '100%'}} ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            mapType='standard'
            userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
            scrollEnabled={!handDrawingMode}
            onRegionChange={onRegionChange}
            onUserLocationChange={onUserLocationChange}
            onPanDrag={onPanDrag}
            onLongPress={onLongPress}
            onMarkerPress={onMarkerPress}
            >
              {
                markers.map((marker, index) => (
                <Marker
                  identifier={index.toString()}
                  key={index}
                  coordinate={marker.latlng}
                />))
              }
              {
                coordinatesByDraw.length ? (
                  <Polyline 
                    coordinates={coordinatesByDraw}
                    strokeWidth={3}
                    strokeColor="skyblue"
                  />
                ) : null
              }
              {
                requestCoordinates.length ? (
                  <Polygon 
                    coordinates={requestCoordinates}
                    strokeWidth={3}
                    strokeColor="palegreen"
                    fillColor="rgba(0, 255, 0, 0.3)"
                  />
                ) : null
              }
              {
                (coordinates.length >= 2) ? (
                  <MapViewDirections
                    origin={coordinates[0]}
                    waypoints={
                      (coordinates.length > 2) ? coordinates.slice(1, -1): undefined
                    }
                    destination={coordinates[coordinates.length-1]}
                    apikey={process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}
                    language='ja'
                    mode='WALKING'
                    strokeWidth={3}
                    strokeColor="hotpink"
                    optimizeWaypoints={true}
                    onReady={onMapDirectionReady}
                  />
                ) : null
              }
          </MapView>
        </Center>
        <HStack
          w="100%"
          h="10%"
        >
          <Center
            w="25%"
            sx={{
              _dark: {
                bg: "$green200",
              },
              _light: {
                bg: "$green300",
              }
            }}>
            <FooterButton title="Route me" icon={Footprints} onPress={onPressRouteMeButton} />
          </Center>
          <Center
            w="25%"
            sx={{
              _dark: {
                bg: "$green200",
              },
              _light: {
                bg: "$green300",
              }
            }}>
            <FooterButton title="Save" icon={Star} onPress={onPressSaveButton} />
          </Center>
          <Center
            w="25%"
            sx={{
              _dark: {
                bg: "$green200",
              },
              _light: {
                bg: "$green300",
              }
            }}> 
            <FooterButton title="Tools" icon={PencilRuler} onPress={onPressToolsButton} />
          </Center>
          <Center
            w="25%"
            sx={{
              _dark: {
                bg: "$green200",
              },
              _light: {
                bg: "$green300",
              }
            }}>
            <FooterButton title="Open map" icon={Map} onPress={onPressOpenMapButton} />
          </Center>
        </HStack>
      </VStack>
      <Center
        top="2%"
        left="5%"
        w="90%"
        h="7%"
        rounded="$3xl"
        sx={{
          _dark: {
            bg: "$light900",
          },
          _light: {
            bg: "$light200",
          }
        }}
        position='absolute'
      >
        <HStack h="100%">
          <Input w="100%" h="100%" rounded="$3xl"
          variant="rounded" isDisabled={false} isInvalid={isInputValid ? false : true} isReadOnly={false}>
            <InputField
                placeholder='時間または距離を入力'
                inputMode='numeric'
                keyboardType='numeric'
                onChangeText={(text) => { onChangeInputValue(text) }}
            />
            <Select w="28%" h="100%"
              onValueChange={(value) => { setInputUnit(value) }}
            >
              <SelectTrigger w="100%" h="100%" variant='underlined' rounded="$3xl" ml ="$3">
                <SelectInput placeholder="分" defaultValue='minutes'/>
                <SelectIcon mr="$8">
                  <Icon as={ChevronDownIcon} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop/>
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="分" value="minutes" />
                  <SelectItem label="時間" value="hours" />
                  <SelectItem label="m" value="m" />
                  <SelectItem label="Km" value="Km" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </Input>
        </HStack>
      </Center>
          <Pressable
            right="2%"
            bottom="11%"
            position='absolute'
            onPress={() => {onPressCrossHairButton()}}
          >
            <Icon
              as = {followUser ? LocateFixed : Locate}
              size="xl"
              color={followUser ? '$blue700' : '$coolGray500'}
            />
          </Pressable>
          {handDrawingMode ? (
            <Button
              right="2%"
              bottom="15%"
              rounded="$3xl"
              position='absolute'
              onPress={() => {onPressFinishButton()}}
            >
              <ButtonText>Finish</ButtonText>
            </Button>
          ) : null}
    </Box>
  );
}
