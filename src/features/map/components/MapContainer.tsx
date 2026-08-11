import { Map } from "@vis.gl/react-google-maps";
import { env } from "../../../config/env";
import "./MapComponents.css";

interface MapContainerProps {
    children: React.ReactNode;
    center: google.maps.LatLngLiteral;
    zoom: number;
}

export const MapContainer = ({ children, center, zoom=12 }: MapContainerProps) => {
    return (
        <Map
            className="map-container"
            defaultCenter={center}
            defaultZoom={zoom}
            mapId={env.googleMapsId}
    
        >
            {children}
        </Map>
    );
}

