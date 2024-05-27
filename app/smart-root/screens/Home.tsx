//React/React-Native
import * as React from "react";

//Expo
import * as Location from "expo-location";
import * as Linking from "expo-linking";

//Gluestack
import * as CP from "../components";
import { config } from "../components/gluestack-ui.config";

//External libraries
import * as LUCIDE from "lucide-react-native";
import MapView, { LatLng, Marker, PanDragEvent, Polygon, Polyline, PROVIDER_GOOGLE, Region, UserLocationChangeEvent} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useTranslation } from 'react-i18next';

//Internal components
import { FooterButton } from "../components/FooterButton";
import { FavsSaveModal } from "../components/FavsSaveModal";
import { ToastMessage } from "../components/ToastMessage";
import { toConvexHullLatLngs, isInsidePolygon } from "../utils/calcHull";
import { useMapTheme, useTheme } from "../contexts/ThemeContext";
import { useUserSettings } from "../contexts/UserSettingsContext";
import * as C from "../utils/constants";

export default function HomeScreen({ route, navigation }: any) {
  const mapRef = React.useRef() as any;
  const eventCounter = React.useRef(0);
  const mapTheme = useMapTheme();
  const {theme} = useTheme() as any;
  const { t } = useTranslation();
  const {userSettings, setUserSettings, favRoutes, setFavRoutes} = useUserSettings() as any;
  const units = C.useConstants().units;
  const toast = CP.useToast();

  //useState
  const [userLocation, setUserLocation] = React.useState(C.TOKYO_REGION);
  const [coordinates, setCoordinates] = React.useState<LatLng[]>([]);
  const [rootResult, setRootResult] = React.useState(null) as any;
  const [inputValue, setInputValue] = React.useState("");
  const [inputUnit, setInputUnit] = React.useState(units[userSettings.unit_index].value);
  const [isInputValid, setIsInputValid] = React.useState(true);
  const [followUser, setFollowUser] = React.useState(true);
  const [handDrawingMode, setHandDrawingMode] = React.useState(false);
  const [showFavsSaveModal, setShowFavsSaveModal] = React.useState(false);
  const [nameOfFavRoute, setNameOfFavRoute] = React.useState("");
  const [region, setRegion] = React.useState({
    ...userLocation,
    latitudeDelta: C.REGION_DELTA.latitudeDelta,
    longitudeDelta: C.REGION_DELTA.longitudeDelta,
  });
  const [markers, setMarkers] = React.useState([]) as any;
  const [coordinatesByDraw, setCoordinatesByDraw] = React.useState<LatLng[]>([]);
  const [requestCoordinates, setRequestCoordinates] = React.useState<LatLng[]>([]);

  //useEffect
  React.useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toastShow(t("permission-denied"), t("permission-denied-message"), LUCIDE.X, "top", "error");
        return;
      }
    })();
  }, []);

  React.useEffect(() => {
    if (null != rootResult) {
      let distMeg = "";
      let unitDistMsg = "";
      if (rootResult.distance < 1) {
        distMeg = (rootResult.distance * 1000).toFixed(0);
        unitDistMsg = units[C.UNIT_INDEX.m].label;
      } else {
        distMeg = (rootResult.distance).toFixed(1);
        unitDistMsg = units[C.UNIT_INDEX.Km].label;
      }
      let timeMeg = "";
      let unitTimeMsg = "";
      if (rootResult.duration >= 60) {
        timeMeg = (rootResult.duration/60).toFixed(1);
        unitTimeMsg = units[C.UNIT_INDEX.hours].label;
      } else {
        timeMeg = (rootResult.duration).toFixed(0);
        unitTimeMsg = units[C.UNIT_INDEX.minutes].label;
      }

      toastShow(t("route-found"), `${t("distance-is")} ${distMeg}${unitDistMsg}${t("punctuation")} ${t("time-is")} ${timeMeg}${unitTimeMsg}${t("punctuation")}`, LUCIDE.X, "bottom", "info");
    }
  }, [rootResult]);

  React.useEffect(() => {
    if (route.params?.coordinates) {
      setCoordinates(route.params.coordinates);
    }
  }, [route.params?.coordinates]);

  const toastShow = (title: string, message: string, icon:any,  position: "top" | "top right" | "top left" | "bottom" | "bottom left" | "bottom right" | undefined, action:string) => {

    toast.show({
        placement: position,
        render: ({ id }) => {
        return (
            <ToastMessage id={id} title={title} message={message} icon={icon} onPress={() => toast.close(id)} action={action} />
        );
        },
    });
  };

  const rgbaArrayToRGBAColor = (color: number[], opacity: number) => {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
  }

  const hexToRGBAColor = (hex: string, opacity: number) => {
    let color = hex.replace("#", "").match(/.{1,2}/g);
    if (color === null) {
      throw new Error("Invalid hex color");
    }
    return rgbaArrayToRGBAColor(color.map((c) => parseInt(c, 16)), opacity);
  }

  const onRegionChange = React.useCallback((newRegion : Region) => {
    eventCounter.current++;
    if (eventCounter.current % C.EVENT_COUNT_THRESHOLD_FOR_REGION_CHANGE !== 0) {
      return;
    }

    const { latitudeDelta, longitudeDelta } = newRegion;

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

  const onUserLocationChange = (event : UserLocationChangeEvent) => {
    const newRegion = event.nativeEvent.coordinate as LatLng;
    setUserLocation(newRegion);
    if (followUser) {
      setRegion((region) => ({
        ...region,
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      }));
      mapRef.current.animateToRegion(region, C.MAP_FIT_ANIMATION_DURATION);
    }
  };

  const handleDraw = React.useCallback((coordinate: LatLng) => {
    setCoordinatesByDraw((prev) => [...prev, coordinate]);
    onPanDragEnd([...coordinatesByDraw, coordinate]);
  }, [coordinatesByDraw]);

  const onPanDrag = (event : PanDragEvent) => {
    setFollowUser(false);
    if (handDrawingMode) {
      eventCounter.current++;
      if (eventCounter.current % C.EVENT_COUNT_THRESHOLD_FOR_HAND_WRITING === 0) {
        handleDraw(event.nativeEvent.coordinate);
      }
    }
  };

  const debounce = <T extends (...args: any[]) => unknown>(
    callback: T,
    delay = 250,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
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
    }, C.MAP_PAN_DRAG_END_DELAY),
    []
  );

  const onLongPress = (event : any) => {
    let maxMarkers = userSettings.num_of_markers as number;
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
        toastShow(t("inside-polygon"), t("inside-polygon-message"), LUCIDE.X, "bottom", "info");
      } else {
        toastShow(t("outside-polygon"), t("outside-polygon-message"), LUCIDE.X, "bottom", "info");
      }
    }
  };

  const onMarkerPress = (event : any) => {
    let id = parseInt(event.nativeEvent.id);
    let newMarkers = markers.filter((_ : any , index : number) => index !== id);
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
      mapRef.current.animateToRegion(region, C.MAP_FIT_ANIMATION_DURATION);
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
    const walkSpeedInMinutePerMeter = userSettings.walk_speed as number;
    const points = 8;
    const lanLonList = [];
    const num = parseFloat(inputValue);
    const iunit = inputUnit;
    if (isNaN(num)) {
      toastShow(t("route-me-input-error"), t("route-me-input-error-message"), LUCIDE.X, "bottom", "error");
      return;
    }

    let timeInMinute = 0;
    let distanceInMeter = 0;
    if (iunit == units[C.UNIT_INDEX.Km].value || iunit == units[C.UNIT_INDEX.m].value) {
      if (iunit == units[C.UNIT_INDEX.Km].value) {
        distanceInMeter = num * 1000;
      } else {
        distanceInMeter = num;
      }
      if ((distanceInMeter < 500) || (distanceInMeter > 300 * 1000)) {
        toastShow(t("route-me-distance-error"), t("route-me-distance-error-message"), LUCIDE.X, "bottom", "error");
        return;
      }
    } else {
      if (iunit == units[C.UNIT_INDEX.hours].value) {
        timeInMinute = num * 60;
      } else {
        timeInMinute = num;
      }
      if ((timeInMinute < 10) || (timeInMinute > 60 * 12)) {
        toastShow(t("route-me-time-error"), t("route-me-time-error-message"), LUCIDE.X, "bottom", "error");
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

  const onPressFavsButton = () => {
    if (route.params?.coordinates) {
      navigation.setParams({coordinates: []});
    }
    navigation.navigate(t("favs"));
  }

  const onPressSaveButton = () => {
    if (null != rootResult && coordinates.length >= 2) {
      setNameOfFavRoute("Route" + (favRoutes.length + 1));
      setShowFavsSaveModal(true);
    } else {
      toastShow(t("save-error"), t("save-error-message"), LUCIDE.X, "bottom", "error");
    }
  }

  const onPressSubmitSaveButton = () => {
      if (null != rootResult && coordinates.length >= 2) {
      if (nameOfFavRoute === "") {
          toastShow(t("save-error"), t("save-error-message"), LUCIDE.X, "bottom", "error");
          return;
      }
      let rootResultCoordinates = [] as LatLng[];
      rootResultCoordinates.push(coordinates[0]);
      for (let i = 0; i < rootResult.waypointOrder[0].length; i++) {
          rootResultCoordinates.push(coordinates.slice(1, -1)[rootResult.waypointOrder[0][i]]);
      }
      rootResultCoordinates.push(coordinates[coordinates.length-1]);

      setFavRoutes((prev : any) => {
          return [...prev, {
          name: nameOfFavRoute,
          coordinates: rootResultCoordinates,
          distance: rootResult.distance,
          duration: rootResult.duration,
          waypointOrder: rootResult.waypointOrder,
          }];
      }
      );

      if (favRoutes.length > 0) {
          toastShow(t("save-button"), t("save-button-message"), LUCIDE.X, "bottom", "info")
      }
      } else {
      toastShow(t("save-error"), t("save-error-message"), LUCIDE.X, "bottom", "error");
      }
  };

  const onPressClearButton = () => {
    setCoordinates([]);
    setRootResult(null);
    setMarkers([]);
    if (route.params?.coordinates) {
      navigation.setParams({coordinates: []});
    }
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
        let waypoints="";
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
      toastShow(t("open-map-error"), t("open-map-error-message"), LUCIDE.X, "bottom", "error");
    }
  }

  const onMapDirectionReady = (result : any) => {
    setRootResult(result);
    mapRef.current.fitToCoordinates(
        result.coordinates,
        {animated: true},
    );
  };

  const onMapDirectionError = (error : any) => {
    toastShow(t("route-error"), t("route-error-message"), LUCIDE.X, "bottom", "error");
  }

  //return
  return (
    <CP.Box>
      <CP.VStack>
        <CP.Center
          w="100%"
          h="90%"
        >
          <MapView style={{width: "100%", height: "100%"}} ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            mapType="standard"
            userInterfaceStyle={mapTheme}
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
                markers.map((marker : any, index : number) => (
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
                    strokeColor={config.tokens.colors.blue400}
                  />
                ) : null
              }
              {
                requestCoordinates.length ? (
                  <Polygon 
                    coordinates={requestCoordinates}
                    strokeWidth={3}
                    strokeColor={config.tokens.colors.green500}
                    fillColor= {hexToRGBAColor(config.tokens.colors.green500, config.tokens.opacity[30])}
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
                    apikey={process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY === undefined ? "" : process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}
                    language={userSettings.language}
                    mode="WALKING"
                    strokeWidth={3}
                    strokeColor={config.tokens.colors.pink500}
                    optimizeWaypoints={true}
                    onReady={onMapDirectionReady}
                    onError={onMapDirectionError}
                  />
                ) : null
              }
          </MapView>
        </CP.Center>
        <CP.HStack
          w="100%"
          h="10%"
          theme={theme}
        >
          <CP.Center w="33.00%">
            <FooterButton title={t("save")} icon={LUCIDE.Star} onPress={onPressSaveButton} onLongPress={onPressFavsButton}/>
          </CP.Center>
          <CP.Center w="33.00%">
            <FooterButton title={t("route-me")} icon={LUCIDE.Footprints} onPress={onPressRouteMeButton} onLongPress={onPressClearButton}/>
          </CP.Center>
          <CP.Center w="33.00%">
            <FooterButton title={t("open-map")} icon={LUCIDE.Map} onPress={onPressOpenMapButton} />
          </CP.Center>
          {/* <CP.Center w="33.00%">
            <FooterButton title={t("tools")} icon={LUCIDE.PencilRuler} onPress={onPressToolsButton} />
          </CP.Center> */}
        </CP.HStack>
      </CP.VStack>
      <CP.Center
        top="2%"
        left="5%"
        w="90%"
        h="7%"
        rounded="$3xl"
        sx={{
          _dark: {
          },
          _light: {
            bg: "$light200",
          }
        }}
        position="absolute"
      >
      <CP.HStack h="100%">
          <CP.Input w="100%" h="100%" rounded="$3xl" theme={theme}
          variant="rounded" isDisabled={false} isInvalid={isInputValid ? false : true} isReadOnly={false}>
            <CP.InputField
                placeholder={t("input-placeholder")}
                inputMode="numeric"
                keyboardType="numeric"
                onChangeText={(text) => { onChangeInputValue(text) }}
                theme={theme}
            />
            <CP.Select w="28%" h="100%"
              onValueChange={(value) => { setInputUnit(value); setUserSettings({...userSettings, unit_index: units.findIndex((unit) => unit.value === value)}) } }
            >
              <CP.SelectTrigger w="100%" h="100%" variant="none" rounded="$3xl" ml ="$3">
                <CP.SelectInput placeholder={units[userSettings.unit_index].label} defaultValue={units[userSettings.unit_index].value} theme={theme} />
                <CP.SelectIcon mr="$8">
                  <CP.Icon as={LUCIDE.ChevronDownIcon} />
                </CP.SelectIcon>
              </CP.SelectTrigger>
              <CP.SelectPortal>
                <CP.SelectBackdrop/>
                <CP.SelectContent bg="$tertiary">
                  <CP.SelectDragIndicatorWrapper>
                    <CP.SelectDragIndicator />
                  </CP.SelectDragIndicatorWrapper>
                  <CP.SelectItem label={units[C.UNIT_INDEX.minutes].label} value={units[C.UNIT_INDEX.minutes].value} />
                  <CP.SelectItem label={units[C.UNIT_INDEX.hours].label} value={units[C.UNIT_INDEX.hours].value} />
                  <CP.SelectItem label={units[C.UNIT_INDEX.m].label} value={units[C.UNIT_INDEX.m].value} />
                  <CP.SelectItem label={units[C.UNIT_INDEX.Km].label} value={units[C.UNIT_INDEX.Km].value} />
                </CP.SelectContent>
              </CP.SelectPortal>
            </CP.Select>
          </CP.Input>
        </CP.HStack>
      </CP.Center>
          <CP.Pressable
            right="2%"
            bottom="11%"
            position="absolute"
            onPress={() => {onPressCrossHairButton()}}
          >
            <CP.Icon
              as = {followUser ? LUCIDE.LocateFixed : LUCIDE.Locate}
              size="2xl"
              color={followUser ? "$blue700" : "$coolGray500"}
            />
          </CP.Pressable>
          {handDrawingMode ? (
            <CP.Button
              right="2%"
              bottom="15%"
              rounded="$3xl"
              position="absolute"
              onPress={() => {onPressFinishButton()}}
            >
              <CP.ButtonText>Finish</CP.ButtonText>
            </CP.Button>
          ) : null}
          <FavsSaveModal showFavsSaveModal={showFavsSaveModal} setShowFavsSaveModal={setShowFavsSaveModal} nameOfFavRoute={nameOfFavRoute} setNameOfFavRoute={setNameOfFavRoute} onPressSubmitSaveButton={onPressSubmitSaveButton} />
    </CP.Box>
  );
}
