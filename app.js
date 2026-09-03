const sidebar = document.getElementById('sidebar');
const sidebarHeader = document.getElementById('sidebarHeader');
const mobileToggle = document.getElementById('mobileToggle');

const NUM_TEAMS = 3;
const ARRIVAL_THRESHOLD_METERS = 60;

const TEAM_COLORS = [
    '#007AFF', // iOS blue
    '#34C759', // iOS green
    '#FF9500', // iOS orange
];

const TEAM_MEMBERS = [
    "Beti & Rahwa",
    "Tegi, Eden, & Zelelam",
    "Bas & Amir"
];

const allLocations = [
  { name: 'Gebeya', address: 'Minaye Office Park, Kirkos, Addis Ababa', lat: 8.995, lng: 38.7675 },
  { name: 'Chapa', address: 'Novis Building, Bole Sub City, Addis Ababa', lat: 8.9912, lng: 38.7845 },
  { name: 'Ethiopian Airlines', address: 'Bole International Airport, Addis Ababa', lat: 8.9733, lng: 38.793 },
  { name: 'Safari Com', address: 'Wello Sefer, Africa Avenue, Addis Ababa', lat: 8.9942, lng: 38.7681 },
  { name: 'Arif Pay', address: 'Warka Tower, 3rd Floor, Bole, Addis Ababa', lat: 9.0028, lng: 38.7831 },
  { name: 'I cog lab', address: 'Hatal Building, Ethio-China Street, Addis Ababa', lat: 8.9902, lng: 38.7695 },
  { name: 'Banehus Trading', address: 'Hatal Building, Ethio-China Road, Addis Ababa', lat: 8.9902, lng: 38.7695 },
  { name: 'Guzo tech', address: '22 Mezoriya, Addis Ababa', lat: 9.015, lng: 38.79 },
  { name: 'Ethswitch', address: 'Nega City Mall, 4th Floor, Kazanchis, Addis Ababa', lat: 9.0164, lng: 38.7656 },
  { name: 'CRAFT ADDIS', address: 'SNAP Plaza, 10th Floor, Bole Road, Addis Ababa', lat: 8.9899, lng: 38.7876 },
  { name: 'Flawless', address: 'Nega City Mall, 4th Floor, Kazanchis, Addis Ababa', lat: 9.0164, lng: 38.7656 },
  { name: 'Noah Real Estate', address: 'Abyssinia Plaza, 12th Floor, Bole, Addis Ababa', lat: 8.9946, lng: 38.7904 },
  { name: 'Hosea Real Estate', address: 'Hosea Real Estate Bldg, Atlas Road, Addis Ababa', lat: 8.9941, lng: 38.7882 },
  { name: 'Zeleman studio', address: 'SNAP Plaza, 10th Floor, Bole Road, Addis Ababa', lat: 8.9899, lng: 38.7876 },
  { name: 'DR. Senait Dental', address: 'Fetle Building, 2nd Floor, Wello Sefer, Addis Ababa', lat: 8.995, lng: 38.77 },
  { name: 'IMS Makeup School And Studio', address: 'Bole Dembel City Center, Addis Ababa', lat: 9.0047, lng: 38.7669 },
  { name: 'Flintstone Homes', address: 'Jommo Apartment, Kolfe Keranio, Addis Ababa', lat: 9.006, lng: 38.805 },
  { name: 'ALX Ethiopia', address: 'Lideta Hub, 4th Floor, Lideta, Addis Ababa', lat: 9.0227, lng: 38.7468 },
  { name: 'Dodai E-Mobility', address: 'Rahem Building, 1st Floor, Megenagna, Addis Ababa', lat: 9.0214, lng: 38.7998 },
  { name: 'YenePay', address: 'Tensae Building, 2nd Floor, Bole, Addis Ababa', lat: 8.99, lng: 38.78 },
  { name: 'The Talent Firm', address: 'Aberus Complex, 10th Floor, Kirkos, Addis Ababa', lat: 9.0059, lng: 38.7676 },
  { name: 'Berry Advertising', address: 'Warka Tower, 7th Floor, Bole, Addis Ababa', lat: 9.0028, lng: 38.7831 },
  { name: 'Cactus Ethiopia', address: 'Cactus Plaza, 2nd Floor, Bole Road, Addis Ababa', lat: 8.9995, lng: 38.7752 },
  { name: 'Qene Games', address: 'Christina Plaza, 3rd Floor, Lancha, Addis Ababa', lat: 8.9895, lng: 38.7512 },
  { name: 'Snap Specialty Coffee', address: 'SNAP Plaza, Bole Road, Addis Ababa', lat: 8.9899, lng: 38.7876 },
  { name: 'Flamingo Advertising', address: 'Gotera, In front of Agona Cinema, Addis Ababa', lat: 8.9882, lng: 38.764 },
  { name: 'Inclusive Interior Design', address: 'Addis Ababa', lat: 9.01, lng: 38.76 },
  { name: 'Debisha Interiors', address: 'Bma Plaza, 3rd Floor, Gerji Emperial, Addis Ababa', lat: 9.0064, lng: 38.8055 },
  { name: 'Hybrid Designs PLC (RIDE)', address: 'Lebenz Tower, 5th Floor, Gabon Street, Addis Ababa', lat: 8.9991, lng: 38.7715 },
  { name: 'Kifiya Financial Technology', address: 'Cactus Plaza, 9th Floor, Addis Ababa', lat: 8.9995, lng: 38.7752 },
  { name: 'JaRco Consulting PLC', address: 'Old Airport area, Addis Ababa', lat: 8.9921, lng: 38.7315 },
  { name: 'Keste Damena', address: 'Gerji Mebrat Hail, Bole, Addis Ababa', lat: 9.01, lng: 38.76 },
];

const haversineMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

const clusterIntoTeams = (points, k) => {
    const n = points.length;
    const base = Math.floor(n / k);
    const remainder = n % k;
    const capacities = Array.from({ length: k }, (_, i) => base + (i < remainder ? 1 : 0));

    let centroids = [{ lat: points[0].lat, lng: points[0].lng }];
    while (centroids.length < k) {
        let farthestPoint = null;
        let farthestDist = -1;
        points.forEach(p => {
            const minDist = Math.min(...centroids.map(c => haversineMeters(p.lat, p.lng, c.lat, c.lng)));
            if (minDist > farthestDist) {
                farthestDist = minDist;
                farthestPoint = p;
            }
        });
        centroids.push({ lat: farthestPoint.lat, lng: farthestPoint.lng });
    }

    let assignments = new Array(n).fill(-1);

    for (let iter = 0; iter < 15; iter++) {
        const candidates = [];
        points.forEach((p, pIdx) => {
            centroids.forEach((c, cIdx) => {
                candidates.push({ pIdx, cIdx, dist: haversineMeters(p.lat, p.lng, c.lat, c.lng) });
            });
        });
        candidates.sort((a, b) => a.dist - b.dist);

        const newAssignments = new Array(n).fill(-1);
        const counts = new Array(k).fill(0);
        const assignedPoints = new Set();

        for (const cand of candidates) {
            if (assignedPoints.size === n) break;
            if (assignedPoints.has(cand.pIdx)) continue;
            if (counts[cand.cIdx] >= capacities[cand.cIdx]) continue;
            newAssignments[cand.pIdx] = cand.cIdx;
            counts[cand.cIdx]++;
            assignedPoints.add(cand.pIdx);
        }

        const changed = newAssignments.some((v, i) => v !== assignments[i]);
        assignments = newAssignments;

        for (let c = 0; c < k; c++) {
            const members = points.filter((_, idx) => assignments[idx] === c);
            if (members.length > 0) {
                centroids[c] = {
                    lat: members.reduce((s, p) => s + p.lat, 0) / members.length,
                    lng: members.reduce((s, p) => s + p.lng, 0) / members.length
                };
            }
        }

        if (!changed) break;
    }

    return assignments;
};

const teamAssignments = clusterIntoTeams(allLocations, NUM_TEAMS);
const locationsByTeam = Array.from({ length: NUM_TEAMS }, (_, teamIdx) =>
    allLocations.filter((_, idx) => teamAssignments[idx] === teamIdx)
);

