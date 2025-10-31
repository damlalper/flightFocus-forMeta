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
import { ArrowLeft, CheckCircle } from "lucide-react-native";

export default function SeatSelection() {
  const insets = useSafeAreaInsets();
  const { flightClass } = useLocalSearchParams();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate in
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const generateEconomySeats = () => {
    const rows = [];
    for (let row = 1; row <= 30; row++) {
      // Economy layout: A,B,C (left) - D,E,F,G (middle) - H,I (right)
      const seats = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      const seatRow = [];

      seats.forEach((letter, index) => {
        const seatId = `${row}${letter}`;
        const isAisle = index === 2 || index === 6; // C and G are aisle seats
        const isOccupied = Math.random() < 0.3; // Randomly occupy some seats

        seatRow.push({ id: seatId, letter, isAisle, isOccupied });
      });

      rows.push({ row, seats: seatRow });
    }
    return rows;
  };

  const generateBusinessSeats = () => {
    const rows = [];
    for (let row = 1; row <= 12; row++) {
      // Business layout: A (left) - D (middle) - F (right) - wider spacing
      const seats = ["A", "D", "F"];
      const seatRow = [];

      seats.forEach((letter) => {
        const seatId = `${row}${letter}`;
        const isOccupied = Math.random() < 0.2; // Less occupied in business

        seatRow.push({ id: seatId, letter, isOccupied });
      });

      rows.push({ row, seats: seatRow });
    }
    return rows;
  };

  const seatRows =
    flightClass === "business"
      ? generateBusinessSeats()
      : generateEconomySeats();

  const renderSeat = (seat, rowNumber) => {
    const isSelected = selectedSeat === seat.id;
    const isOccupied = seat.isOccupied;

    return (
      <TouchableOpacity
        key={seat.id}
        style={{
          width: flightClass === "business" ? 50 : 32,
          height: flightClass === "business" ? 60 : 40,
          marginHorizontal: flightClass === "business" ? 8 : 3,
          marginVertical: 2,
          borderRadius: flightClass === "business" ? 12 : 8,
          backgroundColor: isOccupied
            ? "#374151"
            : isSelected
              ? "#4f46e5"
              : flightClass === "business"
                ? "#1f2937"
                : "#1a1b3a",
          borderWidth: isSelected ? 2 : 1,
          borderColor: isOccupied
            ? "#6b7280"
            : isSelected
              ? "#4f46e5"
              : "#374151",
          justifyContent: "center",
          alignItems: "center",
          opacity: isOccupied ? 0.5 : 1,
        }}
        onPress={() => !isOccupied && setSelectedSeat(seat.id)}
        disabled={isOccupied}
      >
        {isSelected && (
          <CheckCircle
            color="white"
            size={flightClass === "business" ? 20 : 14}
          />
        )}
        {!isSelected && !isOccupied && (
          <Text
            style={{
              color: "#9ca3af",
              fontSize: flightClass === "business" ? 12 : 10,
              fontWeight: "600",
            }}
          >
            {seat.letter}
          </Text>
        )}
        {isOccupied && (
          <View
            style={{
              width: flightClass === "business" ? 16 : 12,
              height: flightClass === "business" ? 16 : 12,
              borderRadius: flightClass === "business" ? 8 : 6,
              backgroundColor: "#6b7280",
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderEconomyRow = (rowData) => {
    const { row, seats } = rowData;
    return (
      <View
        key={row}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 2,
        }}
      >
        {/* Row number */}
        <Text
          style={{
            color: "#6b7280",
            fontSize: 10,
            width: 20,
            textAlign: "center",
          }}
        >
          {row}
        </Text>

        {/* Left section: A,B,C */}
        <View style={{ flexDirection: "row" }}>
          {seats.slice(0, 3).map((seat) => renderSeat(seat, row))}
        </View>

        {/* Aisle */}
        <View style={{ width: 16 }} />

        {/* Middle section: D,E,F,G */}
        <View style={{ flexDirection: "row" }}>
          {seats.slice(3, 7).map((seat) => renderSeat(seat, row))}
        </View>

        {/* Aisle */}
        <View style={{ width: 16 }} />

        {/* Right section: H,I */}
        <View style={{ flexDirection: "row" }}>
          {seats.slice(7, 9).map((seat) => renderSeat(seat, row))}
        </View>
      </View>
    );
  };

  const renderBusinessRow = (rowData) => {
    const { row, seats } = rowData;
    return (
      <View
        key={row}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 6,
          justifyContent: "center",
        }}
      >
        {/* Row number */}
        <Text
          style={{
            color: "#6b7280",
            fontSize: 12,
            width: 24,
            textAlign: "center",
          }}
        >
          {row}
        </Text>

        {/* Left: A */}
        <View style={{ flexDirection: "row" }}>
          {renderSeat(seats[0], row)}
        </View>

        {/* Wide aisle */}
        <View style={{ width: 40 }} />

        {/* Middle: D */}
        <View style={{ flexDirection: "row" }}>
          {renderSeat(seats[1], row)}
        </View>

        {/* Wide aisle */}
        <View style={{ width: 40 }} />

        {/* Right: F */}
        <View style={{ flexDirection: "row" }}>
          {renderSeat(seats[2], row)}
        </View>
      </View>
    );
  };

  const handleContinue = () => {
    if (!selectedSeat) {
      Alert.alert(
        "Please Select a Seat",
        "Choose your preferred seat to continue.",
      );
      return;
    }

    router.push({
      pathname: "/(tabs)/destination-selection",
      params: {
        flightClass,
        selectedSeat,
      },
    });
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
            Select Your Seat
          </Text>
          <Text
            style={{
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            {flightClass === "business" ? "Business Class" : "Economy Class"}
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#1a1b3a",
          marginHorizontal: 20,
          marginTop: 10,
          borderRadius: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor: "#4f46e5",
              marginRight: 8,
            }}
          />
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>Selected</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor:
                flightClass === "business" ? "#1f2937" : "#1a1b3a",
              borderWidth: 1,
              borderColor: "#374151",
              marginRight: 8,
            }}
          />
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>Available</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              backgroundColor: "#374151",
              marginRight: 8,
            }}
          />
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>Occupied</Text>
        </View>
      </View>

      {/* Airplane Cabin */}
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
          {/* Cockpit */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 40,
                backgroundColor: "#1a1b3a",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                borderWidth: 2,
                borderColor: "#374151",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#6b7280", fontSize: 10 }}>COCKPIT</Text>
            </View>
          </View>

          {/* Seat Map */}
          <View
            style={{
              backgroundColor: "#111827",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#1f2937",
            }}
          >
            {seatRows.map((rowData) =>
              flightClass === "business"
                ? renderBusinessRow(rowData)
                : renderEconomyRow(rowData),
            )}
          </View>
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
        {selectedSeat && (
          <View
            style={{
              backgroundColor: "#1a1b3a",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#4f46e5",
            }}
          >
            <Text
              style={{ color: "#93c5fd", fontSize: 14, textAlign: "center" }}
            >
              Selected: Seat {selectedSeat}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: selectedSeat ? "#4f46e5" : "#374151",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            opacity: selectedSeat ? 1 : 0.6,
          }}
          onPress={handleContinue}
          disabled={!selectedSeat}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Continue to Destination
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
