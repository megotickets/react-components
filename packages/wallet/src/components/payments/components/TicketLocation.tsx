import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
      <div style={{
        width: '100%',
        height: '200px',
        borderRadius: '8px',
        marginTop: '0.5rem',
        backgroundColor: '#1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>Impossibile caricare la mappa</p>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>{location}</p>
      </div>
    );
  }
  
  return (
    <div>
      {isLoading && (
        <div style={{
          width: '100%',
          height: '200px',
          borderRadius: '8px',
          marginTop: '0.5rem',
          backgroundColor: '#1E1E1E',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ color: '#9CA3AF' }}>Caricamento mappa...</p>
        </div>
      )}
      <LoadScript 
        googleMapsApiKey={apiKey} 
        onError={onError}
      >
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
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};


export const TicketLocation: React.FC<TicketLocationProps> = ({ event }) => {
  return (
    <div style={{ padding: '2rem' }}>
      {/* Location Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div style={{ color: '#9CA3AF', fontSize: '0.875rem', fontWeight: '500' }}>Event Location</div>
        </div>
        
        <div style={{ marginLeft: '2rem' }}>
          <div style={{ color: '#fff', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>{event.event_location}</div>
          {event.event_type === 'physical' && (
            <MapContainer location={event.event_location} />
          )}
        </div>
      </div>
      
      {/* Event Description */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div style={{ color: '#9CA3AF', fontSize: '0.875rem', fontWeight: '500' }}>Description</div>
        </div>
        
        <div style={{ marginLeft: '2rem' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: event.event_description }} 
            style={{ 
              color: '#E5E7EB', 
              fontSize: '0.9375rem', 
              lineHeight: '1.5' 
            }}
          />
        </div>
      </div>
      
      {/* Event Type and Status */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.5rem' 
      }}>
        <span style={{ 
          display: 'inline-block', 
          backgroundColor: 'rgba(37, 99, 235, 0.2)', 
          color: '#60a5fa', 
          padding: '0.5rem 1rem', 
          borderRadius: '9999px', 
          fontSize: '0.875rem', 
          fontWeight: '600',
          border: '1px solid rgba(37, 99, 235, 0.3)'
        }}>
          {event.event_type === 'physical' ? 'Evento Fisico' : 'Evento Virtuale'}
        </span>
        
        <span style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem', 
          borderRadius: '9999px', 
          fontSize: '0.875rem', 
          fontWeight: '600',
          backgroundColor: event.event_status === 'active' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)',
          color: event.event_status === 'active' ? '#34d399' : '#f87171',
          border: event.event_status === 'active' ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)'
        }}>
          {event.event_status === 'active' ? 'Attivo' : 'Non attivo'}
        </span>
      </div>
    </div>
  );
};