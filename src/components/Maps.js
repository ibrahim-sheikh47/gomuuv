import { Platform, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import MapStyle from "../utils/MapStyle";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../tasks/trackingTasks";

const Map = (props) => {
  const dispatch = useDispatch();
  const { tracking, onLocationUpdate } = props;
  const map = useRef(null);
  const { distance, locations: locationHistory } = useSelector(
    (state) => state.tracking
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  const [mapReady, setMapReady] = useState(false);
  let timer;

  useEffect(() => {
    processLocation();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (mapReady) {
      animateCamera();
    }
  }, [mapReady]);

  useEffect(() => {
    animateCamera();
  }, [locationHistory.length]);

  useEffect(() => {
    if (!tracking) {
      stopLocationTracking();
    }
  }, [tracking]);

  useEffect(() => {
    const updateLocationWithSnapshot = async () => {
      if (onLocationUpdate && mapReady) {
        onLocationUpdate({
          distance,
          time: elapsedTime,
          snapshot: null,
        });
      }
    };

    updateLocationWithSnapshot(); // call async function
  }, [distance, elapsedTime]);

  const animateCamera = () => {
    if (map.current) {
      const latitude = parseFloat(
        locationHistory[locationHistory.length - 1]?.latitude || 0
      );
      const longitude = parseFloat(
        locationHistory[locationHistory.length - 1]?.longitude || 0
      );

      map.current.animateCamera({
        center: {
          latitude,
          longitude,
        },
        zoom: 14,
        pitch: 1,
        heading: 0,
        altitude: 500,
      });
    }
  };

  const startTimer = async () => {
    try {
      let savedStartTimeStr = await AsyncStorage.getItem(
        STORAGE_KEYS.START_TIME
      );
      if (!savedStartTimeStr) {
        savedStartTimeStr = Date.now().toString();
        await AsyncStorage.setItem(STORAGE_KEYS.START_TIME, savedStartTimeStr);
      }
      const savedStartTime = parseInt(savedStartTimeStr, 10);

      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - savedStartTime) / 1000);
        setElapsedTime(elapsedSeconds);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const processLocation = async () => {
    try {
      startTimer();
    } catch (e) {
      console.error(e);
    }
  };

  const takeMapSnapshot = async () => {
    if (!map.current || !mapReady) {
      console.log("Map not ready or ref missing");
      return null;
    }

    try {
      const snapshotUri = await map.current.takeSnapshot({
        width: 300,
        height: 300,
        format: "png",
        result: "file",
      });
      return snapshotUri;
    } catch (error) {
      console.log("Error taking snapshot:", error);
      return null;
    }
  };

  const stopLocationTracking = async () => {
    clearInterval(timer);

    if (onLocationUpdate && mapReady) {
      const snapshotUri = await takeMapSnapshot();

      onLocationUpdate({
        distance,
        time: elapsedTime,
        snapshot: snapshotUri,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        onMapReady={() => setMapReady(true)}
        customMapStyle={MapStyle}
        provider={Platform.OS == "ios" ? null : PROVIDER_GOOGLE}
        style={{ flex: 1 }} // Ensure the map takes up the full container
        ref={map}
        showsUserLocation={true}
        showsBuildings={true}
        tracksViewChanges={false}
      >
        {/* Polyline to show the path */}
        {locationHistory.length > 1 && (
          <Polyline
            coordinates={locationHistory}
            strokeWidth={3}
            strokeColor="white"
          />
        )}

        {/* Marker for start location */}
        {locationHistory.length > 0 && (
          <Marker
            coordinate={locationHistory[0]} // Start marker at the first fetched location
            pinColor="green"
            title="Start"
          />
        )}
      </MapView>
    </View>
  );
};

export default Map;