let selectedTeam = null;
let locations = [];

const teamGrid = document.getElementById('teamGrid');
for (let i = 0; i < NUM_TEAMS; i++) {
    const color = TEAM_COLORS[i % TEAM_COLORS.length];
    const btn = document.createElement('div');
    btn.className = 'team-option';
    btn.style.borderColor = color;
    btn.style.background = `${color}12`;
    btn.innerHTML = `
        <div class="team-option-header">
            <div class="team-num" style="color:${color}">Team ${i + 1}</div>
            <div class="team-count">${locationsByTeam[i].length} stops</div>
        </div>
        <div class="team-members">Members: ${TEAM_MEMBERS[i]}</div>
    `;
    btn.addEventListener('click', () => selectTeam(i));
    teamGrid.appendChild(btn);
}

const saveVisitedState = () => {
    if (selectedTeam === null) return;
    const visitedNames = locationData.filter(l => l.visited).map(l => l.name);
    localStorage.setItem(`zemenay_visited_team_${selectedTeam}`, JSON.stringify(visitedNames));
};

const selectTeam = (teamIdx) => {
    selectedTeam = teamIdx;
    locations = locationsByTeam[teamIdx];
    localStorage.setItem('zemenay_selected_team', teamIdx);

    document.getElementById('teamSelectOverlay').style.display = 'none';

    const badge = document.getElementById('teamBadge');
    const color = TEAM_COLORS[teamIdx % TEAM_COLORS.length];

    badge.style.background = color;
    document.getElementById('teamBadgeText').textContent = `Team ${teamIdx + 1}: ${TEAM_MEMBERS[teamIdx]}`;
    badge.classList.add('visible');

    routeActive = false;
    activeStopIndex = 0;
    document.getElementById('mapHud').classList.remove('visible');

    if (polylineLayer) {
        map.removeLayer(polylineLayer);
        polylineLayer = null;
    }

    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    const savedVisited = JSON.parse(localStorage.getItem(`zemenay_visited_team_${teamIdx}`)) || [];
    locationData = locations.map(loc => ({ 
        name: loc.name, 
        lat: loc.lat, 
        lon: loc.lng, 
        visited: savedVisited.includes(loc.name) 
    }));

    renderMarkers();
    renderSidebarList();
    document.getElementById('calcBtn').textContent = "Compute Optimal Route";

    if (userLocation) {
        computeOptimalRoute();
    }
};

window.showTeamSwitcher = () => {
    document.getElementById('teamSelectOverlay').style.display = 'flex';
};

window.closeReminderModal = () => {
    document.getElementById('reminderModal').style.display = 'none';
    requestNotificationPermission();
};

const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
        try {
            await Notification.requestPermission();
        } catch (e) {
            console.log('Notification permission request error:', e);
        }
    }
};

const sendNativeNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(title, {
                body: body,
                icon: 'zemenay.png'
            });
        } catch (e) {
            console.log('Error sending native notification:', e);
        }
    }
};

const showToastNotification = (title, message, type = 'warning', actionText = null, actionCallback = null, autoDismissMs = 8000) => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    let actionBtnHtml = '';
    if (actionText && actionCallback) {
        actionBtnHtml = `<div class="toast-actions"><button class="apple-btn" id="toastAction_${Date.now()}">${actionText}</button></div>`;
    }

    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-title">${title}</span>
            <button class="toast-close" onclick="this.closest('.toast-notification').remove()">&times;</button>
        </div>
        <div class="toast-body">${message}</div>
        ${actionBtnHtml}
    `;

    container.appendChild(toast);

    if (actionText && actionCallback) {
        const btn = toast.querySelector('button.apple-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                actionCallback();
                toast.remove();
            });
        }
    }

    if (autoDismissMs) {
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => toast.remove(), 250);
            }
        }, autoDismissMs);
    }
};

const checkAndNotifyRemainingStops = () => {
    const unvisited = locationData.filter(l => !l.visited);
    if (unvisited.length === 1 && locationData.length > MAX_GMAPS_STOPS) {
        const stop11 = unvisited[0];
        const title = `Batch 1 Complete! Stop #11 Ready`;
        const message = `Great job completing Batch 1! Your 11th location ("${stop11.name}") is ready for navigation.`;
        
        const singleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop11.lat},${stop11.lon}&travelmode=driving`;

        showToastNotification(title, message, 'success', `Start Stop #11 Navigation`, () => {
            window.open(singleNavUrl, '_blank');
        }, 15000);

        sendNativeNotification(title, `Stop #11 Ready: ${stop11.name}. Click to launch navigation!`);
    }
};

