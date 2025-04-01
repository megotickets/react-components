import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "../css/pay.css";
interface TicketLocationProps {
  event: any;
}

interface MapContainerProps {
  location: string;
}

const containerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '8px',
  marginTop: '0.5rem'
};

const defaultCenter = {
  lat: 41.9028, // Default to Rome, Italy if geocoding fails
  lng: 12.4964
};

const MapContainer: React.FC<MapContainerProps> = ({ location }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // In a production environment, you would want to implement proper geocoding
  // This is a simplified version that assumes the location is already known
  // You would typically use a geocoding service to convert the address to coordinates
  
  const onLoad = useCallback((map: any) => {
    // You could implement geocoding here
    console.log('Map loaded:', location);
    setIsLoading(false);
  }, [location]);

  const onError = useCallback(() => {
    console.error('Error loading Google Maps');
    setMapError(true);
    setIsLoading(false);
  }, []);
  
  // Get API key from environment variables
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  
  // If no API key is provided or there's an error, show fallback UI
  if (!apiKey || mapError) {
    return (
      <div className="ticket-map-container">
        <p className="font-satoshi" style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>Unable to load map</p>
        <p className="font-satoshi" style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>{location}</p>
      </div>
    );
  }
  
  return (
    <div>
      {isLoading && (
        <div className="ticket-map-loader-container">
          <p className="font-satoshi" style={{ color: '#9CA3AF' }}>Loading map...</p>
        </div>
      )}
      {/* @ts-ignore */}
      <LoadScript 
        googleMapsApiKey={apiKey} 
        onError={onError}
      >
        {/* @ts-ignore */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onLoad}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            ],
            disableDefaultUI: true,
          }}
        >
          {/* @ts-ignore */}
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};


export const TicketLocation: React.FC<TicketLocationProps> = ({ event }) => {
  return (
    <div className="ticket-block-container">
      {/* Location Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p className="ticket-block-title font-satoshi">Event Location</p>
        </div>
        
        <div>
          <div style={{ color: '#fff', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>{event.event_location}</div>
          
          {/* Event Description moved here */}
          <div 
            dangerouslySetInnerHTML={{ __html: event.event_description }} 
            style={{ 
              color: '#E5E7EB', 
              fontSize: '0.9375rem', 
              lineHeight: '1.5',
              marginBottom: '0.75rem'
            }}
          />
          
          {event.event_type === 'physical' && (
            <MapContainer location={event.event_location} />
          )}
        </div>
      </div>
    </div>
  );
};