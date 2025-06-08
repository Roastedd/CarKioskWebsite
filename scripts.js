// Enhanced Car Kiosk Interface - v2.0
// Weather Widget Loader
!function(d,s,id){
  var js,fjs=d.getElementsByTagName(s)[0];
  if(!d.getElementById(id)){
    js=d.createElement(s);
    js.id=id; 
    js.src='https://weatherwidget.io/js/widget.min.js';
    fjs.parentNode.insertBefore(js,fjs);
  }
}(document,'script','weatherwidget-io-js');

// Global variables
let map;
let locationUpdateInterval;
let currentPosition = null;
let isAppReady = false;

// Utility functions
const utils = {
  // Debounce function to limit API calls
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Show error notification
  showError: (message, duration = 5000) => {
    const notification = document.getElementById('error-notification');
    const messageEl = document.getElementById('error-message');
    messageEl.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  },

  // Hide loading overlay
  hideLoading: () => {
    const overlay = document.getElementById('loading-overlay');
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }, 1000);
  },

  // Sanitize HTML to prevent XSS
  sanitizeHTML: (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }
};

// Hide error notification
function hideError() {
  document.getElementById('error-notification').classList.remove('show');
}

// Enhanced Date Time Updater with error handling
function updateDateTime() {
  try {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    };
    const dateTimeEl = document.getElementById('currentDateTime');
    if (dateTimeEl) {
      dateTimeEl.textContent = new Date().toLocaleString('en-US', options);
    }
  } catch (error) {
    console.error('Error updating date/time:', error);
  }
}

// Enhanced Navigation with accessibility
function initNavigation() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  navLinks.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      
      // Update ARIA attributes
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-selected', 'false');
      });
      
      e.target.classList.add('active');
      e.target.setAttribute('aria-selected', 'true');
      
      // Smooth scroll to section
      const targetId = e.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Keyboard navigation
  navLinks.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.target.click();
    }
  });
}

// Enhanced Spotify integration
function openSpotify() {
  try {
    // Try multiple methods to open Spotify
    const spotifyUrl = 'spotify://';
    const webUrl = 'https://open.spotify.com';
    
    // Create a temporary link for testing
    const testLink = document.createElement('a');
    testLink.href = spotifyUrl;
    testLink.click();
    
    // Fallback to web version after a delay
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(webUrl, '_blank');
      }
    }, 1000);
  } catch (error) {
    utils.showError('Unable to open Spotify. Please ensure it\'s installed.');
    console.error('Spotify launch error:', error);
  }
}

// Enhanced Fetch Top Songs with caching and error handling
function fetchTopSongs() {
  const container = document.getElementById('top-songs');
  const loading = document.getElementById('songs-loading');
  
  // Check cache first (1 hour expiry)
  const cached = localStorage.getItem('topSongs');
  const cacheTime = localStorage.getItem('topSongsTime');
  const oneHour = 60 * 60 * 1000;
  
  if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < oneHour) {
    try {
      const data = JSON.parse(cached);
      displayTopSongs(data);
      loading.style.display = 'none';
      return;
    } catch (error) {
      console.error('Cache parse error:', error);
    }
  }

  fetch('https://itunes.apple.com/us/rss/topsongs/limit=10/json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Cache the data
      localStorage.setItem('topSongs', JSON.stringify(data));
      localStorage.setItem('topSongsTime', Date.now().toString());
      
      displayTopSongs(data);
      loading.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching top songs:', error);
      loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Unable to load songs';
      utils.showError('Failed to load top songs. Check your internet connection.');
    });
}

function displayTopSongs(data) {
  const container = document.getElementById('top-songs');
  if (!data.feed || !data.feed.entry) {
    container.innerHTML = '<p>No songs available</p>';
    return;
  }

  const entries = data.feed.entry;
  container.innerHTML = entries.map((entry, index) => `
    <div class="ios-list-item" role="listitem">
      <div class="song-number" aria-label="Song rank ${index + 1}">${index + 1}</div>
      <div class="song-info">
        <div class="song-title">${utils.sanitizeHTML(entry['im:name'].label)}</div>
        <div class="song-artist">${utils.sanitizeHTML(entry['im:artist'].label)}</div>
      </div>
    </div>
  `).join('');
}

// Enhanced Payment Quotes with more variety
function fetchPaymentQuotes() {
  const lifeAdvice = [
    "Pro tip: Always check for toilet paper before starting a road trip.",
    "Life hack: The best naps happen in moving vehicles. Science says so!",
    "Remember: You can't buy happiness, but you can tip your driver. Close enough!",
    "Wisdom: If you snooze, you lose... but car naps are always a win!",
    "Fact: 100% of people who drive with music live 100% more awesome lives.",
    "Advice: Never trust a GPS that says 'shortcut' through a cornfield.",
    "Truth: The best conversations start with 'So, how's life?' in a moving car.",
    "Note: If you sing off-key, the car acoustics will magically fix it. Promise!",
    "Reminder: The journey is just as important as the destination... unless you're late.",
    "Insight: Coffee tastes better at gas stations. It's a scientific fact.",
    "Tip: Always keep snacks in the car. Hangry passengers are dangerous passengers.",
    "Philosophy: Life is like driving – sometimes you need to take the scenic route."
  ];
  
  document.querySelectorAll('.payment-advice').forEach(container => {
    const randomAdvice = lifeAdvice[Math.floor(Math.random() * lifeAdvice.length)];
    container.textContent = randomAdvice;
  });
}

