import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Plane,
  Globe,
  ArrowRight,
} from "lucide-react-native";

// Mock destinations data
const destinations = [
  // Popular destinations
  {
    id: "1",
    city: "New York",
    country: "USA",
    code: "JFK",
    coordinates: [40.6413, -73.7781],
  },
  {
    id: "2",
    city: "London",
    country: "UK",
    code: "LHR",
    coordinates: [51.47, -0.4543],
  },
  {
    id: "3",
    city: "Tokyo",
    country: "Japan",
    code: "NRT",
    coordinates: [35.7653, 140.3856],
  },
  {
    id: "4",
    city: "Paris",
    country: "France",
    code: "CDG",
    coordinates: [49.0097, 2.5479],
  },
  {
    id: "5",
    city: "Dubai",
    country: "UAE",
    code: "DXB",
    coordinates: [25.2532, 55.3657],
  },
  {
    id: "6",
    city: "Singapore",
    country: "Singapore",
    code: "SIN",
    coordinates: [1.3644, 103.9915],
  },
  {
    id: "7",
    city: "Los Angeles",
    country: "USA",
    code: "LAX",
    coordinates: [33.9425, -118.4081],
  },
  {
    id: "8",
    city: "Sydney",
    country: "Australia",
    code: "SYD",
    coordinates: [-33.9399, 151.1753],
  },
  {
    id: "9",
    city: "Amsterdam",
    country: "Netherlands",
    code: "AMS",
    coordinates: [52.3105, 4.7683],
  },
  {
    id: "10",
    city: "Frankfurt",
    country: "Germany",
    code: "FRA",
    coordinates: [50.0379, 8.5622],
  },
  {
    id: "11",
    city: "Hong Kong",
    country: "Hong Kong",
    code: "HKG",
    coordinates: [22.308, 113.9185],
  },
  {
    id: "12",
    city: "Barcelona",
    country: "Spain",
    code: "BCN",
    coordinates: [41.2974, 2.0833],
  },
  {
    id: "13",
    city: "Rome",
    country: "Italy",
    code: "FCO",
    coordinates: [41.7999, 12.2462],
  },
  {
    id: "14",
    city: "Bangkok",
    country: "Thailand",
    code: "BKK",
    coordinates: [13.69, 100.7501],
  },
  {
    id: "15",
    city: "Mumbai",
    country: "India",
    code: "BOM",
    coordinates: [19.0896, 72.8656],
  },
  {
    id: "16",
    city: "São Paulo",
    country: "Brazil",
    code: "GRU",
    coordinates: [-23.4356, -46.4731],
  },
  {
    id: "17",
    city: "Cairo",
    country: "Egypt",
    code: "CAI",
    coordinates: [30.1219, 31.4056],
  },
  {
    id: "18",
    city: "Istanbul",
    country: "Turkey",
    code: "IST",
    coordinates: [41.2753, 28.7519],
  },
  {
    id: "19",
    city: "Toronto",
    country: "Canada",
    code: "YYZ",
    coordinates: [43.6777, -79.6248],
  },
  {
    id: "20",
    city: "Moscow",
    country: "Russia",
    code: "SVO",
    coordinates: [55.9726, 37.4146],
  },
];

