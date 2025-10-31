# ✈️ FlightFocus Mobile App

> **Gamify your productivity with virtual flights** - Complete focus sessions, earn business class flights, and explore the world while staying productive.

## 🌟 Overview

FlightFocus transforms productivity into an engaging flight experience. Users complete focused work sessions to earn "business flights" and can take virtual flights as rewards, making productivity both fun and rewarding through airline-themed gamification.

## ✨ Features

### 🎯 **Focus Sessions**
- Pomodoro-style focus timer with customizable durations
- Immersive virtual flight experience during focus sessions
- Real-time 3D flight simulation with destination views

### ✈️ **Flight System**
- **Economy Class**: Always available for any focus session
- **Business Class**: Premium experience earned through completed sessions
- **Seat Selection**: Choose your preferred virtual seat
- **Destination Selection**: Pick from various global destinations

### 📊 **Progress Tracking**
- Complete flight history with statistics
- Total focus time accumulation
- Business flight earning and spending system
- Achievement-based progression

### 🎮 **Gamification**
- Earn business flights by completing focus sessions
- Unlock premium flight experiences
- Visual progress indicators and statistics
- Reward-based motivation system

## 🛠️ Technology Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand + AsyncStorage
- **Data Fetching**: TanStack React Query
- **3D Graphics**: Three.js + Expo GL + React Native Skia
- **Maps Integration**: React Native Maps
- **Animations**: React Native Reanimated + Moti
- **Cross-Platform**: iOS, Android, and Web support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator (for mobile development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FlightFocus-MobileApp

# Navigate to the mobile app
cd flightFocus/_/apps/mobile

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

```bash
# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on Web
npx expo start --web
```

## 📱 App Architecture

### Screen Structure
```
📱 FlightFocus App
├── 🏠 Home (Flight Selection)
│   ├── Economy Class (Always Available)
│   └── Business Class (Earned Reward)
├── ⏰ Focus Timer
│   └── Virtual Flight Experience
├── 📊 History & Statistics
├── 💺 Seat Selection
├── 🗺️ Destination Selection
└── ✈️ In-Flight Experience
```

### Key Components

- **Flight Selection**: Choose between economy and business class flights
- **Focus Timer**: Customizable pomodoro sessions with flight simulation
- **Flight Experience**: Immersive 3D flight during focus sessions
- **Progress Tracking**: Statistics, history, and achievement tracking
- **Gamification**: Business flight earning system and rewards

## 🎨 Design Philosophy

### Airline Theme
- Consistent airline/aviation visual metaphors
- Professional color scheme with indigo primary (`#4f46e5`)
- Intuitive flight-based navigation and terminology
- Premium feel with business class reward system

### User Experience
- **Immediate Gratification**: Economy flights always available
- **Earned Rewards**: Business flights as productivity incentives
- **Visual Progress**: Clear statistics and achievement tracking
- **Immersive Experience**: 3D flight simulation during focus sessions

## 🔧 Development

### Project Structure
```
flightFocus/_/apps/mobile/
├── src/app/                   # Expo Router pages
│   ├── (tabs)/               # Tab navigation screens
│   │   ├── index.jsx         # Flight selection home
│   │   ├── timer.jsx         # Focus timer
│   │   ├── history.jsx       # Flight history
│   │   └── ...
│   └── _layout.jsx           # Root layout
├── polyfills/                # Platform-specific polyfills
├── assets/                   # Images and static resources
└── package.json             # Dependencies and scripts
```

### Key Development Commands
```bash
# Install dependencies
npm install

# Start development
npx expo start

# Clear cache (if needed)
npx expo start --clear

# Build for production
npx expo build
```

## 📋 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Follow existing code patterns and airline theme
4. Test on multiple platforms (iOS, Android, Web)
5. Submit pull request with clear description

### Code Style
- Follow existing React Native and Expo conventions
- Use functional components with hooks
- Maintain airline theme consistency
- Implement proper error handling for AsyncStorage operations

## 🎯 Roadmap

### Current Features ✅
- [x] Focus timer with virtual flights
- [x] Business flight earning system
- [x] Flight history and statistics
- [x] Seat and destination selection
- [x] Cross-platform support (iOS, Android, Web)

### Upcoming Features 🚧
- [ ] Real-time flight data integration
- [ ] Social features and leaderboards
- [ ] Achievement badges and rewards
- [ ] Sound effects and haptic feedback
- [ ] Background sync and notifications
- [ ] Premium destination unlocks

## 📊 Performance

### Optimization Features
- React Native's new architecture support
- Efficient state management with Zustand
- Optimized 3D rendering with React Native Skia
- Smart caching with React Query
- Proper memory management for graphics

## 🌐 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **iOS** | ✅ Full Support | Native performance, tablet support |
| **Android** | ✅ Full Support | Adaptive icons, permissions |
| **Web** | ✅ Full Support | Responsive design, Metro bundler |

## 🔒 Privacy & Data

- **Local Storage**: All user data stored locally with AsyncStorage
- **No Account Required**: Works completely offline
- **Privacy First**: No personal data collection or external analytics
- **Secure**: No network requests for core functionality

## 🐛 Issues & Support

### Common Issues
- **App not starting**: Try `npx expo start --clear` to clear Metro cache
- **Platform-specific bugs**: Check `/polyfills` directory for platform fixes
- **Navigation issues**: Verify route configuration in `_layout.jsx`

### Getting Help
1. Check the [CLAUDE.md](./CLAUDE.md) for detailed development guidance
2. Review existing issues in the repository
3. Create a new issue with detailed reproduction steps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent React Native framework
- **React Native Community** for powerful libraries and tools
- **Aviation Industry** for inspiration on gamification through flight metaphors
- **Productivity Community** for focus techniques and pomodoro methodology

---

**Ready for takeoff?** 🛫 Start your productivity journey with FlightFocus and turn every work session into a rewarding flight experience!