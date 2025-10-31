import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Plane,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  Volume2,
  VolumeX,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { useAudioPlayer } from "expo-audio";
import {
  Canvas,
  Circle,
  RoundedRect,
  LinearGradient,
  Group,
  Path,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

// Get destinations data (same as destination-selection)
const destinations = [
  {
    id: "1",
    city: "New York",
    country: "USA",
    code: "JFK",
    coordinates: { latitude: 40.6413, longitude: -73.7781 },
  },
  {
    id: "2",
    city: "London",
    country: "UK",
    code: "LHR",
    coordinates: { latitude: 51.47, longitude: -0.4543 },
  },
  {
    id: "3",
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    coordinates: { latitude: 35.7653, longitude: 140.3856 },
  },
  {
    id: "4",
    city: "Paris",
    country: "France",
    code: "CDG",
    coordinates: { latitude: 49.0097, longitude: 2.5479 },
  },
  {
    id: "5",
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    coordinates: { latitude: 25.2532, longitude: 55.3657 },
  },
  {
    id: "6",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    coordinates: { latitude: 1.3644, longitude: 103.9915 },
  },
  {
    id: "7",
    city: "Los Angeles",
    country: "USA",
    code: "LAX",
    coordinates: { latitude: 33.9425, longitude: -118.4081 },
  },
  {
    id: "8",
    city: "Sydney",
    country: "Australia",
    code: "SYD",
    coordinates: { latitude: -33.9399, longitude: 151.1753 },
  },
  {
    id: "9",
    city: "Amsterdam",
    country: "Netherlands",
    code: "AMS",
    coordinates: { latitude: 52.3105, longitude: 4.7683 },
  },
  {
    id: "10",
    city: "Frankfurt",
    country: "Germany",
    code: "FRA",
    coordinates: { latitude: 50.0379, longitude: 8.5622 },
  },
  {
    id: "11",
    city: "Hong Kong",
    country: "Hong Kong",
    code: "HKG",
    coordinates: { latitude: 22.308, longitude: 113.9185 },
  },
  {
    id: "12",
    city: "Barcelona",
    country: "Spain",
    code: "BCN",
    coordinates: { latitude: 41.2974, longitude: 2.0833 },
  },
  {
    id: "13",
    city: "Rome",
    country: "Italy",
    code: "FCO",
    coordinates: { latitude: 41.7999, longitude: 12.2462 },
  },
  {
    id: "14",
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
    coordinates: { latitude: 13.69, longitude: 100.7501 },
  },
  {
    id: "15",
    city: "Mumbai",
    country: "India",
    code: "BOM",
    coordinates: { latitude: 19.0896, longitude: 72.8656 },
  },
  {
    id: "16",
    city: "São Paulo",
    country: "Brazil",
    code: "GRU",
    coordinates: { latitude: -23.4356, longitude: -46.4731 },
  },
  {
    id: "17",
    city: "Cairo",
    country: "Egypt",
    code: "CAI",
    coordinates: { latitude: 30.1219, longitude: 31.4056 },
  },
  {
    id: "18",
    city: "Istanbul",
    country: "Turkey",
    code: "IST",
    coordinates: { latitude: 41.2753, longitude: 28.7519 },
  },
  {
    id: "19",
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
    coordinates: { latitude: 43.6777, longitude: -79.6248 },
  },
  {
    id: "20",
    city: "Moscow",
    country: "Russia",
    code: "SVO",
    coordinates: { latitude: 55.9726, longitude: 37.4146 },
  },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const motivationalMessages = [
  "Great progress! Keep going!",
  "You're doing amazing! Stay focused!",
  "Almost there! Your destination is getting closer!",
  "Excellent focus! The view from up here is beautiful!",
  "Stay on track! You're flying like a pro!",
  "Wonderful concentration! Enjoy your journey!",
  "Keep it up! We're cruising at the perfect altitude!",
  "Fantastic work! The captain is impressed!",
  "You're in the zone! Let's reach that destination!",
  "Perfect flight so far! Maintain that focus!",
];

export default function FlightScreen() {
  const insets = useSafeAreaInsets();
  const { flightClass, selectedSeat, departureId, arrivalId, flightDuration } =
    useLocalSearchParams();

  // Core flight state
  const [timeRemaining, setTimeRemaining] = useState(
    parseInt(flightDuration) * 60,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);

  // Immersive experience state
  const [currentPosition, setCurrentPosition] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAttendant, setShowAttendant] = useState(false);
  const [attendantMessage, setAttendantMessage] = useState("");
  const [mapRegion, setMapRegion] = useState(null);

  // Audio players
  const takeoffPlayer = useAudioPlayer(
    "https://www.soundjay.com/misc/sounds/airplane-takeoff.wav",
  );
  const ambientPlayer = useAudioPlayer(
    "https://www.soundjay.com/misc/sounds/airplane-cabin.wav",
  );
  const landingPlayer = useAudioPlayer(
    "https://www.soundjay.com/misc/sounds/airplane-landing.wav",
  );

  // Animation values
  const intervalRef = useRef(null);
  const attendantTimeoutRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const attendantAnimated = useRef(new Animated.Value(0)).current;
  const airplaneScale = useSharedValue(1);
  const airplaneRotation = useSharedValue(0);
  const cloudAnimation = useSharedValue(0);

  const departure = destinations.find((d) => d.id === departureId);
  const arrival = destinations.find((d) => d.id === arrivalId);
  const totalDuration = parseInt(flightDuration) * 60;

  // Derived values for animations (must be at top level)
  const animatedCloudOffset = useDerivedValue(() => {
    return cloudAnimation.value * 200;
  });

  useEffect(() => {
    // Animate in
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Calculate initial airplane position (departure coordinates)
    if (departure) {
      const mapWidth = screenWidth - 40;
      const mapHeight = 300;

      // Convert lat/lng to screen coordinates (simplified projection)
      const x = ((departure.coordinates.longitude + 180) / 360) * mapWidth;
      const y = ((90 - departure.coordinates.latitude) / 180) * mapHeight;

      setCurrentPosition({ x, y });
    }
  }, [departure]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFlightComplete();
            return 0;
          }

          // Update flight progress and airplane position
          const newProgress = 1 - (prev - 1) / totalDuration;
          setFlightProgress(newProgress);
          updateAirplanePosition(newProgress);

          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalDuration]);

  useEffect(() => {
    // Show attendant messages every 5 minutes (300 seconds)
    if (isRunning && hasStarted) {
      const showAttendantMessage = () => {
        const randomMessage =
          motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
          ];
        setAttendantMessage(randomMessage);
        setShowAttendant(true);

        // Animate in
        Animated.timing(attendantAnimated, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Hide after 4 seconds
        attendantTimeoutRef.current = setTimeout(() => {
          Animated.timing(attendantAnimated, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowAttendant(false);
          });
        }, 4000);
      };

      // Show first message after 30 seconds, then every 5 minutes
      const firstTimeout = setTimeout(showAttendantMessage, 30000);
      const interval = setInterval(showAttendantMessage, 300000); // 5 minutes

      return () => {
        clearTimeout(firstTimeout);
        clearInterval(interval);
        if (attendantTimeoutRef.current) {
          clearTimeout(attendantTimeoutRef.current);
        }
      };
    }
  }, [isRunning, hasStarted]);

  const updateAirplanePosition = (progress) => {
    if (departure && arrival) {
      const lat =
        departure.coordinates.latitude +
        (arrival.coordinates.latitude - departure.coordinates.latitude) *
          progress;
      const lon =
        departure.coordinates.longitude +
        (arrival.coordinates.longitude - departure.coordinates.longitude) *
          progress;

      setCurrentPosition({ latitude: lat, longitude: lon });
    }
  };

  // Initialize map region and animations
  useEffect(() => {
    if (departure && arrival) {
      // Calculate region that shows both departure and arrival
      const latDelta =
        Math.abs(
          departure.coordinates.latitude - arrival.coordinates.latitude,
        ) * 1.5;
      const lonDelta =
        Math.abs(
          departure.coordinates.longitude - arrival.coordinates.longitude,
        ) * 1.5;

      const centerLat =
        (departure.coordinates.latitude + arrival.coordinates.latitude) / 2;
      const centerLon =
        (departure.coordinates.longitude + arrival.coordinates.longitude) / 2;

      setMapRegion({
        latitude: centerLat,
        longitude: centerLon,
        latitudeDelta: Math.max(latDelta, 10),
        longitudeDelta: Math.max(lonDelta, 10),
      });

      // Initial position for airplane
      setCurrentPosition(departure.coordinates);

      // Start cloud animations
      cloudAnimation.value = withRepeat(withTiming(1, { duration: 20000 }), -1);
    }
  }, [departure, arrival]);

  // Update airplane rotation based on direction
  useEffect(() => {
    if (departure && arrival && flightProgress > 0) {
      // Animate airplane rotation based on direction
      const bearing =
        Math.atan2(
          arrival.coordinates.longitude - departure.coordinates.longitude,
          arrival.coordinates.latitude - departure.coordinates.latitude,
        ) *
        (180 / Math.PI);

      airplaneRotation.value = withTiming(bearing);

      // Pulse airplane during flight
      airplaneScale.value = withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      );
    }
  }, [flightProgress, departure, arrival]);

  // Sound effects control
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled && isRunning) {
      ambientPlayer.play();
    } else {
      ambientPlayer.pause();
    }
  };

  // Format time helper
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHasStarted(false);
    setTimeRemaining(totalDuration);
    setFlightProgress(0);
    setShowAttendant(false);

    // Reset airplane position
    if (departure) {
      const mapWidth = screenWidth - 40;
      const mapHeight = 300;
      const x = ((departure.coordinates.longitude + 180) / 360) * mapWidth;
      const y = ((90 - departure.coordinates.latitude) / 180) * mapHeight;
      setCurrentPosition({ x, y });
    }
  };

  const handleFlightComplete = async () => {
    setIsRunning(false);

    // Save focus session
    try {
      const currentFocusTime =
        (await AsyncStorage.getItem("totalFocusTime")) || "0";
      const newFocusTime =
        parseInt(currentFocusTime) + parseInt(flightDuration);
      await AsyncStorage.setItem("totalFocusTime", newFocusTime.toString());

      // Award business flights for long sessions (over 45 minutes)
      if (parseInt(flightDuration) >= 45) {
        const currentBusinessFlights =
          (await AsyncStorage.getItem("businessFlights")) || "5";
        const newBusinessFlights = parseInt(currentBusinessFlights) + 1;
        await AsyncStorage.setItem(
          "businessFlights",
          newBusinessFlights.toString(),
        );
      }

      // Save flight history
      const flightHistory =
        (await AsyncStorage.getItem("flightHistory")) || "[]";
      const history = JSON.parse(flightHistory);
      history.unshift({
        id: Date.now().toString(),
        departure: departure.city,
        arrival: arrival.city,
        duration: parseInt(flightDuration),
        class: flightClass,
        seat: selectedSeat,
        completedAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        "flightHistory",
        JSON.stringify(history.slice(0, 50)),
      ); // Keep last 50 flights
    } catch (error) {
      console.error("Error saving flight data:", error);
    }

    Alert.alert(
      "✈️ Flight Complete!",
      `Congratulations! You've successfully completed your focus journey from ${departure.city} to ${arrival.city}!`,
      [
        {
          text: "View History",
          onPress: () => router.push("/(tabs)/history"),
        },
        {
          text: "New Flight",
          onPress: () => router.push("/(tabs)/"),
        },
      ],
    );
  };

  // Immersive 3D-style Skia overlay for clouds and effects
  const renderSkiaOverlay = () => (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
      }}
    >
      {/* Animated clouds */}
      <Group transform={[{ translateX: animatedCloudOffset }]}>
        <Circle cx={50} cy={80} r={20} color="rgba(255,255,255,0.3)" />
        <Circle cx={70} cy={85} r={15} color="rgba(255,255,255,0.25)" />
        <Circle cx={90} cy={80} r={18} color="rgba(255,255,255,0.2)" />
      </Group>

      <Group transform={[{ translateX: animatedCloudOffset.value * 0.7 }]}>
        <Circle cx={200} cy={120} r={25} color="rgba(255,255,255,0.15)" />
        <Circle cx={225} cy={125} r={20} color="rgba(255,255,255,0.1)" />
      </Group>

      <Group transform={[{ translateX: animatedCloudOffset.value * 0.5 }]}>
        <Circle cx={150} cy={200} r={30} color="rgba(255,255,255,0.2)" />
        <Circle cx={180} cy={205} r={22} color="rgba(255,255,255,0.15)" />
      </Group>

      {/* Atmospheric glow effect */}
      <RoundedRect
        x={0}
        y={screenHeight * 0.6}
        width={screenWidth}
        height={screenHeight * 0.4}
        r={0}
      >
        <LinearGradient
          start={{ x: 0, y: screenHeight * 0.6 }}
          end={{ x: 0, y: screenHeight }}
          colors={["transparent", "rgba(79, 70, 229, 0.1)"]}
        />
      </RoundedRect>
    </Canvas>
  );

  // Immersive Google Maps flight experience (75% of screen)
  const renderFlightMap = () => (
    <View
      style={{
        height: screenHeight * 0.75,
        backgroundColor: "#000",
        borderRadius: 16,
        margin: 10,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#4f46e5",
        elevation: 10,
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}
    >
      {mapRegion && departure && arrival && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={mapRegion}
          mapType="satellite"
          showsUserLocation={false}
          showsMyLocationButton={false}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          customMapStyle={[
            {
              featureType: "all",
              stylers: [{ saturation: -10 }, { lightness: -20 }],
            },
            {
              featureType: "water",
              stylers: [{ color: "#1a1b3a" }],
            },
          ]}
        >
          {/* Flight path */}
          <Polyline
            coordinates={[departure.coordinates, arrival.coordinates]}
            strokeColor="#4f46e5"
            strokeWidth={3}
            strokePattern={[20, 10]}
            lineDashPhase={flightProgress * 100}
          />

          {/* Departure marker */}
          <Marker coordinate={departure.coordinates}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#10b981",
                borderWidth: 3,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
              >
                {departure.code}
              </Text>
            </View>
          </Marker>

          {/* Arrival marker */}
          <Marker coordinate={arrival.coordinates}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#ef4444",
                borderWidth: 3,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
              >
                {arrival.code}
              </Text>
            </View>
          </Marker>

          {/* Animated airplane marker */}
          {currentPosition && currentPosition.latitude && (
            <Marker coordinate={currentPosition} anchor={{ x: 0.5, y: 0.5 }}>
              <Animated.View
                style={{
                  transform: [
                    { rotate: `${airplaneRotation.value}deg` },
                    { scale: airplaneScale.value },
                  ],
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(79, 70, 229, 0.9)",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: "white",
                    elevation: 8,
                    shadowColor: "#4f46e5",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                  }}
                >
                  <Plane color="white" size={24} />
                </View>
              </Animated.View>
            </Marker>
          )}
        </MapView>
      )}

      {/* Skia overlay for atmospheric effects */}
      {renderSkiaOverlay()}

      {/* Flight information overlay */}
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Timer display (small, top-left) */}
        <View
          style={{
            backgroundColor: "rgba(26, 27, 58, 0.95)",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#4f46e5",
          }}
        >
          <Text
            style={{
              color: "#4f46e5",
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            FOCUS TIME
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>

        {/* Sound toggle */}
        <TouchableOpacity
          onPress={toggleSound}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(26, 27, 58, 0.95)",
            borderWidth: 1,
            borderColor: "#4f46e5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {soundEnabled ? (
            <Volume2 color="#4f46e5" size={20} />
          ) : (
            <VolumeX color="#6b7280" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* Flight progress indicator */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(26, 27, 58, 0.95)",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#4f46e5",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{ color: "#10b981", fontSize: 12, fontWeight: "bold" }}
            >
              {departure?.city}
            </Text>
            <Text
              style={{ color: "#4f46e5", fontSize: 12, fontWeight: "bold" }}
            >
              {Math.round(flightProgress * 100)}% COMPLETE
            </Text>
            <Text
              style={{ color: "#ef4444", fontSize: 12, fontWeight: "bold" }}
            >
              {arrival?.city}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#374151",
              height: 6,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                backgroundColor: "#4f46e5",
                height: "100%",
                width: `${flightProgress * 100}%`,
                borderRadius: 3,
              }}
            />
          </View>

          <Text
            style={{
              color: "#9ca3af",
              fontSize: 11,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Altitude: 37,000 ft • Speed: 550 mph • {flightClass?.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0f23",
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#1a1b3a",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (isRunning) {
              Alert.alert(
                "Flight in Progress",
                "Are you sure you want to leave? Your current session will be lost.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Leave",
                    style: "destructive",
                    onPress: () => router.back(),
                  },
                ],
              );
            } else {
              router.back();
            }
          }}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Flight Focus Session
          </Text>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            {departure?.city} → {arrival?.city} | Seat {selectedSeat}
          </Text>
        </View>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
      >
        {/* Immersive Flight Map - 75% of screen */}
        {renderFlightMap()}

        {/* Simple Timer Controls at bottom */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 10,
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: isRunning ? "#ef4444" : "#10b981",
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
            }}
            onPress={isRunning ? pauseTimer : startTimer}
            disabled={timeRemaining <= 0}
          >
            {isRunning ? (
              <>
                <Pause color="white" size={20} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  Pause
                </Text>
              </>
            ) : (
              <>
                <Play color="white" size={20} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  {hasStarted ? "Resume" : "Start"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#374151",
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={resetTimer}
          >
            <RotateCcw color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* AI Flight Attendant */}
      {showAttendant && (
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top + 80,
            right: 20,
            backgroundColor: "#1a1b3a",
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: "#4f46e5",
            maxWidth: screenWidth - 80,
            opacity: attendantAnimated,
            transform: [
              {
                translateX: attendantAnimated.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
            zIndex: 100,
            elevation: 10,
            shadowColor: "#4f46e5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <UserCheck color="#4f46e5" size={20} />
            <Text
              style={{
                color: "#4f46e5",
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              Flight Attendant
            </Text>
          </View>
          <Text
            style={{
              color: "white",
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {attendantMessage}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
