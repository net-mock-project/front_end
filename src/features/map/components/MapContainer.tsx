import { Map } from "@vis.gl/react-google-maps";
import { env } from "../../../config/env";

interface MapContainerProps {
    children: React.ReactNode;
    center: google.maps.LatLngLiteral;
    zoom: number;
}

export const MapContainer = ({ children, center, zoom=12 }: MapContainerProps) => {
    return (
        <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={center}
            defaultZoom={zoom}
            mapId={env.googleMapsId}
    
        >
            {children}
        </Map>
    );
}

