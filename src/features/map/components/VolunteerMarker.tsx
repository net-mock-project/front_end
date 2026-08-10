import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Volunteer } from "../../../types/Volunteer";
import { UserOutlined } from "@ant-design/icons";


interface VolunteerMarkerProps {
    volunteer: Volunteer;
    onClick: (volunteer: Volunteer) => void;
}

export const VolunteerMarker = ({ volunteer, onClick }: VolunteerMarkerProps) => {
    return (
        <>
            <AdvancedMarker
                position={{
                    lat: volunteer.location.latitude,
                    lng: volunteer.location.longitude,
                }}
                onClick={() => onClick(volunteer)}
                anchorLeft="-50%"
                anchorTop="-50%"
            >
                <div
                    style={{
                        width: 38,
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#1677FF",
                        border: "3px solid white",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                        cursor: "pointer",
                    }}
                >
                    <UserOutlined
                        style={{
                            color: "white",
                            fontSize: 20,
                        }}
                    />
                </div>
            </AdvancedMarker>

            
        </>
    )
}