# Car Kiosk Interface - Quick Start Guide 🚀

## Getting Started

1. **Open the app** - Simply open `index.html` in your browser
2. **Allow location access** - This enables the map and location features
3. **Explore the tabs** - Music, Payments, Weather, Location, and Notes

## Key Features

### 🎵 Music Section
- **Open Spotify**: Launches Spotify app (if installed) or web version
- **Top Songs**: Live feed of current US top 10 songs from iTunes

### 💳 Payment Section
- **QR Codes**: Your Venmo and Zelle QR codes for easy payments
- **Fun Tips**: Random driving humor and life advice

### 🌦️ Weather Section
- **Multi-location**: Pre-configured for San Francisco, Fresno, and Merced
- **Live Updates**: Real-time weather data with dark theme

### 🗺️ Location Section
- **Auto GPS**: Shows your current location automatically
- **Navigation**: Enter any address to get distance and directions
- **Live Updates**: Location refreshes every 5 minutes

### 📝 Notes Section
- **Passenger Communication**: Leave notes for the driver
- **Character Limit**: 500 characters with live counter
- **Local Storage**: Notes saved locally, last 5 shown

## Tips for Car Use

1. **Brightness Control**: Use the brightness slider (bottom right) for day/night driving
2. **Touch Friendly**: All buttons and controls are optimized for touch screens
3. **Offline Support**: Core features work offline after initial load
4. **Auto-Updates**: Date/time and location update automatically

## Troubleshooting

**Location not working?**
- Allow location permissions in your browser
- Check GPS signal strength
- Falls back to San Francisco if GPS unavailable

**Spotify not opening?**
- Install Spotify app for best experience
- Falls back to web version automatically

**Weather not loading?**
- Check internet connection
- Widgets load from external service

**Top songs not showing?**
- Requires internet connection
- Uses cached data when offline

## Customization

To customize for your needs:

1. **Change weather locations**: Edit the weather widget URLs in `index.html`
2. **Update QR codes**: Replace `venmo-qr.png` and `zelle-qr.png` with your codes
3. **Modify colors**: Edit CSS variables in `styles.css`

Enjoy your enhanced car kiosk experience! 🚗✨
