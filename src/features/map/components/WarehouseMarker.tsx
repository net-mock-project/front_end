import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Warehouse } from "../../../types/Warehouse";
import { ShopOutlined } from "@ant-design/icons";

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
            <div
                style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FA8C16",
                    border: "3px solid white",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    cursor: "pointer",
                }}
            >
                <ShopOutlined
                    style={{
                        color: "white",
                        fontSize: 21,
                    }}
                />
            </div>
        </AdvancedMarker>
    )
}