export default function DestinationSelection() {
  const insets = useSafeAreaInsets();
  const { flightClass, selectedSeat } = useLocalSearchParams();
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [selecting, setSelecting] = useState("departure"); // 'departure' or 'arrival'
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate in
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const selectDestination = (destination) => {
    if (selecting === "departure") {
      setDeparture(destination);
      setSelecting("arrival");
    } else {
      if (destination.id === departure?.id) {
        Alert.alert(
          "Invalid Selection",
          "Arrival city cannot be the same as departure city.",
        );
        return;
      }
      setArrival(destination);
    }
  };

  const calculateFlightDuration = (dep, arr) => {
    if (!dep || !arr) return 0;

    // Simple distance calculation for flight duration estimation
    const lat1 = (dep.coordinates[0] * Math.PI) / 180;
    const lon1 = (dep.coordinates[1] * Math.PI) / 180;
    const lat2 = (arr.coordinates[0] * Math.PI) / 180;
    const lon2 = (arr.coordinates[1] * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Distance in km

    // Rough flight time estimation (km/h average speed)
    const avgSpeed = 800; // km/h
    const flightTimeHours = distance / avgSpeed;

    return Math.max(Math.round(flightTimeHours * 60), 15); // Minimum 15 minutes
  };

  const handleContinue = () => {
    if (!departure || !arrival) {
      Alert.alert(
        "Select Destinations",
        "Please select both departure and arrival cities.",
      );
      return;
    }

    const flightDuration = calculateFlightDuration(departure, arrival);

    router.push({
      pathname: "/(tabs)/flight-screen",
      params: {
        flightClass,
        selectedSeat,
        departureId: departure.id,
        arrivalId: arrival.id,
        flightDuration: flightDuration.toString(),
      },
    });
  };

  const renderDestination = (destination) => {
    const isSelected =
      (selecting === "departure" ? departure?.id : arrival?.id) ===
      destination.id;
    const isDisabled =
      selecting === "arrival" && departure?.id === destination.id;

    return (
      <TouchableOpacity
        key={destination.id}
        style={{
          backgroundColor: isSelected ? "#4f46e5" : "#1a1b3a",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isSelected ? "#4f46e5" : "#374151",
          opacity: isDisabled ? 0.4 : 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => !isDisabled && selectDestination(destination)}
        disabled={isDisabled}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <MapPin color={isSelected ? "white" : "#9ca3af"} size={18} />
            <Text
              style={{
                color: isSelected ? "white" : "white",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              {destination.city}
            </Text>
            <Text
              style={{
                color: isSelected ? "#e0e7ff" : "#6b7280",
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 8,
                backgroundColor: isSelected
                  ? "rgba(255,255,255,0.2)"
                  : "#374151",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              {destination.code}
            </Text>
          </View>
          <Text
            style={{
              color: isSelected ? "#e0e7ff" : "#9ca3af",
              fontSize: 14,
            }}
          >
            {destination.country}
          </Text>
        </View>

        {isDisabled && (
          <Text
            style={{
              color: "#6b7280",
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            Departure
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const flightDuration = calculateFlightDuration(departure, arrival);

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
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Choose Destination
          </Text>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            {selecting === "departure"
              ? "Select departure city"
              : "Select arrival city"}
          </Text>
        </View>
      </View>

      {/* Flight Route Summary */}
      {(departure || arrival) && (
        <View
          style={{
            margin: 20,
            backgroundColor: "#1a1b3a",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#2d2d5a",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Departure */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: departure ? "white" : "#6b7280",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {departure ? departure.city : "Select"}
              </Text>
              <Text
                style={{
                  color: departure ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
              >
                {departure ? departure.code : "FROM"}
              </Text>
            </View>

            {/* Arrow & Flight Info */}
            <View style={{ alignItems: "center", marginHorizontal: 16 }}>
              <Plane color="#4f46e5" size={24} />
              {departure && arrival && (
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {Math.floor(flightDuration / 60)}h {flightDuration % 60}m
                </Text>
              )}
            </View>

            {/* Arrival */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: arrival ? "white" : "#6b7280",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {arrival ? arrival.city : "Select"}
              </Text>
              <Text
                style={{
                  color: arrival ? "#9ca3af" : "#6b7280",
                  fontSize: 12,
                }}
              >
                {arrival ? arrival.code : "TO"}
              </Text>
            </View>
          </View>

          {/* Selection Status */}
          <View
            style={{
              marginTop: 12,
              padding: 8,
              backgroundColor:
                selecting === "departure" ? "#0f4c75" : "#065f46",
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor:
                selecting === "departure" ? "#4f46e5" : "#10b981",
            }}
          >
            <Text
              style={{
                color: selecting === "departure" ? "#93c5fd" : "#a7f3d0",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {selecting === "departure"
                ? "Step 1: Choose your departure city"
                : "Step 2: Choose your arrival city"}
            </Text>
          </View>
        </View>
      )}

      {/* Destinations List */}
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Globe color="#9ca3af" size={20} />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 8,
              }}
            >
              Popular Destinations
            </Text>
          </View>

          {destinations.map(renderDestination)}
        </ScrollView>
      </Animated.View>

      {/* Continue Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#0f0f23",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: "#1a1b3a",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: departure && arrival ? "#4f46e5" : "#374151",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            opacity: departure && arrival ? 1 : 0.6,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={handleContinue}
          disabled={!departure || !arrival}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginRight: 8,
            }}
          >
            Start Flight
          </Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