window.clearAllAppData = () => {
    if (confirm("Are you sure you want to clear all progress and reset team selection?")) {
        localStorage.removeItem('zemenay_selected_team');
        for (let i = 0; i < NUM_TEAMS; i++) {
            localStorage.removeItem(`zemenay_visited_team_${i}`);
        }
        
        selectedTeam = null;
        routeActive = false;
        activeStopIndex = 0;
        
        document.getElementById('teamBadge').classList.remove('visible');
        document.getElementById('mapHud').classList.remove('visible');
        document.getElementById('teamSelectOverlay').style.display = 'flex';
        
        if (polylineLayer) {
            map.removeLayer(polylineLayer);
            polylineLayer = null;
        }
        
        mapMarkers.forEach(m => map.removeLayer(m));
        mapMarkers = [];
        
        document.getElementById('locationList').innerHTML = `<div class="empty-state">Please select a team to view stops.</div>`;
    }
};

let isExpanded = false;

const setSidebarExpanded = (expand) => {
    isExpanded = expand;
    sidebar.classList.toggle('expanded', isExpanded);
    mobileToggle.textContent = isExpanded ? '✕' : '☰';
}

mobileToggle.addEventListener('click', () => setSidebarExpanded(!isExpanded));
sidebarHeader.addEventListener('click', () => setSidebarExpanded(!isExpanded));

let touchStartY = 0;
sidebar.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, {passive: true});

sidebar.addEventListener('touchend', (e) => {
    let touchEndY = e.changedTouches[0].clientY;
    if (touchStartY - touchEndY > 40) {
        setSidebarExpanded(true);
    } else if (touchEndY - touchStartY > 40) {
        setSidebarExpanded(false);
    }
}, {passive: true});

const map = L.map('map', { zoomControl: false }).setView([9.0300, 38.7400], 13);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

let userLocation = null;
let userMarker = null;
let locationData = [];
let mapMarkers = [];
let polylineLayer = null;
let activeStopIndex = 0;
let routeActive = false;
let watchId = null;

const MAX_GMAPS_STOPS = 10;

const getGoogleMapsMultiRouteUrl = () => {
    const unvisited = locationData.filter((l, idx) => !l.visited && idx >= activeStopIndex);
    if (unvisited.length === 0) return '#';

    let targetList = unvisited;
    if (unvisited.length > MAX_GMAPS_STOPS) {
        targetList = unvisited.slice(0, MAX_GMAPS_STOPS);
    }

    const destination = targetList[targetList.length - 1];
    const intermediateStops = targetList.slice(0, targetList.length - 1);

    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lon}`;
    
    if (intermediateStops.length > 0) {
        const waypointsStr = intermediateStops.map(s => `${s.lat},${s.lon}`).join('|');
        url += `&waypoints=${waypointsStr}`;
    }
    
    url += `&travelmode=driving`;
    return url;
};

window.handleNavigateAll = () => {
    requestNotificationPermission();

    const unvisited = locationData.filter((l, idx) => !l.visited && idx >= activeStopIndex);
    const fullRouteUrl = getGoogleMapsMultiRouteUrl();

    if (unvisited.length > MAX_GMAPS_STOPS) {
        const remainingStop = unvisited[MAX_GMAPS_STOPS];
        const title = `🗺️ Stop #11 Saved for Batch 2`;
        const message = `Google Maps is limited to 10 stops per URL. Batch 1 (Stops 1–10) launched in Google Maps. Stop #11 ("${remainingStop.name}") is saved in PathFinder and will alert you after Stop #10!`;

        showToastNotification(title, message, 'warning', `View Stop #11 Info`, () => {
            alert(`Stop #11 Details:\nLocation: ${remainingStop.name}\nCoordinates: ${remainingStop.lat}, ${remainingStop.lon}`);
        }, 12000);

        sendNativeNotification(title, `Batch 1 mapped (10 stops). Stop #11 (${remainingStop.name}) saved for Batch 2!`);
    } else {
        showToastNotification('🗺️ Launching Navigation', `All ${unvisited.length} stops sent to Google Maps.`, 'info');
    }

    window.open(fullRouteUrl, '_blank');
};

