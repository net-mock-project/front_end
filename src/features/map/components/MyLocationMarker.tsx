
import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";

interface MyLocationMarkerProps {
    location: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
}


export const MyLocationMarker=({location}:MyLocationMarkerProps)=> {
    console.log("my location ",location)
    return (
        <>
            <AdvancedMarker
                position={{
                    lat: location.latitude,
                    lng: location.longitude
                }}
                anchorLeft="-50%"
                anchorTop="-50%"
            >
                <div className={`marker-base my-location-marker`}/>
                <Circle
                center={{lat: location.latitude, lng: location.longitude}}
                radius={location.accuracy}
                fillColor="#2563EB"
                fillOpacity={0.12}
                strokeColor="#2563EB"
                strokeOpacity={0.3}
                strokeWeight={1}
            />
            </AdvancedMarker>
        </>
    )
}