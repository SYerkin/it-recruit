import React from 'react';
import styled from 'styled-components';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapWrapper = styled.div`
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
`;

const Fallback = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 14px;
`;

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Coordinates = { lat: number; lon: number };

async function geocode(address: string): Promise<Coordinates | null> {
  const encoded = encodeURIComponent(address);
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`);
  if (!response.ok) return null;
  const data = await response.json();
  if (!Array.isArray(data) || !data.length) return null;
  const point = data[0];
  if (!point?.lat || !point?.lon) return null;
  return { lat: Number(point.lat), lon: Number(point.lon) };
}

export const CompanyMap: React.FC<{ address: string }> = ({ address }) => {
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    geocode(address)
      .then((coords) => {
        if (!isCancelled) setCoordinates(coords);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [address]);

  if (isLoading) {
    return <Fallback>Загружаем карту...</Fallback>;
  }

  if (!coordinates) {
    return <Fallback>{address}</Fallback>;
  }

  return (
    <MapWrapper>
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={14}
        style={{ height: 300, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]} icon={markerIcon} />
      </MapContainer>
    </MapWrapper>
  );
};
