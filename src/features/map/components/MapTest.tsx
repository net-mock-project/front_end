import { useEffect, useRef } from "react";
import type { ReliefRequest } from "../../../types/ReliefRequest";
import type { Volunteer } from "../../../types/Volunteer";
import type { Warehouse } from "../../../types/Warehouse";
import { useGeoLocation } from "../../location/hooks/useGeoLocation";
import { MapContainer } from "./MapContainer"
import { MyLocationMarker } from "./MyLocationMarker";
import { ReliefRequestMarker } from "./ReliefRequestMarker";
import { VolunteerMarker } from "./VolunteerMarker";
import { WarehouseMarker } from "./WarehouseMarker";
import { useMap } from "@vis.gl/react-google-maps";
import { useLocationHub } from "../../location/hooks/useLocationHub";
import { useQuery } from "@tanstack/react-query";
import { getAllReliefRequests } from "../../reliefRequest/api/reliefRequestApi";




// const volunteers: Volunteer[] = [
//     {
//         userId: 1,
//         fullName: "Nguyễn Minh Anh",
//         email: "minhanh@example.com",
//         status: "ACTIVE",
//         province: "Hà Nội",
//         profileUrl: "/profiles/minh-anh.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0901234567",
//         location: {
//             latitude: 21.0285,
//             longitude: 105.8542,
//         },
//         experienceYears: 3,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 2,
//         fullName: "Trần Quốc Huy",
//         email: "quochuy@example.com",
//         status: "ACTIVE",
//         province: "Hải Phòng",
//         profileUrl: "/profiles/quoc-huy.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0912345678",
//         location: {
//             latitude: 20.8449,
//             longitude: 106.6881,
//         },
//         experienceYears: 5,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 3,
//         fullName: "Lê Thảo Nguyên",
//         email: "thaonguyen@example.com",
//         status: "ACTIVE",
//         province: "Đà Nẵng",
//         profileUrl: "/profiles/thao-nguyen.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0923456789",
//         location: {
//             latitude: 16.0544,
//             longitude: 108.2022,
//         },
//         experienceYears: 2,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 4,
//         fullName: "Phạm Hoàng Nam",
//         email: "hoangnam@example.com",
//         status: "ACTIVE",
//         province: "Thừa Thiên Huế",
//         profileUrl: "/profiles/hoang-nam.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0934567890",
//         location: {
//             latitude: 16.4637,
//             longitude: 107.5909,
//         },
//         experienceYears: 4,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 5,
//         fullName: "Võ Ngọc Mai",
//         email: "ngocmai@example.com",
//         status: "ACTIVE",
//         province: "Khánh Hòa",
//         profileUrl: "/profiles/ngoc-mai.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0945678901",
//         location: {
//             latitude: 12.2388,
//             longitude: 109.1967,
//         },
//         experienceYears: 1,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 6,
//         fullName: "Đặng Đức Long",
//         email: "duclong@example.com",
//         status: "ACTIVE",
//         province: "TP. Hồ Chí Minh",
//         profileUrl: "/profiles/duc-long.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0956789012",
//         location: {
//             latitude: 10.7769,
//             longitude: 106.7009,
//         },
//         experienceYears: 6,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 7,
//         fullName: "Nguyễn Thị Lan",
//         email: "thilan@example.com",
//         status: "ACTIVE",
//         province: "Cần Thơ",
//         profileUrl: "/profiles/thi-lan.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0967890123",
//         location: {
//             latitude: 10.0452,
//             longitude: 105.7469,
//         },
//         experienceYears: 3,
//         approvalStatus: "APPROVED",
//     },
//     {
//         userId: 8,
//         fullName: "Hoàng Văn Bình",
//         email: "vanbinh@example.com",
//         status: "INACTIVE",
//         province: "Quảng Ninh",
//         profileUrl: "/profiles/van-binh.jpg",
//         roleName: "VOLUNTEER",
//         phone: "0978901234",
//         location: {
//             latitude: 20.9505,
//             longitude: 107.0734,
//         },
//         experienceYears: 2,
//         approvalStatus: "PENDING",
//     },
// ];

const warehouses: Warehouse[] = [
    {
        warehouseId: 1,
        name: "Kho cứu trợ Hà Nội",
        location: {
            latitude: 21.0288,
            longitude: 105.8342,
        },
        phone: "02412345678",
        province: "Hà Nội",
    },
    {
        warehouseId: 2,
        name: "Kho cứu trợ Hải Phòng",
        location: {
            latitude: 20.8651,
            longitude: 106.6838,
        },
        phone: "02251234567",
        province: "Hải Phòng",
    },
    {
        warehouseId: 3,
        name: "Kho cứu trợ Đà Nẵng",
        location: {
            latitude: 16.0471,
            longitude: 108.2068,
        },
        phone: "02361234567",
        province: "Đà Nẵng",
    },
    {
        warehouseId: 4,
        name: "Kho cứu trợ Huế",
        location: {
            latitude: 16.455,
            longitude: 107.5624,
        },
        phone: "02341234567",
        province: "Thừa Thiên Huế",
    },
    {
        warehouseId: 5,
        name: "Kho cứu trợ Nha Trang",
        location: {
            latitude: 12.2451,
            longitude: 109.1943,
        },
        phone: "02581234567",
        province: "Khánh Hòa",
    },
    {
        warehouseId: 6,
        name: "Kho cứu trợ TP. Hồ Chí Minh",
        location: {
            latitude: 10.8231,
            longitude: 106.6297,
        },
        phone: "02812345678",
        province: "TP. Hồ Chí Minh",
    },
    {
        warehouseId: 7,
        name: "Kho cứu trợ Cần Thơ",
        location: {
            latitude: 10.0342,
            longitude: 105.7228,
        },
        phone: "02921234567",
        province: "Cần Thơ",
    },
];




export const MapTest = () => {
    const {location,error}= useGeoLocation();
    console.log(location,error);
    const {sendLocation}=  useLocationHub();
    const hasCentered = useRef(false);
    const map= useMap()
    useEffect(() => {
        if (!location || hasCentered.current||!map) {
            return;
        }

        map.panTo({
            lat: location.latitude,
            lng: location.longitude,
        });
        map.setZoom(12);
        hasCentered.current = true;

        
    }, [map,location]);

    useEffect(() => {
        if (!location) {
            return;
        }

        sendLocation(
            location.latitude,
            location.longitude
        );
    }, [location]);

   
    const {data: reliefRequests= []}= useQuery({
        queryKey: ["relief-requests"],
        queryFn: getAllReliefRequests
    })

    // const {data:volunteers=[]} =useQuery({
    //     queryKey: ['volunteers'],
    //     queryFn: getAllUsers
    // })

   

    return (
        <div className="map-test-wrapper">
            <MapContainer
                center={{ lat: 21.0285, lng: 105.8542 }}
                zoom={12}

            >
                {
                    location ? <MyLocationMarker location={location}/>:
                    null
                }

                {/* {volunteers.map((volunteer: User) => (
                    <VolunteerMarker
                        key={volunteer.id}
                        volunteer={volunteer}
                        onClick={() => { }}
                    />
                ))} */}
                {warehouses.map((warehouse) => (
                    <WarehouseMarker
                        key={warehouse.warehouseId}
                        warehouse={warehouse}
                        onClick={() => { }}
                    />
                ))}
                {reliefRequests.map((reliefRequest: ReliefRequest) => (
                    <ReliefRequestMarker
                        key={reliefRequest.requesterId}
                        reliefRequest={reliefRequest}
                        onClick={() => { }}
                    />
                ))}

            </MapContainer>
        </div>

    )
}