const isNearActiveStop = () => {
    if (!userLocation || !routeActive || activeStopIndex >= locationData.length) return false;
    const target = locationData[activeStopIndex];
    return haversineMeters(userLocation.lat, userLocation.lon, target.lat, target.lon) <= ARRIVAL_THRESHOLD_METERS;
};

const renderMarkers = () => {
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    locationData.forEach((loc, index) => {
        const color = loc.visited ? '#8E8E93' : (index === activeStopIndex && routeActive ? '#007AFF' : '#34C759');
        const marker = L.circleMarker([loc.lat, loc.lon], {
            radius: 8,
            fillColor: color,
            fillOpacity: 0.9,
            color: '#FFF',
            weight: 2
        }).addTo(map).bindPopup(`<b>Stop ${index + 1}: ${loc.name}</b>`);
        mapMarkers.push(marker);
    });

    if (mapMarkers.length > 0) {
        const group = L.featureGroup(mapMarkers);
        map.fitBounds(group.getBounds().pad(0.2));
    }
};

const renderSidebarList = () => {
    const container = document.getElementById('locationList');
    container.innerHTML = '';

    if (locationData.length === 0) {
        container.innerHTML = `<div class="empty-state">No locations assigned to this team.</div>`;
        return;
    }

    locationData.forEach((loc, index) => {
        const card = document.createElement('div');
        card.className = `location-card ${routeActive && index === activeStopIndex ? 'active-target' : ''} ${loc.visited ? 'completed' : ''}`;

        let actionHtml = '';
        if (routeActive && index === activeStopIndex && !loc.visited) {
            const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}&travelmode=driving`;
            if (isNearActiveStop()) {
                actionHtml = `
                    <div class="card-actions">
                        <a class="apple-btn" href="${navUrl}" target="_blank">Start Navigation</a>
                        <button class="apple-btn success" onclick="completeStop(${index})">Arrived / Finish</button>
                    </div>
                `;
            } else {
                actionHtml = `
                    <div class="card-actions">
                        <a class="apple-btn" href="${navUrl}" target="_blank">Start Navigation</a>
                        <span class="card-badge" style="background: var(--accent-red); color: white;">Get closer to finish</span>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            <div class="card-title-row">
                <div class="card-title-group">
                    <input type="checkbox" class="card-checkbox" ${loc.visited ? 'checked' : ''} onchange="toggleVisitedStatus(${index}, this.checked)">
                    <span class="card-title">${index + 1}. ${loc.name}</span>
                </div>
                <span class="card-badge">${loc.visited ? 'Visited' : 'Pending'}</span>
            </div>
            ${actionHtml}
        `;
        container.appendChild(card);
    });
};

window.toggleVisitedStatus = (index, isChecked) => {
    locationData[index].visited = isChecked;
    saveVisitedState();

    if (routeActive) {
        recalculateActiveRouteAfterManualToggle();
    } else {
        renderMarkers();
        renderSidebarList();
    }

    if (isChecked) {
        checkAndNotifyRemainingStops();
    }
};

const recalculateActiveRouteAfterManualToggle = () => {
    const visitedStops = locationData.filter(l => l.visited);
    let unvisitedStops = locationData.filter(l => !l.visited);

    let refPos = userLocation;
    if (visitedStops.length > 0) {
        const lastVisited = visitedStops[visitedStops.length - 1];
        refPos = { lat: lastVisited.lat, lon: lastVisited.lon };
    }

    let optimizedPath = [];
    let currentPos = refPos;

    while (unvisitedStops.length > 0) {
        let nearestIdx = 0;
        let minDist = Infinity;

        unvisitedStops.forEach((loc, idx) => {
            const dist = Math.hypot(loc.lat - currentPos.lat, loc.lon - currentPos.lon);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = idx;
            }
        });

        const nextStop = unvisitedStops.splice(nearestIdx, 1)[0];
        optimizedPath.push(nextStop);
        currentPos = { lat: nextStop.lat, lon: nextStop.lon };
    }

    locationData = [...visitedStops, ...twoOptImprove(optimizedPath)];
    activeStopIndex = visitedStops.length;

    document.getElementById('mapHud').classList.add('visible');
    updateHUD();

    renderMarkers();
    renderSidebarList();
    drawPolyline();
};

const twoOptImprove = (path) => {
    if (path.length < 4) return path;

    const dist = (a, b) => Math.hypot(a.lat - b.lat, a.lon - b.lon);

    let improved = true;
    while (improved) {
        improved = false;
        for (let i = 0; i < path.length - 1; i++) {
            for (let j = i + 2; j < path.length; j++) {
                if (i === 0 && j === path.length - 1) continue;

                const a = path[i], b = path[i + 1];
                const c = path[j], d = path[j + 1] || null;

                const currentDist = dist(a, b) + (d ? dist(c, d) : 0);
                const newDist = dist(a, c) + (d ? dist(b, d) : 0);

                if (newDist < currentDist) {
                    const segment = path.slice(i + 1, j + 1).reverse();
                    path = [...path.slice(0, i + 1), ...segment, ...path.slice(j + 1)];
                    improved = true;
                }
            }
        }
    }
    return path;
};

const computeOptimalRoute = () => {
    if (!userLocation || locationData.length === 0) return;

    let unvisited = locationData.filter(l => !l.visited);
    if (unvisited.length === 0) return;

    if (unvisited.length > MAX_GMAPS_STOPS) {
        document.getElementById('reminderModalText').textContent = `Google Maps supports a maximum of 10 stops per navigation URL. Your team has ${unvisited.length} total stops. The app will automatically map the first 10 stops into Google Maps, and our notification system will alert you when you reach Stop #10 so you don't forget Stop #11!`;
        document.getElementById('reminderModal').style.display = 'flex';
    }

    let currentPos = userLocation;
    let optimizedPath = [];

    while (unvisited.length > 0) {
        let nearestIdx = 0;
        let minDist = Infinity;

        unvisited.forEach((loc, idx) => {
            const dist = Math.hypot(loc.lat - currentPos.lat, loc.lon - currentPos.lon);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = idx;
            }
        });

        const nextStop = unvisited.splice(nearestIdx, 1)[0];
        optimizedPath.push(nextStop);
        currentPos = { lat: nextStop.lat, lon: nextStop.lon };
    }

    const visitedStops = locationData.filter(l => l.visited);
    locationData = [...visitedStops, ...twoOptImprove(optimizedPath)];
    activeStopIndex = visitedStops.length;
    routeActive = true;

    document.getElementById('mapHud').classList.add('visible');
    updateHUD();

    renderMarkers();
    renderSidebarList();
    drawPolyline();

    document.getElementById('calcBtn').textContent = "Recalculate Route";
};

