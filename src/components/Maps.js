import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import Geocoder from "react-native-geocoding";
import { MAPS_API_KEY } from "@env";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  MAP_TYPES,
  Callout,
} from "react-native-maps";
import MapStyle from "../utils/MapStyle";
import { useEffect } from "react";
import Commons from "../utils/Commons";

export default function Map(props) {
  var map = useRef(null);
  const shouldCallDelta = useRef(true);

  const [region, setRegion] = useState({
    latitude: 18.46633,
    longitude: -66.10572,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  Geocoder.init(MAPS_API_KEY);

  useEffect(() => {
    fetchLocation();
  }, []);

  const callDelta = (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        var addressComponent = json.results[0].formatted_address;

        props.setAddress({
          address: addressComponent,
          lat: lat,
          lng: long,
        });
        shouldCallDelta.current = false;
        map.current.animateCamera({
          center: {
            latitude: lat,
            longitude: long,
          },
        });
      })
      .catch((error) => console.warn(error));
  };

  const fetchLocation = () => {
    Commons.fetchLocation()
      .then((res) => {
        if (props.setCurrentLocation) {
          props.setCurrentLocation({
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
          });
        }
        setRegion({
          ...region,
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        });
        callDelta(res.coords.latitude, res.coords.longitude);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        customMapStyle={MapStyle}
        provider={PROVIDER_GOOGLE}
        style={{
          width: Commons.width(),
          flex: 1,
        }}
        ref={map}
        initialRegion={region}
        zoomEnabled={true}
        pitchEnabled={true}
        showsBuildings={true}
        showsUserLocation={false}
        showScale={true}
        // showsTraffic={true}
        showsIndoors={true}
        tracksViewChanges={false}
        onRegionChange={(region, details) => {
          if (shouldCallDelta.current) {
            setRegion({
              ...region,
              latitude: region.latitude,
              longitude: region.longitude,
            });
          } else {
            shouldCallDelta.current = true;
          }
        }}
        onPress={(event) => {
          setRegion({
            ...region,
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
          });
          callDelta(
            event.nativeEvent.coordinate.latitude,
            event.nativeEvent.coordinate.longitude
          );
        }}
      ></MapView>
    </View>
  );
}
