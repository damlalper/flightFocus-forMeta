const motivationalMessages = [
  {
    message: "Great progress! Keep going!",
    type: "encouragement",
  },
  {
    message: "You're doing amazing! Stay focused!",
    type: "motivation",
  },
  {
    message: "Almost there! Your destination is getting closer!",
    type: "progress",
  },
  {
    message: "Excellent focus! The view from up here is beautiful!",
    type: "scenery",
  },
  {
    message: "Stay on track! You're flying like a pro!",
    type: "encouragement",
  },
  {
    message: "Wonderful concentration! Enjoy your journey!",
    type: "motivation",
  },
  {
    message: "Keep it up! We're cruising at the perfect altitude!",
    type: "status",
  },
  {
    message: "Fantastic work! The captain is impressed!",
    type: "encouragement",
  },
  {
    message: "You're in the zone! Let's reach that destination!",
    type: "motivation",
  },
  {
    message: "Perfect flight so far! Maintain that focus!",
    type: "encouragement",
  },
  {
    message: "We're passing over beautiful landscapes below. Stay focused!",
    type: "scenery",
  },
  {
    message: "Your focus is inspiring other passengers!",
    type: "encouragement",
  },
  {
    message: "Smooth flying conditions ahead. Keep up the great work!",
    type: "status",
  },
  {
    message: "You're making excellent time to your destination!",
    type: "progress",
  },
  {
    message: "The captain has turned off the seatbelt sign. Stay focused!",
    type: "status",
  },
];

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const progress = parseFloat(url.searchParams.get("progress") || "0");
    const flightClass = url.searchParams.get("class") || "economy";

    // Select message based on progress and class
    let filteredMessages = motivationalMessages;

    if (progress > 0.8) {
      // Near completion messages
      filteredMessages = motivationalMessages.filter(
        (msg) =>
          msg.type === "progress" ||
          msg.message.includes("Almost") ||
          msg.message.includes("destination"),
      );
    } else if (progress > 0.5) {
      // Mid-flight messages
      filteredMessages = motivationalMessages.filter(
        (msg) => msg.type === "encouragement" || msg.type === "scenery",
      );
    } else {
      // Early flight messages
      filteredMessages = motivationalMessages.filter(
        (msg) => msg.type === "motivation" || msg.type === "status",
      );
    }

    // Add class-specific messages for business
    if (flightClass === "business") {
      filteredMessages.push({
        message: "Enjoy your premium Business class experience!",
        type: "business",
      });
      filteredMessages.push({
        message: "Your lie-flat seat is perfect for deep focus work!",
        type: "business",
      });
    }

    // Random selection
    const randomMessage =
      filteredMessages[Math.floor(Math.random() * filteredMessages.length)];

    return Response.json({
      message: randomMessage.message,
      type: randomMessage.type,
      timestamp: new Date().toISOString(),
      flightProgress: progress,
    });
  } catch (error) {
    console.error("Error generating flight attendant message:", error);

    return Response.json({
      message: "Keep up the great work! Stay focused!",
      type: "encouragement",
      timestamp: new Date().toISOString(),
      flightProgress: 0,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { progress, flightClass, departure, arrival, duration } = body;

    // Generate contextual message based on flight details
    let contextualMessage = `Great progress on your flight from ${departure} to ${arrival}!`;

    if (progress > 0.9) {
      contextualMessage = `Excellent work! You're almost at ${arrival}. Prepare for landing!`;
    } else if (progress > 0.5) {
      contextualMessage = `Halfway there! The view between ${departure} and ${arrival} is spectacular!`;
    } else if (duration > 60) {
      contextualMessage = `This is a long-haul flight to ${arrival}. Stay hydrated and keep focusing!`;
    }

    return Response.json({
      message: contextualMessage,
      type: "contextual",
      timestamp: new Date().toISOString(),
      flightProgress: progress,
      flightDetails: {
        departure,
        arrival,
        class: flightClass,
        duration,
      },
    });
  } catch (error) {
    console.error("Error generating contextual message:", error);

    return Response.json({
      message: "Keep focusing! You're doing great!",
      type: "encouragement",
      timestamp: new Date().toISOString(),
    });
  }
}
