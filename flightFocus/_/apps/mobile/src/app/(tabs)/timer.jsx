import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Clock,
  Play,
  Plus,
  Zap,
  Coffee,
  Focus,
  Moon,
} from "lucide-react-native";

const quickTimerPresets = [
  { id: "1", name: "Quick Focus", duration: 15, icon: Zap, color: "#ef4444" },
  { id: "2", name: "Pomodoro", duration: 25, icon: Focus, color: "#f59e0b" },
  { id: "3", name: "Short Break", duration: 5, icon: Coffee, color: "#10b981" },
  { id: "4", name: "Deep Work", duration: 60, icon: Focus, color: "#8b5cf6" },
  { id: "5", name: "Long Break", duration: 15, icon: Moon, color: "#06b6d4" },
  {
    id: "6",
    name: "Extended Focus",
    duration: 90,
    icon: Focus,
    color: "#6366f1",
  },
];

export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const [customMinutes, setCustomMinutes] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const startQuickTimer = (duration, name) => {
    // For quick timers, we'll use default locations and skip seat selection
    const defaultDeparture = "2"; // London
    const defaultArrival = "4"; // Paris

    router.push({
      pathname: "/(tabs)/flight-screen",
      params: {
        flightClass: "economy",
        selectedSeat: "A1",
        departureId: defaultDeparture,
        arrivalId: defaultArrival,
        flightDuration: duration.toString(),
      },
    });
  };

  const startCustomTimer = () => {
    const duration = parseInt(customMinutes);

    if (!duration || duration < 1) {
      Alert.alert(
        "Invalid Duration",
        "Please enter a valid number of minutes (1-999).",
      );
      return;
    }

    if (duration > 999) {
      Alert.alert("Duration Too Long", "Maximum duration is 999 minutes.");
      return;
    }

    // For custom timers, use default locations
    const defaultDeparture = "1"; // New York
    const defaultArrival = "3"; // Tokyo

    router.push({
      pathname: "/(tabs)/flight-screen",
      params: {
        flightClass: "economy",
        selectedSeat: "A1",
        departureId: defaultDeparture,
        arrivalId: defaultArrival,
        flightDuration: duration.toString(),
      },
    });

    setCustomMinutes("");
    setShowCustomInput(false);
  };

  const renderPreset = (preset) => {
    const IconComponent = preset.icon;

    return (
      <TouchableOpacity
        key={preset.id}
        style={{
          backgroundColor: "#1a1b3a",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#2d2d5a",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => startQuickTimer(preset.duration, preset.name)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${preset.color}20`,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <IconComponent color={preset.color} size={24} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              {preset.name}
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              {preset.duration} minutes
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: preset.color,
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => startQuickTimer(preset.duration, preset.name)}
        >
          <Play color="white" size={16} />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            Start
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
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
            <Clock color="#4f46e5" size={32} />
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Quick Timer
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
            Start a focus session instantly
          </Text>
        </View>

        {/* Quick Timer Presets */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Popular Timers
          </Text>

          {quickTimerPresets.map(renderPreset)}
        </View>

        {/* Custom Timer */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#1a1b3a",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#2d2d5a",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Plus color="#4f46e5" size={24} />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginLeft: 8,
                }}
              >
                Custom Timer
              </Text>
            </View>

            <Text
              style={{
                color: "#9ca3af",
                fontSize: 14,
                marginBottom: 16,
                lineHeight: 20,
              }}
            >
              Set your own focus duration from 1 to 999 minutes
            </Text>

            {!showCustomInput ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4f46e5",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                onPress={() => setShowCustomInput(true)}
              >
                <Plus color="white" size={20} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  Create Custom Timer
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      backgroundColor: "#2d2d5a",
                      borderRadius: 12,
                      padding: 16,
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                      marginRight: 12,
                    }}
                    placeholder="Enter minutes"
                    placeholderTextColor="#6b7280"
                    value={customMinutes}
                    onChangeText={setCustomMinutes}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={{ color: "#9ca3af", fontSize: 16 }}>
                    minutes
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "#374151",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      setShowCustomInput(false);
                      setCustomMinutes("");
                    }}
                  >
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: "#10b981",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                      opacity: customMinutes ? 1 : 0.6,
                    }}
                    onPress={startCustomTimer}
                    disabled={!customMinutes}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Start Timer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Full Flight Experience */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#1a1b3a",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#fbbf24",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#fbbf2420",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Clock color="#fbbf24" size={24} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                >
                  Full Flight Experience
                </Text>
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  Choose seat, destination & class
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#fbbf24",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => router.push("/(tabs)/")}
            >
              <Text
                style={{
                  color: "#1a1b3a",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                Start Flight Journey
              </Text>
              <Play color="#1a1b3a" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#065f46",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#10b981",
            }}
          >
            <Text
              style={{
                color: "#a7f3d0",
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Focus Tips 💡
            </Text>
            <Text
              style={{
                color: "#a7f3d0",
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              • Use the Pomodoro technique: 25 min work, 5 min break{"\n"}• Turn
              off notifications during focus sessions{"\n"}• Complete 45+ minute
              sessions to earn Business flights
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