const updateHUD = () => {
    const titleEl = document.getElementById('hudTitle');
    const subEl = document.getElementById('hudSub');
    const badgeEl = document.getElementById('hudBadge');
    const btnContainer = document.getElementById('hudButtonsContainer');

    const unvisitedCount = locationData.filter(l => !l.visited).length;

    if (activeStopIndex < locationData.length && unvisitedCount > 0) {
        while (activeStopIndex < locationData.length && locationData[activeStopIndex].visited) {
            activeStopIndex++;
        }
    }

    if (activeStopIndex < locationData.length && unvisitedCount > 0) {
        const currentTarget = locationData[activeStopIndex];
        titleEl.textContent = currentTarget.name;
        badgeEl.textContent = `Stop ${activeStopIndex + 1} of ${locationData.length}`;

        const singleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentTarget.lat},${currentTarget.lon}&travelmode=driving`;

        let multiRouteNote = '';
        if (unvisitedCount > MAX_GMAPS_STOPS) {
            multiRouteNote = ` (Batch 1: First 10 of ${unvisitedCount})`;
        }

        if (isNearActiveStop()) {
            subEl.textContent = `You've arrived — tap Finish`;
            btnContainer.innerHTML = `
                <a class="apple-btn" href="${singleNavUrl}" target="_blank">Next Stop</a>
                <button class="apple-btn success" onclick="completeStop(${activeStopIndex})">Arrived / Finish</button>
            `;
        } else {
            subEl.textContent = `Launch navigation for next stop or full route${multiRouteNote}`;
            btnContainer.innerHTML = `
                <a class="apple-btn" href="${singleNavUrl}" target="_blank">Next Stop</a>
                <button class="apple-btn secondary" onclick="handleNavigateAll()" style="background: var(--accent); color: white;">Navigate All (${Math.min(unvisitedCount, MAX_GMAPS_STOPS)})</button>
            `;
        }
    } else {
        titleEl.textContent = `Route Completed!`;
        subEl.textContent = `All stops have been successfully visited.`;
        badgeEl.textContent = `Done`;
        btnContainer.innerHTML = `<button class="apple-btn secondary" onclick="resetRoute()">Reset Trip</button>`;
    }
};

