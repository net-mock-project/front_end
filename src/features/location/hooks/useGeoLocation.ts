import { useEffect, useState } from "react"


export interface UserLocation {
    latitude: number
    longitude: number
    accuracy: number
    heading: number | null
}

export const useGeoLocation = () => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [requestId, setRequestId] = useState(0);

    useEffect(()=>{
        setError(null);
        if(!navigator.geolocation){
            setError("Browser không support geolocation");
            return;
        }
        const watchId= navigator.geolocation.watchPosition(
            ({coords})=>{
                setLocation(
                    {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        accuracy: coords.accuracy,
                        heading: coords.heading,
                    }
                )
            }, 
            (error: GeolocationPositionError) =>{
                setError(error.message)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000,
            }

        );

        return ()=>{
            navigator.geolocation.clearWatch(watchId);
        }
    },[requestId]);

    return { location, error, requestLocation: () => setRequestId((current) => current + 1) }

}