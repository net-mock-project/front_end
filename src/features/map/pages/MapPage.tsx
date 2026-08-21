import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { AimOutlined, ThunderboltFilled, UserOutlined } from "@ant-design/icons";
import { useMap } from "@vis.gl/react-google-maps";
import type { ReliefRequest } from "../../../types/ReliefRequest";
import type { Volunteer } from "../../../types/Volunteer";
import { getAllReliefRequests } from "../../reliefRequest/api/reliefRequestApi";
import { getAllVolunteers } from "../api/volunteerApi";
import { useGeoLocation } from "../../location/hooks/useGeoLocation";
import { useLocationHub } from "../../location/hooks/useLocationHub";
import { MapContainer } from "../components/MapContainer";
import { MyLocationMarker } from "../components/MyLocationMarker";
import { ReliefRequestMarker } from "../components/ReliefRequestMarker";
import { VolunteerMarker } from "../components/VolunteerMarker";
import { MapDetailModal, type SelectedMarker } from "../components/MapDetailModal";
import "../components/MapComponents.css";
import "./MapPage.css";

const defaultCenter = { lat: 21.0285, lng: 105.8542 };

export default function MapPage() {
	const [selectedMarker, setSelectedMarker] = useState<SelectedMarker>(null);
	const [showVolunteers, setShowVolunteers] = useState(true);
	const [showRequests, setShowRequests] = useState(true);
	const { location } = useGeoLocation();
	const { sendLocation } = useLocationHub();
	const map = useMap();
	const hasCentered = useRef(false);
	const { data: volunteers = [], isLoading: isVolunteersLoading, isError: isVolunteersError } = useQuery<Volunteer[]>({ queryKey: ["volunteers"], queryFn: getAllVolunteers });
	const { data: reliefRequests = [], isLoading: isRequestsLoading, isError: isRequestsError } = useQuery<ReliefRequest[]>({ queryKey: ["relief-requests"], queryFn: getAllReliefRequests });
	useEffect(() => { if (location && map && !hasCentered.current) { map.panTo({ lat: location.latitude, lng: location.longitude }); map.setZoom(12); hasCentered.current = true; } }, [location, map]);
	useEffect(() => { if (location) sendLocation(location.latitude, location.longitude); }, [location, sendLocation]);
	const activeRequests = reliefRequests.filter((request) => request.status?.toLowerCase() !== "completed");

	return <main className="map-page">
		<section className="map-stage"><div className="map-toolbar"><span className="map-toolbar-title"><span className="live-dot" /> BẢN ĐỒ CỨU TRỢ</span><div className="map-toolbar-actions"><Button className={showVolunteers ? "is-selected" : ""} icon={<UserOutlined />} onClick={() => setShowVolunteers(!showVolunteers)}>Volunteer ({volunteers.length})</Button><Button className={showRequests ? "is-selected" : ""} icon={<ThunderboltFilled />} onClick={() => setShowRequests(!showRequests)}>Yêu cầu ({activeRequests.length})</Button><Button icon={<AimOutlined />} onClick={() => location && map?.panTo({ lat: location.latitude, lng: location.longitude })}>Vị trí của tôi</Button></div></div><MapContainer center={defaultCenter} zoom={12}>{location && <MyLocationMarker location={location} />}{showVolunteers && volunteers.map((volunteer) => <VolunteerMarker key={volunteer.id} volunteer={volunteer} onClick={(value) => setSelectedMarker({ type: "volunteer", value })} />)}{showRequests && activeRequests.map((request) => <ReliefRequestMarker key={request.id} reliefRequest={request} onClick={(value) => setSelectedMarker({ type: "relief", value })} />)}</MapContainer>{(isVolunteersLoading || isRequestsLoading) && <div className="map-status"><Spin /> Đang tải dữ liệu bản đồ...</div>}{(isVolunteersError || isRequestsError) && <div className="map-status map-error">Không thể tải đầy đủ dữ liệu bản đồ.</div>}</section>
		<MapDetailModal selectedMarker={selectedMarker} onClose={() => setSelectedMarker(null)} />
	</main>;
}