// Enhanced Leaflet Map Implementation with error handling
function initMap(lat, lng) {
  try {
    const mapContainer = document.getElementById('map-container');
    const mapLoading = document.getElementById('map-loading');
    
    if (map) {
      map.remove();
    }

    map = L.map('map-container', {
      zoomControl: true,
      attributionControl: true
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      loading: 'lazy'
    }).addTo(map);

    // Add current location marker
    L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    }).addTo(map).bindPopup('Your Current Location');

    mapLoading.style.display = 'none';
    mapContainer.style.display = 'block';
    
    // Store current position
    currentPosition = { lat, lng };
    
  } catch (error) {
    console.error('Map initialization error:', error);
    utils.showError('Failed to load map. Please check your internet connection.');
    document.getElementById('map-loading').innerHTML = 
      '<i class="fas fa-exclamation-triangle"></i> Map unavailable';
  }
}

// Enhanced Geolocation with better error handling
function getLocation() {
  if (!navigator.geolocation) {
    utils.showError('Geolocation is not supported by this browser.');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
  };

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      initMap(lat, lng);
    }, 
    showError,
    options
  );
}

function showError(error) {
  const errorMessages = {
    1: "Location access denied. Please enable location services.",
    2: "Location information is unavailable. Check your GPS signal.",
    3: "Location request timed out. Please try again.",
    default: "An unknown location error occurred."
  };
  
  const message = errorMessages[error.code] || errorMessages.default;
  utils.showError(message);
  
  // Show placeholder map centered on San Francisco as fallback
  initMap(37.7749, -122.4194);
}

// Enhanced Notes Feature with character counting
function initNotesFeature() {
  const noteText = document.getElementById('note-text');
  const charCount = document.getElementById('char-count');
  
  if (noteText && charCount) {
    noteText.addEventListener('input', () => {
      const length = noteText.value.length;
      charCount.textContent = length;
      
      // Visual feedback for character limit
      if (length > 450) {
        charCount.style.color = 'var(--contrast-color)';
      } else {
        charCount.style.color = 'var(--muted-text-color)';
      }
    });
  }
}

function saveNote() {
  const noteText = document.getElementById('note-text');
  if (!noteText || !noteText.value.trim()) {
    utils.showError('Please enter a note before saving.');
    return;
  }

  try {
    const notes = JSON.parse(localStorage.getItem('passengerNotes') || '[]');
    const newNote = {
      id: Date.now(),
      text: utils.sanitizeHTML(noteText.value.trim()),
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    };
    
    notes.unshift(newNote); // Add to beginning
    
    // Keep only last 10 notes
    if (notes.length > 10) {
      notes.splice(10);
    }
    
    localStorage.setItem('passengerNotes', JSON.stringify(notes));
    noteText.value = '';
    document.getElementById('char-count').textContent = '0';
    
    showNotes();
    
    // Show success feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Sent!';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 2000);
    
  } catch (error) {
    console.error('Error saving note:', error);
    utils.showError('Failed to save note. Please try again.');
  }
}

