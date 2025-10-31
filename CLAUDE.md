# CLAUDE.md - FlightFocus Mobile App Development Guide

## 🎯 Project Overview
FlightFocus is a React Native mobile application built with Expo that gamifies productivity through an airline/flight theme. Users complete focus sessions to earn "business flights" and can take virtual flights as rewards for their productivity.

## 🛠️ Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Lucide React Native icons
- **Animations**: Moti, React Native Reanimated
- **Maps**: React Native Maps, @teovilla/react-native-web-maps
- **Graphics**: Expo GL, Three.js, @shopify/react-native-skia
- **Platform**: Cross-platform (iOS, Android, Web)

## 📁 Project Structure
```
flightFocus/_/apps/mobile/
├── src/
│   └── app/                    # Expo Router app directory
│       ├── (tabs)/            # Tab-based navigation
│       │   ├── index.jsx      # Flight selection/home
│       │   ├── timer.jsx      # Focus timer
│       │   ├── history.jsx    # Flight history
│       │   ├── seat-selection.jsx
│       │   ├── destination-selection.jsx
│       │   └── flight-screen.jsx
│       ├── _layout.jsx        # Root layout
│       └── +not-found.tsx    # 404 page
├── polyfills/                 # Web/native polyfills
├── assets/                    # Images and static files
├── App.tsx                    # App entry point
├── package.json              # Dependencies
└── app.json                  # Expo configuration
```

## 🚀 Development Commands

### Setup
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Build & Deploy
```bash
# Build for production
npx expo build

# EAS Build (if configured)
npx eas build --platform all
```

### Code Quality
```bash
# Apply patches
npm run postinstall
```

## 🏗️ Key App Features

### Core Functionality
1. **Flight Selection** (`index.jsx`): Choose between Economy and Business class flights
2. **Focus Timer** (`timer.jsx`): Pomodoro-style focus sessions
3. **Flight Experience** (`flight-screen.jsx`): Virtual flight during focus sessions
4. **History Tracking** (`history.jsx`): Past flights and statistics
5. **Seat Selection** (`seat-selection.jsx`): Choose your virtual seat
6. **Destination Selection** (`destination-selection.jsx`): Pick flight destination

### Gamification Elements
- **Business Flights**: Earned through completing focus sessions
- **Flight Classes**: Economy (always available) vs Business (earned reward)
- **Statistics**: Total focus time, completed flights
- **Virtual Experience**: 3D flight simulation during focus sessions

## 🎨 UI/UX Patterns

### Design System
- **Primary Color**: `#4f46e5` (Indigo)
- **Dark Theme**: `#1a1b3a` navigation background
- **Typography**: System fonts with custom weights
- **Icons**: Lucide React Native (Plane, Clock, Trophy, etc.)

### Navigation Structure
- **Tab Navigation**: Flight, Focus, History (visible tabs)
- **Hidden Screens**: Seat selection, destination selection, flight screen
- **Safe Area**: Properly handled with react-native-safe-area-context

## 🔧 Development Tips

### Adding New Features
1. Create new screen in `src/app/(tabs)/` for tab screens
2. Add to `_layout.jsx` tab configuration
3. Use existing patterns for styling and navigation
4. Follow the airline theme for UI metaphors

### State Management
- Use AsyncStorage for persistent data (flights, focus time)
- Zustand for complex app state
- React Query for remote data (if needed)

### Styling Patterns
```javascript
// Consistent styling approach
const styles = {
  container: {
    backgroundColor: "#1a1b3a",
    flex: 1,
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 16,
    borderRadius: 12,
  }
};
```

### Common Components Location
- Icons: Lucide React Native
- Safe Area: Always wrap screens in SafeAreaProvider
- Navigation: Use `router.push()` from expo-router

## 🐛 Debugging

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Platform-specific bugs**: Use polyfills in `/polyfills` directory
3. **AsyncStorage**: Check data persistence issues
4. **Navigation**: Ensure proper route configuration in `_layout.jsx`

### Logging
- Global error handling in `App.tsx`
- Console logs for AsyncStorage operations
- Error boundaries for crash prevention

## 📱 Platform Considerations

### iOS Specific
- Supports tablets (`supportsTablet: true`)
- Static frameworks for faster builds
- Proper Info.plist configuration

### Android Specific
- Adaptive icons configured
- Audio permissions for potential sound features
- Custom package name

### Web Specific
- Metro bundler for web
- Web-specific polyfills in `/polyfills/web/`
- Responsive design considerations

## 🚦 Testing Strategy
- Test focus timer functionality
- Verify AsyncStorage persistence
- Check navigation flows
- Test on multiple screen sizes
- Validate business flight earning/spending logic

## 📋 Code Review Checklist
- [ ] Follows existing code patterns
- [ ] Proper error handling for AsyncStorage
- [ ] Safe area insets handled
- [ ] Icons and styling consistent with theme
- [ ] Navigation properly configured
- [ ] Cross-platform compatibility
- [ ] Performance optimized (memoization where needed)

## 🔄 Data Flow
1. User opens app → Load data from AsyncStorage
2. Select flight class → Check business flights availability
3. Complete focus session → Update statistics, earn business flights
4. Navigate between screens → Maintain state consistency

## 🎯 Future Enhancements
- [ ] Real flight data integration
- [ ] Social features (leaderboards)
- [ ] More destination options
- [ ] Achievement system
- [ ] Sound effects and haptics
- [ ] Background sync capabilities