window.completeStop = (index) => {
    if (index === activeStopIndex && !isNearActiveStop()) {
        alert(`You need to be within ${ARRIVAL_THRESHOLD_METERS}m of the location to mark it as arrived.`);
        return;
    }
    locationData[index].visited = true;
    activeStopIndex++;

    saveVisitedState();

    renderMarkers();
    renderSidebarList();
    drawPolyline();
    updateHUD();

    checkAndNotifyRemainingStops();
};

window.resetRoute = () => {
    routeActive = false;
    activeStopIndex = 0;
    locationData.format = locationData.forEach(l => l.visited = false);
    
    saveVisitedState();

    document.getElementById('mapHud').classList.remove('visible');
    if (polylineLayer) map.removeLayer(polylineLayer);
    renderMarkers();
    renderSidebarList();
    document.getElementById('calcBtn').textContent = "Compute Optimal Route";
};

const drawPolyline = () => {
    if (polylineLayer) map.removeLayer(polylineLayer);

    const activeNodes = locationData.filter(l => !l.visited);
    if (activeNodes.length === 0 || !userLocation) return;

    const pathCoords = [
        [userLocation.lat, userLocation.lon],
        ...activeNodes.map(l => [l.lat, l.lon])
    ];

    polylineLayer = L.polyline(pathCoords, {
        color: '#007AFF',
        weight: 5,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);
};

const initGPS = () => {
    document.getElementById('calcBtn').addEventListener('click', computeOptimalRoute);

    if (watchId !== null) navigator.geolocation.clearWatch(watchId);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                userLocation = { lat, lon };

                if (!userMarker) {
                    map.setView([lat, lon], 15);
                    userMarker = L.circleMarker([lat, lon], {
                        radius: 10,
                        fillColor: '#007AFF',
                        fillOpacity: 1,
                        color: '#FFFFFF',
                        weight: 3
                    }).addTo(map).bindPopup('<b>Current Position</b>');
                    
                    const savedTeam = localStorage.getItem('zemenay_selected_team');
                    if (savedTeam !== null) {
                        selectTeam(parseInt(savedTeam, 10));
                    }
                } else {
                    userMarker.setLatLng([lat, lon]);
                }

                if (routeActive) {
                    renderSidebarList();
                    updateHUD();
                }

                document.getElementById('statusPill').innerHTML = `<span>GPS Active (±${Math.round(pos.coords.accuracy)}m)</span>`;
            },
            (err) => {
                console.error(err);
                document.getElementById('statusPill').innerHTML = `<span>⚠️ GPS Offline. Using default fallback.</span>`;
                userLocation = { lat: 9.0300, lon: 38.7400 };
                
                const savedTeam = localStorage.getItem('zemenay_selected_team');
                if (savedTeam !== null && selectedTeam === null) {
                    selectTeam(parseInt(savedTeam, 10));
                }
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
    }
};

initGPS();