function showNotes() {
  try {
    const notes = JSON.parse(localStorage.getItem('passengerNotes') || '[]');
    const container = document.getElementById('notes-list');
    
    if (notes.length === 0) {
      container.innerHTML = '<p class="no-notes">No notes yet. Be the first to leave a message!</p>';
      return;
    }
    
    container.innerHTML = notes.slice(0, 5).map(note => `
      <div class="note-item" data-note-id="${note.id}">
        <div class="note-text">${note.text}</div>
        <div class="note-date">${note.date}</div>
        <button class="delete-note" onclick="deleteNote(${note.id})" 
                aria-label="Delete note" title="Delete this note">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error displaying notes:', error);
    document.getElementById('notes-list').innerHTML = 
      '<p class="error-message">Unable to load notes.</p>';
  }
}

function deleteNote(noteId) {
  try {
    const notes = JSON.parse(localStorage.getItem('passengerNotes') || '[]');
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('passengerNotes', JSON.stringify(updatedNotes));
    showNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    utils.showError('Failed to delete note.');
  }
}

// Enhanced Route Calculation with debouncing
const calculateRoute = utils.debounce(async function() {
  const addressInput = document.getElementById('destination');
  const address = addressInput.value.trim();
  
  if (!address) {
    utils.showError('Please enter a destination address.');
    return;
  }

  if (!currentPosition) {
    utils.showError('Current location not available. Please wait for GPS.');
    return;
  }

  const button = document.getElementById('get-directions-btn');
  const originalContent = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
  button.disabled = true;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Address not found');
    }

    const destLat = parseFloat(data[0].lat);
    const destLon = parseFloat(data[0].lon);
    
    // Remove existing destination marker
    if (window.destinationMarker) {
      map.removeLayer(window.destinationMarker);
    }
    
    // Add destination marker
    window.destinationMarker = L.marker([destLat, destLon], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    }).addTo(map).bindPopup(`Destination: ${data[0].display_name}`);

    // Calculate distance
    const distance = calculateDistance(
      currentPosition.lat,
      currentPosition.lng,
      destLat,
      destLon
    );

    // Fit map to show both markers
    const group = new L.featureGroup([
      L.marker([currentPosition.lat, currentPosition.lng]),
      window.destinationMarker
    ]);
    map.fitBounds(group.getBounds().pad(0.1));

    // Display result
    document.getElementById('distanceResult').innerHTML = `
      <div class="distance-card">
        <i class="fas fa-road"></i>
        <div>
          <h4>Distance to Destination</h4>
          <p><strong>${distance.toFixed(1)} miles</strong> (straight line)</p>
          <p class="destination-name">${utils.sanitizeHTML(data[0].display_name)}</p>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Geocoding error:', error);
    let errorMessage = 'Failed to find destination. ';
    if (error.message === 'Address not found') {
      errorMessage += 'Please check the address and try again.';
    } else {
      errorMessage += 'Please check your internet connection.';
    }
    utils.showError(errorMessage);
  } finally {
    button.innerHTML = originalContent;
    button.disabled = false;
  }
}, 500);

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Enhanced Brightness Control
function adjustBrightness(value) {
  if (typeof fully !== 'undefined') {
    try {
      fully.setScreenBrightness(parseInt(value));
      localStorage.setItem('screenBrightness', value);
    } catch (e) {
      console.error('Brightness control failed:', e);
    }
  } else {
    // Fallback for non-Fully Kiosk browsers
    document.body.style.filter = `brightness(${value / 255})`;
    localStorage.setItem('screenBrightness', value);
  }
}

function initBrightness() {
  const savedBrightness = localStorage.getItem('screenBrightness') || 255;
  const brightnessSlider = document.getElementById('brightness');
  
  if (brightnessSlider) {
    brightnessSlider.value = savedBrightness;
    
    if (typeof fully !== 'undefined') {
      fully.setScreenBrightness(parseInt(savedBrightness));
    } else {
      document.body.style.filter = `brightness(${savedBrightness / 255})`;
    }
  }
}

// Add keyboard shortcuts for better accessibility
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + number keys for quick navigation
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      const navLinks = ['#spotify', '#payment', '#weather', '#location', '#notes'];
      const targetLink = document.querySelector(`a[href="${navLinks[e.key - 1]}"]`);
      if (targetLink) {
        targetLink.click();
      }
    }
    
    // Escape key to close error notifications
    if (e.key === 'Escape') {
      hideError();
    }
    
    // Enter key on destination input to calculate route
    if (e.key === 'Enter' && e.target.id === 'destination') {
      e.preventDefault();
      calculateRoute();
    }
  });
}

// Add voice command support (experimental)
function initVoiceCommands() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', command);
      
      if (command.includes('open spotify') || command.includes('play music')) {
        openSpotify();
      } else if (command.includes('show weather')) {
        document.querySelector('a[href="#weather"]').click();
      } else if (command.includes('show map') || command.includes('navigation')) {
        document.querySelector('a[href="#location"]').click();
      } else if (command.includes('show notes')) {
        document.querySelector('a[href="#notes"]').click();
      } else if (command.includes('show payments')) {
        document.querySelector('a[href="#payment"]').click();
      }
    };
    
    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };
    
    // Add voice control button to header
    const voiceButton = document.createElement('button');
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceButton.className = 'voice-control-btn';
    voiceButton.title = 'Voice Commands (experimental)';
    voiceButton.setAttribute('aria-label', 'Activate voice commands');
    
    voiceButton.onclick = () => {
      recognition.start();
      voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
      setTimeout(() => {
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
      }, 3000);
    };
    
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(voiceButton);
    }
  }
}

// Enhanced App Initialization
function initializeApp() {
  console.log('🚗 Car Kiosk v2.0 - Initializing...');
  
  try {
    // Initialize all features
    initNavigation();
    initNotesFeature();
    initKeyboardShortcuts();
    initVoiceCommands();
    fetchTopSongs();
    fetchPaymentQuotes();
    showNotes();
    getLocation();
    updateDateTime();
    initBrightness();
    
    // New features
    initVoiceCommands();
    initPerformanceMonitoring();
    
    // Set up intervals
    setInterval(updateDateTime, 1000);
    setInterval(getLocation, 300000); // Update location every 5 minutes
    
    // Handle initial hash
    const hash = window.location.hash || '#spotify';
    const targetLink = document.querySelector(`a[href="${hash}"]`);
    if
