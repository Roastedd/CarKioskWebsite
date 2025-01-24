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

let map;

// Navigation Active State
document.getElementById('nav-links').addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
    });
    e.target.classList.add('active');
  }
});

// Fetch Top Songs
function fetchTopSongs() {
  fetch('https://itunes.apple.com/us/rss/topsongs/limit=10/json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('top-songs');
      const entries = data.feed.entry;
      
      container.innerHTML = entries.map((entry, index) => `
        <div class="ios-list-item">
          <div class="song-number">${index + 1}</div>
          <div class="song-info">
            <div class="song-title">${entry['im:name'].label}</div>
            <div class="song-artist">${entry['im:artist'].label}</div>
          </div>
        </div>
      `).join('');
    })
    .catch(error => console.error('Error fetching top songs:', error));
}

// Replace the fetchInspirationalQuote function with:
function fetchPaymentQuotes() {
  const lifeAdvice = [
    "Pro tip: Always check for toilet paper before starting a road trip.",
    "Life hack: The best naps happen in moving vehicles. Science says so!",
    "Remember: You can't buy happiness, but you can tip your driver. Close enough!",
    "Wisdom: If you snooze, you lose... but car naps are always a win!",
    "Fact: 100% of people who drive with music live 100% more awesome lives.",
    "Advice: Never trust a GPS that says 'shortcut' through a cornfield.",
    "Truth: The best conversations start with 'So, how's life?' in a moving car.",
    "Note: If you sing off-key, the car acoustics will magically fix it. Promise!"
  ];
  
  document.querySelectorAll('.payment-advice').forEach(container => {
    container.textContent = lifeAdvice[Math.floor(Math.random() * lifeAdvice.length)];
  });
}

// Leaflet Map Implementation
function initMap(lat, lng) {
  map = L.map('map-container').setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    })
  }).addTo(map);
}

// Geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      if (!map) {
        initMap(lat, lng);
      } else {
        map.setView([lat, lng], 15);
      }
    }, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showError(error) {
  const errorMessages = {
    1: "User denied the request for Geolocation.",
    2: "Location information is unavailable.",
    3: "The request to get user location timed out."
  };
  alert(errorMessages[error.code] || "Unknown error occurred");
}

// Notes Feature
function saveNote() {
  const noteText = document.getElementById('note-text').value;
  if (!noteText) return;

  const notes = JSON.parse(localStorage.getItem('passengerNotes') || '[]');
  const newNote = {
    text: noteText,
    date: new Date().toLocaleString()
  };
  notes.push(newNote);
  localStorage.setItem('passengerNotes', JSON.stringify(notes));

  document.getElementById('note-text').value = '';
  showNotes();
  alert('Note saved successfully!');
}

function showNotes() {
  const notes = JSON.parse(localStorage.getItem('passengerNotes') || '[]');
  const container = document.getElementById('notes-list');
  container.innerHTML = notes.slice(-5).reverse().map(note => `
    <div class="note-item">
      <div>${note.text}</div>
      <div class="note-date">${note.date}</div>
    </div>
  `).join('');
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  fetchTopSongs();
  fetchPaymentQuotes(); // Changed from inspirational quotes
  showNotes();
  
  // Handle initial active state
  const hash = window.location.hash || '#spotify';
  document.querySelector(`a[href="${hash}"]`)?.classList.add('active');
});

// Hash Change Handler
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });
});
