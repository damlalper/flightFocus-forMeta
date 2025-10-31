import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Crown, Plane, Star, Clock, Award } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FlightHome() {
  const insets = useSafeAreaInsets();
  const [businessFlights, setBusinessFlights] = useState(5);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const flights = await AsyncStorage.getItem("businessFlights");
      const focusTime = await AsyncStorage.getItem("totalFocusTime");
      const firstTime = await AsyncStorage.getItem("hasLaunched");

      if (flights) setBusinessFlights(parseInt(flights));
      if (focusTime) setTotalFocusTime(parseInt(focusTime));
      if (!firstTime) {
        setIsFirstTime(true);
        await AsyncStorage.setItem("hasLaunched", "true");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const selectFlightClass = async (flightClass) => {
    if (flightClass === "business" && businessFlights <= 0) {
      Alert.alert(
        "No Business Flights Available",
        "You need to earn more Business flights by completing focus sessions.",
        [{ text: "OK" }],
      );
      return;
    }

    setSelectedClass(flightClass);

    if (flightClass === "business") {
      const newCount = businessFlights - 1;
      setBusinessFlights(newCount);
      await AsyncStorage.setItem("businessFlights", newCount.toString());
    }

    // Navigate to seat selection
    router.push({
      pathname: "/(tabs)/seat-selection",
      params: { flightClass },
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0f23",
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ padding: 20, alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Plane color="#4f46e5" size={32} />
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Flight Focus
            </Text>
          </View>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 16,
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Turn your focus time into a virtual journey
          </Text>
        </View>

        {/* Stats Card */}
        <View
          style={{
            margin: 20,
            backgroundColor: "#1a1b3a",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#2d2d5a",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Your Progress
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Crown color="#fbbf24" size={24} />
              <Text
                style={{
                  color: "#fbbf24",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {businessFlights}
              </Text>
              <Text
                style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}
              >
                Business Flights
              </Text>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Clock color="#10b981" size={24} />
              <Text
                style={{
                  color: "#10b981",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {formatTime(totalFocusTime)}
              </Text>
              <Text
                style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}
              >
                Focus Time
              </Text>
            </View>
          </View>

          {businessFlights > 0 && (
            <View
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#0f4c75",
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: "#4f46e5",
              }}
            >
              <Text style={{ color: "#93c5fd", fontSize: 14 }}>
                You have {businessFlights} Business flights remaining
              </Text>
            </View>
          )}

          {businessFlights === 0 && (
            <View
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: "#7f1d1d",
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: "#ef4444",
              }}
            >
              <Text style={{ color: "#fca5a5", fontSize: 14 }}>
                Complete focus sessions to earn Business flights
              </Text>
            </View>
          )}
        </View>

        {isFirstTime && (
          <View
            style={{
              margin: 20,
              backgroundColor: "#065f46",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#10b981",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Star color="#10b981" size={20} />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 8,
                }}
              >
                Welcome to Flight Focus!
              </Text>
            </View>
            <Text style={{ color: "#a7f3d0", fontSize: 14, lineHeight: 20 }}>
              You start with 5 free Business class flights. Choose your class
              and begin your first focus journey!
            </Text>
          </View>
        )}

        {/* Class Selection */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Choose Your Flight Class
          </Text>

          {/* Economy Class */}
          <TouchableOpacity
            style={{
              backgroundColor: "#1a1b3a",
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 2,
              borderColor: "#2d2d5a",
            }}
            onPress={() => selectFlightClass("economy")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Plane color="#6b7280" size={28} />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 12,
                }}
              >
                Economy Class
              </Text>
            </View>
            <Text style={{ color: "#9ca3af", fontSize: 14, lineHeight: 20 }}>
              • Standard seating layout{"\n"}• Perfect for focused work sessions
              {"\n"}• Always available
            </Text>
          </TouchableOpacity>

          {/* Business Class */}
          <TouchableOpacity
            style={{
              backgroundColor: businessFlights > 0 ? "#1a1b3a" : "#374151",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor: businessFlights > 0 ? "#fbbf24" : "#6b7280",
              opacity: businessFlights > 0 ? 1 : 0.6,
            }}
            onPress={() => selectFlightClass("business")}
            disabled={businessFlights <= 0}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Crown color="#fbbf24" size={28} />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 12,
                }}
              >
                Business Class
              </Text>
              {businessFlights > 0 && (
                <View
                  style={{
                    backgroundColor: "#fbbf24",
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#1a1b3a",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {businessFlights} left
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ color: "#9ca3af", fontSize: 14, lineHeight: 20 }}>
              • Premium lie-flat seating{"\n"}• Enhanced focus experience{"\n"}•
              Earn more through consistent focusing
            </Text>

            {businessFlights <= 0 && (
              <View
                style={{
                  marginTop: 12,
                  padding: 8,
                  backgroundColor: "#7f1d1d",
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: "#fca5a5",
                    fontSize: 12,
                    textAlign: "center",
                  }}
                >
                  Complete focus sessions to unlock
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
