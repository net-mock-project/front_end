import { Map } from "@vis.gl/react-google-maps";

export default function GoogleMapTest() {
    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Map
                defaultCenter={{
                    lat: 21.0285,
                    lng: 105.8542,
                }}
                defaultZoom={14}
                gestureHandling="greedy"
                disableDefaultUI={false}
            />
        </div>
    );
}