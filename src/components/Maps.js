import { Platform, View } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import MapStyle from "../utils/MapStyle";
import Commons from "../utils/Commons";
import haversine from "haversine"; // Install via `npm install haversine`

const Map = (props) => {
  const { tracking, onLocationUpdate } = props;
  const map = useRef(null); // Reference to MapView
  const [locationHistory, setLocationHistory] = useState([]); // Track location history
  const [location, setLocation] = useState(null); // Store the location
  const [elapsedTime, setElapsedTime] = useState(0); // Store elapsed time
  const [totalDistance, setTotalDistance] = useState(0); // Store total distance
  const [address, setAddress] = useState(""); // Store total distance

  const startLocation = useRef(null);
  const intervalRef = useRef(null); // For tracking location updates
  const timerRef = useRef(null); // For tracking elapsed time

  const [mapReady, setMapReady] = useState(false);
  Geocoder.init("AIzaSyCSz-v30_BxTuT6a23e78UUy0ANbRd0gC4");

  useEffect(() => {
    // Initial fetch location on component mount
    fetchLocation();
  }, []);

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

      const distance = haversine(prevLocation, currentLocation, {
        unit: "meter",
      });

      // Only count significant movement
      if (distance >= 1.5) {
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
          time: elapsedTime,
          pathCoordinates: locationHistory,
          snapshot: null, // <-- Now snapshot will not be null
        });
      }
    };

    updateLocationWithSnapshot(); // call async function
  }, [address, totalDistance, elapsedTime]);

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

  // Fetch location function
  const fetchLocation = async () => {
    try {
      const res = await Commons.fetchLocation();
      if (!startLocation.current) {
        startLocation.current = res;
      }
      setLocation({
        latitude: res.latitude,
        longitude: res.longitude,
      });

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
    } catch (err) {
      console.log("Error fetching location:", err);
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
        time: elapsedTime,
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
        provider={PROVIDER_GOOGLE}
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
