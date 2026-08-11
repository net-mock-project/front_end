import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Warehouse } from "../../../types/Warehouse";
import { ShopOutlined } from "@ant-design/icons";
import "./MapComponents.css";

interface WarehouseMarkerProps {
    warehouse: Warehouse;
    onClick: (warehouse: Warehouse) => void;
}

export const WarehouseMarker = ({ warehouse, onClick }: WarehouseMarkerProps) => {
    return (
        <AdvancedMarker
            position={{
                lat: warehouse.location.latitude,
                lng: warehouse.location.longitude,
            }}
            onClick={() => onClick(warehouse)}
            anchorLeft="-50%"
            anchorTop="-50%"
        >
            <div className="marker-base warehouse-marker">
                <ShopOutlined className="marker-icon warehouse-icon" />
            </div>
        </AdvancedMarker>
    )
}
