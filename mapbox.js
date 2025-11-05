document.addEventListener('DOMContentLoaded', function() {
    // Increase delay to ensure DOM is fully loaded
    setTimeout(() => {
        initMapbox();
    }, 1000);
});

async function initMapbox() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Check if map is already initialized
    if (mapElement.classList.contains('mapboxgl-map') || mapElement.querySelector('.mapboxgl-canvas')) {
        return;
    }
    
    mapElement.classList.add('loading-map');
    
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXNtb3lhIiwiYSI6ImNtOHJpbGZibzA2ZDcybXB3emd5MnF2b2wifQ.30AGj91NdxI-ZsqoEC6jDg';
    
    try {
        // Preload geocoding data
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/Las%20Pimpinelas%20310%2C%20Concon%2C%20Chile.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            
            // Force the map container to be visible during initialization
            const originalDisplay = mapElement.style.display;
            const originalVisibility = mapElement.style.visibility;
            const originalHeight = mapElement.style.height;
            
            // Make sure the element is rendered but not visible to user
            mapElement.style.visibility = 'hidden';
            mapElement.style.height = '400px';
            mapElement.style.display = 'block';
            
            // Create map instance with preloading options
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v10',
                center: [longitude, latitude + 0.0008],
                zoom: 16,
                attributionControl: false,
                preserveDrawingBuffer: true,
                renderWorldCopies: false,
                fadeDuration: 0,
                logoPosition: 'top-left', // Position the logo where we can hide it with CSS
                interactive: true // Enable interaction from the start
            });

            // Add event listeners
            map.on('load', function() {
                // Create custom marker
                const markerElement = document.createElement('div');
                markerElement.className = 'custom-marker';
                markerElement.innerHTML = `
                    <svg width="30" height="40" viewBox="0 0 24 24" fill="#c49c74" stroke="#ffffff">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                `;

                // Add marker with popup
                const marker = new mapboxgl.Marker(markerElement)
                    .setLngLat([longitude, latitude])
                    .setPopup(new mapboxgl.Popup({ offset: 15 })
                        .setHTML(`
                            <div class="info-window">
                                <h3>Blumen</h3>
                                <p>Las Pimpinelas 310, Concon, Chile</p>
                                <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" 
                                   class="directions-button" target="_blank">
                                   Cómo llegar
                                </a>
                            </div>
                        `))
                    .addTo(map);

                // Show popup by default
                marker.togglePopup();
                
                // Restore original styles
                mapElement.style.visibility = originalVisibility;
                mapElement.style.display = originalDisplay;
                mapElement.style.height = originalHeight;
                
                // Make sure the map is interactive
                map.dragPan.enable();
                map.scrollZoom.enable();
                map.touchZoomRotate.enable();
                
                // Add navigation controls
                map.addControl(new mapboxgl.NavigationControl(), 'top-right');
                
                mapElement.classList.remove('loading-map');
                console.log('Map loaded successfully');
                
                // Force a resize to ensure proper rendering
                setTimeout(() => {
                    map.resize();
                }, 100);
            });
            
            map.on('error', function(e) {
                console.error('Map error:', e);
                mapElement.classList.remove('loading-map');
                mapElement.classList.add('map-error');
                
                // Restore original styles
                mapElement.style.visibility = originalVisibility;
                mapElement.style.display = originalDisplay;
                mapElement.style.height = originalHeight;
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (map) map.resize();
            });
            
            // Add scroll event listener to ensure map renders correctly when scrolled into view
            document.addEventListener('scroll', function() {
                if (isElementInViewport(mapElement) && map) {
                    map.resize();
                }
            });
        }
    } catch (error) {
        console.error('Error loading map:', error);
        mapElement.classList.remove('loading-map');
        mapElement.classList.add('map-error');
    }
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}