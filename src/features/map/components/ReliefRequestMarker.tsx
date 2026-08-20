import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";
import { AlertFilled } from "@ant-design/icons";
import type { ReliefRequest } from "../../../types/ReliefRequest";
import "./MapComponents.css";

interface ReliefRequestMarkerProps {
    reliefRequest: ReliefRequest
    onClick: (reliefRequest: ReliefRequest) => void;
}

export const ReliefRequestMarker = ({ reliefRequest, onClick }: ReliefRequestMarkerProps) => {

    return (
        <>
            <AdvancedMarker
                position={{
                    lat: reliefRequest.latitude,
                    lng: reliefRequest.longitude,
                }}
                onClick={() => onClick(reliefRequest)}
                anchorLeft="-50%"
                anchorTop="-50%"
                
            >
                <div className="marker-base relief-marker">
                    <AlertFilled className="marker-icon relief-icon" />
                </div>
            </AdvancedMarker>
            <Circle
                center={{
                    lat: reliefRequest.latitude,
                    lng: reliefRequest.longitude
                }}
                radius={reliefRequest.estimatedAffectedRadiusKm * 1000}

                fillColor="#EF4444"
                fillOpacity={0.2}
                strokeColor="#EF4444"
                strokeOpacity={0.8}
                strokeWeight={2}

            />
        </>


    )

}

