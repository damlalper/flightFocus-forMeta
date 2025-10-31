import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import {
  Trophy,
  Clock,
  Crown,
  Plane,
  Calendar,
  TrendingUp,
  MapPin,
  Award,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [flightHistory, setFlightHistory] = useState([]);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalFocusTime: 0,
    businessFlights: 5,
    averageSessionLength: 0,
    longestSession: 0,
    currentStreak: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      const historyData = (await AsyncStorage.getItem("flightHistory")) || "[]";
      const history = JSON.parse(historyData);
      setFlightHistory(history);

      const totalFocusTime =
        (await AsyncStorage.getItem("totalFocusTime")) || "0";
      const businessFlights =
        (await AsyncStorage.getItem("businessFlights")) || "5";

      // Calculate stats
      const totalFlights = history.length;
      const totalTime = parseInt(totalFocusTime);
      const averageSessionLength =
        totalFlights > 0 ? Math.round(totalTime / totalFlights) : 0;
      const longestSession =
        history.length > 0 ? Math.max(...history.map((f) => f.duration)) : 0;

      // Calculate streak (consecutive days with flights)
      const currentStreak = calculateStreak(history);

      setStats({
        totalFlights,
        totalFocusTime: totalTime,
        businessFlights: parseInt(businessFlights),
        averageSessionLength,
        longestSession,
        currentStreak,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const calculateStreak = (history) => {
    if (history.length === 0) return 0;

    const today = new Date();
    const dates = history.map((flight) => {
      const date = new Date(flight.completedAt);
      return date.toDateString();
    });

    const uniqueDates = [...new Set(dates)].sort(
      (a, b) => new Date(b) - new Date(a),
    );

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < uniqueDates.length; i++) {
      const flightDate = new Date(uniqueDates[i]);
      const diffTime = currentDate - flightDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = flightDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getClassIcon = (flightClass) => {
    return flightClass === "business" ? Crown : Plane;
  };

  const getClassColor = (flightClass) => {
    return flightClass === "business" ? "#fbbf24" : "#6b7280";
  };

  const renderStatCard = (icon, title, value, subtitle, color = "#4f46e5") => (
    <View
      style={{
        backgroundColor: "#1a1b3a",
        borderRadius: 12,
        padding: 16,
        flex: 1,
        borderWidth: 1,
        borderColor: "#2d2d5a",
        alignItems: "center",
      }}
    >
      {React.createElement(icon, { color, size: 24 })}
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 8,
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: color,
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 2,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: "#9ca3af",
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const renderFlightItem = (flight, index) => {
    const ClassIcon = getClassIcon(flight.class);
    const classColor = getClassColor(flight.class);

    return (
      <View
        key={flight.id || index}
        style={{
          backgroundColor: "#1a1b3a",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#2d2d5a",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ClassIcon color={classColor} size={20} />
            <Text
              style={{
                color: classColor,
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 6,
                textTransform: "capitalize",
              }}
            >
              {flight.class}
            </Text>
            <Text
              style={{
                color: "#6b7280",
                fontSize: 12,
                marginLeft: 8,
              }}
            >
              Seat {flight.seat}
            </Text>
          </View>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 12,
            }}
          >
            {formatDate(flight.completedAt)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <MapPin color="#10b981" size={16} />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 6,
            }}
          >
            {flight.departure}
          </Text>
          <Plane color="#4f46e5" size={16} style={{ marginHorizontal: 8 }} />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {flight.arrival}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock color="#9ca3af" size={14} />
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 14,
                marginLeft: 4,
              }}
            >
              {formatTime(flight.duration)} focus session
            </Text>
          </View>

          {flight.duration >= 45 && (
            <View
              style={{
                backgroundColor: "#fbbf2420",
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Award color="#fbbf24" size={12} />
              <Text
                style={{
                  color: "#fbbf24",
                  fontSize: 10,
                  fontWeight: "bold",
                  marginLeft: 2,
                }}
              >
                Business Earned
              </Text>
            </View>
          )}
        </View>
      </View>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            <Trophy color="#4f46e5" size={32} />
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Flight History
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
            Track your focus journey progress
          </Text>
        </View>

        {/* Stats Overview */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Your Statistics
          </Text>

          {/* First Row */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {renderStatCard(
              Plane,
              "Total Flights",
              stats.totalFlights,
              "Completed sessions",
              "#4f46e5",
            )}
            {renderStatCard(
              Clock,
              "Focus Time",
              formatTime(stats.totalFocusTime),
              "Total focused",
              "#10b981",
            )}
          </View>

          {/* Second Row */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {renderStatCard(
              Crown,
              "Business Flights",
              stats.businessFlights,
              "Premium available",
              "#fbbf24",
            )}
            {renderStatCard(
              TrendingUp,
              "Daily Streak",
              stats.currentStreak,
              "Consecutive days",
              "#8b5cf6",
            )}
          </View>

          {/* Third Row */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            {renderStatCard(
              Clock,
              "Average Session",
              formatTime(stats.averageSessionLength),
              "Per flight",
              "#06b6d4",
            )}
            {renderStatCard(
              Award,
              "Longest Session",
              formatTime(stats.longestSession),
              "Personal best",
              "#ef4444",
            )}
          </View>
        </View>

        {/* Recent Flights */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Recent Flights
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/")}>
              <Text
                style={{
                  color: "#4f46e5",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                New Flight
              </Text>
            </TouchableOpacity>
          </View>

          {flightHistory.length === 0 ? (
            <View
              style={{
                backgroundColor: "#1a1b3a",
                borderRadius: 12,
                padding: 32,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#2d2d5a",
              }}
            >
              <Plane color="#6b7280" size={48} />
              <Text
                style={{
                  color: "#9ca3af",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                No flights yet
              </Text>
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                Complete your first focus session to see it here
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#4f46e5",
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => router.push("/(tabs)/")}
              >
                <Plane color="white" size={16} />
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    marginLeft: 6,
                  }}
                >
                  Start First Flight
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            flightHistory.slice(0, 20).map(renderFlightItem)
          )}
        </View>

        {/* Achievement Card */}
        {stats.totalFlights >= 5 && (
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "#065f46",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: "#10b981",
                alignItems: "center",
              }}
            >
              <Trophy color="#10b981" size={32} />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                Focused Flyer! ✈️
              </Text>
              <Text
                style={{
                  color: "#a7f3d0",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                You've completed {stats.totalFlights} focus flights! Keep up the
                excellent work and maintain your focus streak.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
