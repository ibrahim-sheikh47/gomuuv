import { Platform, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import MapStyle from "../utils/MapStyle";
import haversine from "haversine"; // Install via `npm install haversine`
import LocationHelper from "../services/locationHelper";

const Map = (props) => {
  const { tracking, onLocationUpdate, goal } = props;
  const map = useRef(null); // Reference to MapView
  const [locationHistory, setLocationHistory] = useState([]); // Track location history
  const [elapsedTime, setElapsedTime] = useState(0); // Store elapsed time
  const [totalDistance, setTotalDistance] = useState(0); // Store total distance
  const [address, setAddress] = useState(""); // Store total distance

  const startLocation = useRef(null);
  const intervalRef = useRef(null); // For tracking location updates
  const timerRef = useRef(null); // For tracking elapsed time

  const [mapReady, setMapReady] = useState(false);
  Geocoder.init(process.env.EXPO_PUBLIC_MAPS_API_KEY);

  const [locationState, setLocationState] = useState({
    permission: null,
    servicesEnabled: null,
    location: null,
  });

  useEffect(() => {
    const helper = new LocationHelper(setLocationState);
    helper.start();

    return () => helper.stop();
  }, []);

  useEffect(() => {
    if (locationState.location) {
      processLocation(locationState.location);
    }
  }, [locationState]);

  useEffect(() => {
    // Handle tracking state change
    if (tracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [tracking]);

  useEffect(() => {
    if (locationHistory.length > 1) {
      const prevLocation = locationHistory[locationHistory.length - 2];
      const currentLocation = locationHistory[locationHistory.length - 1];

      const unit = goal?.targetDistance.unit === "mi" ? "mile" : "km" || "km";
      const distance = haversine(prevLocation, currentLocation, {
        unit,
      });
      const threshold = convertThreshold(unit);

      if (distance >= threshold) {
        setTotalDistance((prev) => prev + distance);
      }
    }
  }, [locationHistory.length]);

  useEffect(() => {
    const updateLocationWithSnapshot = async () => {
      if (onLocationUpdate && mapReady) {
        onLocationUpdate({
          address,
          distance: totalDistance,
          time: formatElapsedTime(elapsedTime),
          pathCoordinates: locationHistory,
          snapshot: null,
        });
      }
    };

    updateLocationWithSnapshot(); // call async function
  }, [address, totalDistance, elapsedTime]);

  const processLocation = async (res) => {
    try {
      if (!startLocation.current) {
        startLocation.current = res;
      }

      // Immediately add the fetched location to location history for start marker
      setLocationHistory((prevHistory) => {
        const newLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        return [...prevHistory, newLocation];
      });

      // Animate camera to the current location
      if (map.current) {
        map.current.animateCamera({
          center: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          zoom: 14, // Adjust zoom level if necessary
          pitch: 1,
          heading: 0,
          altitude: 500,
        });
      }

      // Get address from location and send it back to MapScreen
      setAddress(await getAddress(res.latitude, res.longitude));
    } catch (e) {
      console.error(e);
    }
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, seconds: seconds % 60 };
  };

  const convertThreshold = (unit, thresholdInMeters = 1.5) => {
    switch (unit) {
      case "km":
        return thresholdInMeters / 1000;
      case "mile":
        return thresholdInMeters / 1609.34;
      default:
        return thresholdInMeters;
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
      console.log("Snapshot taken:", snapshotUri);
      return snapshotUri;
    } catch (error) {
      console.log("Error taking snapshot:", error);
      return null;
    }
  };

  // Convert latitude and longitude to address
  const getAddress = async (lat, long) => {
    try {
      const json = await Geocoder.from(lat, long);
      return json.results[0].formatted_address;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  // Start location tracking
  const startLocationTracking = () => {
    // Start a timer to track elapsed time
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1); // Increment time every second
      }, 1000);
    }

    // Fetch location every 10 seconds
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchLocation, 1000); // Fetch every 10 seconds
    }
  };

  // Stop location tracking
  const stopLocationTracking = async () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    intervalRef.current = null;
    timerRef.current = null;

    if (onLocationUpdate && mapReady) {
      const snapshotUri = await takeMapSnapshot();

      onLocationUpdate({
        address,
        distance: totalDistance,
        time: formatElapsedTime(elapsedTime),
        pathCoordinates: locationHistory,
        snapshot: snapshotUri,
      });
    }

    // Reset state
    setElapsedTime(0);
    setTotalDistance(0);
    setLocationHistory([]);
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
            strokeWidth={5}
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
