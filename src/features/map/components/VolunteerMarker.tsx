import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Volunteer } from "../../../types/Volunteer";
import { UserOutlined } from "@ant-design/icons";
import "./MapComponents.css";


interface VolunteerMarkerProps {
    volunteer: Volunteer;
    onClick: (volunteer: Volunteer) => void;
}

export const VolunteerMarker = ({ volunteer, onClick }: VolunteerMarkerProps) => {
    const isInactive = volunteer.status?.toLowerCase() === "inactive";

    return (
        <>
            <AdvancedMarker
                position={{
                    lat: volunteer.latitude,
                    lng: volunteer.longitude,
                }}
                onClick={() => onClick(volunteer)}
                anchorLeft="-50%"
                anchorTop="-50%"
            >
                <div className={`marker-base volunteer-marker ${isInactive ? "marker-inactive" : ""}`}>
                    <UserOutlined className="marker-icon volunteer-icon" />
                </div>
            </AdvancedMarker>

            
        </>
    )
}