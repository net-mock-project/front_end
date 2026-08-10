import { AdvancedMarker, Circle } from "@vis.gl/react-google-maps";
import { AlertFilled } from "@ant-design/icons";
import type { ReliefRequest } from "../../../types/ReliefRequest";

interface ReliefRequestMarkerProps {
    reliefRequest: ReliefRequest
    onClick: (reliefRequest: ReliefRequest) => void;
}

export const ReliefRequestMarker = ({ reliefRequest, onClick }: ReliefRequestMarkerProps) => {

    return (
        <>
            <AdvancedMarker
                position={{
                    lat: reliefRequest.location.latitude,
                    lng: reliefRequest.location.longitude,
                }}
                onClick={() => onClick(reliefRequest)}
                anchorLeft="-50%"
                anchorTop="-50%"
                
            >
                <div
                    style={{
                        width: 42,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#EF4444",
                        border: "3px solid white",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
                        cursor: "pointer",
                    }}
                >
                    <AlertFilled
                        style={{
                            color: "white",
                            fontSize: 22,
                        }}
                    />
                </div>
            </AdvancedMarker>
            <Circle
                center={{
                    lat: reliefRequest.location.latitude,
                    lng: reliefRequest.location.longitude
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

