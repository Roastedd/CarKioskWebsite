# Car Kiosk Interface 🚗💻

A modern vehicle interface system providing essential driving features with an iOS-inspired design. Perfect for in-car tablets or smart dashboards.

![Car Kiosk Interface Preview](screenshot.jpg)

## Features ✨

### 🎵 Music Integration
- One-tap Spotify launch
- Real-time Top 10 US songs from iTunes
- iOS-style music list interface

### 💳 Payment Solutions
- QR code integration for Venmo and Zelle
- Random driving tips and humor
- Secure local storage for transaction history

### 🌦️ Weather Forecasts
- Multi-location weather display
- San Francisco, Fresno, and Merced presets
- Live weather updates with dark mode

### 🗺️ Smart Location Tracking
- Automatic GPS positioning on load
- Live updating map every 5 minutes
- Leaflet.js integration with OpenStreetMap
- Custom marker styling

### 📝 Passenger Notes
- Secure note storage with localStorage
- Timestamped message history
- Driver communication system

### 🕒 Always-On Clock
- Live date/time display
- Auto-updating every second
- Clean header presentation

## Installation ⚙️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/car-kiosk.git

## Installation ⚙️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/car-kiosk.git
```

2. Serve the files using any static server:
```bash
npx serve
```

3. Open in browser:
```bash
http://localhost:3000
```

*For best results use Chrome or Safari*

## Usage 🚀

1. **Spotify Integration**  
   - Requires Spotify app installed
   - Click "Open Spotify" for instant music access
   - Browse current top charts

2. **Payment Portal**  
   - Add your own QR codes (replace `venmo-qr.png` and `zelle-qr.png`)
   - Random tips appear above payment options

3. **Location Services**  
   - Automatically loads your position
   - Green marker shows current location
   - Map updates every 5 minutes

4. **Weather Widgets**  
   - Pre-configured for California cities
   - Click widgets for detailed forecasts

5. **Notes System**  
   - Stores last 5 notes locally
   - Timestamps all messages
   - Responsive textarea input

## Configuration ⚙️

1. **Weather Locations**  
   Modify weather widget URLs in `index.html`:
   ```html
   href="https://forecast7.com/en/37d77n122d42/san-francisco/?unit=us"
   ```

2. **QR Codes**  
   Replace placeholder images with your own:
   ```html
   <img src="venmo-qr.png" alt="Venmo QR Code">
   ```

3. **Location Settings**  
   Adjust update interval in `scripts.js`:
   ```javascript
   setInterval(getLocation, 300000) // 5 minutes
   ```

## Technologies Used 💻

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js (OpenStreetMap)
- **Weather**: Forecast7 Weather Widget
- **Icons**: Font Awesome 5
- **Music Data**: Apple iTunes API
- **Styling**: iOS-inspired neumorphic design

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

Open-source under [MIT License](LICENSE). Credit to original authors appreciated.

---

**Note**: This is a frontend-only project. For production use:
- Add HTTPS for geolocation
- Implement proper user authentication
- Add error handling for API calls
- Consider adding service workers for offline use

*Created with ❤️ by [Your Name] - Feel the road in digital style!*
