import React from "react";
import { Row, Col, Button, Typography } from "antd";
import {
  CompassOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  PhoneOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useGeoLocation } from "../../location/hooks/useGeoLocation";
import { getAllReliefRequests } from "../../reliefRequest/api/reliefRequestApi";
import type { ReliefRequest } from "../../../types/ReliefRequest";

import { MapContainer } from "../../map/components/MapContainer";
import { MyLocationMarker } from "../../map/components/MyLocationMarker";
import { ReliefRequestMarker } from "../../map/components/ReliefRequestMarker";

import "./HomePage.css";

const { Title, Paragraph } = Typography;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { location } = useGeoLocation();

  const { data: reliefRequests = [] } = useQuery({
    queryKey: ["relief-requests"],
    queryFn: getAllReliefRequests,
  });

  const defaultCenter = location
    ? { lat: location.latitude, lng: location.longitude }
    : { lat: 21.0285, lng: 105.8542 };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* 1. HERO BANNER */}
        <div className="home-hero">
          <div className="home-hero__circle" />
          <Title level={2} className="home-hero__title">
            RescueHub — Kết nối cộng đồng trong thiên tai
          </Title>
          <Paragraph className="home-hero__subtitle">
            Nền tảng giúp người dân theo dõi tình hình, gửi yêu cầu hỗ trợ, tìm trạm tiếp tế và
            phối hợp với lực lượng cứu trợ trên cùng một hệ thống.
          </Paragraph>

          <div className="home-hero__actions">
            <Button className="btn-hero-secondary">
              Xem cảnh báo mới
            </Button>
          </div>
        </div>

        {/* 2. MAP & INTRO SECTION */}
        <Row gutter={[20, 20]} className="home-main-row">
          {/* Cột trái: Bản đồ cứu trợ thực tế */}
          <Col xs={24} lg={15}>
            <div className="section-card">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Bản đồ tình hình cứu trợ</h3>
                  <div className="section-subtitle">
                    Các điểm cần cứu trợ và đội cứu trợ đang hoạt động
                  </div>
                </div>
                <Button className="btn-view-map" onClick={() => navigate("/map")}>
                  Xem toàn bản đồ
                </Button>
              </div>

              {/* Bản đồ thật có chiều cao xác định */}
              <div className="home-real-map-box">
                <MapContainer center={defaultCenter} zoom={11}>
                  {location ? <MyLocationMarker location={location} /> : null}

                  {reliefRequests.map((reliefRequest: ReliefRequest) => (
                    <ReliefRequestMarker
                      key={reliefRequest.requesterId}
                      reliefRequest={reliefRequest}
                      onClick={() => navigate("/map")}
                    />
                  ))}
                </MapContainer>
              </div>

              {/* Chú thích Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <span className="legend-dot pin-red" /> Điểm cứu trợ
                </div>
                <div className="legend-item">
                  <span className="legend-dot pin-blue" /> Vị trí của bạn
                </div>
              </div>
            </div>
          </Col>

          {/* Cột phải: Giới thiệu RescueHub */}
          <Col xs={24} lg={9}>
            <div className="section-card">
              <h3 className="section-title">Giới thiệu RescueHub</h3>
              <div className="section-subtitle">
                RescueHub kết nối Requester, Volunteer, Coordinator và Admin để thông tin được xác minh, điều phối và theo dõi minh bạch.
              </div>

              <div className="intro-features">
                <div className="feature-item">
                  <div className="feature-icon-box feature-icon-box--red">
                    <WarningOutlined />
                  </div>
                  <div className="feature-content">
                    <h4>Cảnh báo theo vị trí</h4>
                    <p>Nhận thông báo khi bạn nằm trong bán kính ảnh hưởng.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box feature-icon-box--blue">
                    <CompassOutlined />
                  </div>
                  <div className="feature-content">
                    <h4>Thông tin trên một bản đồ</h4>
                    <p>Điểm cứu trợ, trạm tiếp tế và lực lượng hỗ trợ.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box feature-icon-box--green">
                    <SafetyCertificateOutlined />
                  </div>
                  <div className="feature-content">
                    <h4>Điều phối có kiểm soát</h4>
                    <p>Theo dõi trạng thái yêu cầu, nhiệm vụ và vật tư.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* 3. BOTTOM GUIDES */}
        <Row gutter={[16, 16]} className="guide-row">
          <Col xs={24} sm={12} lg={6}>
            <div className="guide-card">
              <div className="guide-icon-wrapper guide-icon--red">
                <AlertOutlined />
              </div>
              <h4 className="guide-title">Rời vùng nguy hiểm</h4>
              <p className="guide-desc">
                Di chuyển đến nơi cao, chắc chắn và tuân thủ hướng dẫn của lực lượng chức năng.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="guide-card">
              <div className="guide-icon-wrapper guide-icon--blue">
                <CompassOutlined />
              </div>
              <h4 className="guide-title">Chia sẻ vị trí chính xác</h4>
              <p className="guide-desc">
                Bật GPS, ghi rõ địa chỉ, số người và mức độ khẩn cấp khi gửi báo cáo.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="guide-card">
              <div className="guide-icon-wrapper guide-icon--green">
                <InboxOutlined />
              </div>
              <h4 className="guide-title">Chuẩn bị nhu yếu phẩm</h4>
              <p className="guide-desc">
                Mang theo nước sạch, thực phẩm khô, thuốc, đèn pin và giấy tờ quan trọng.
              </p>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="guide-card">
              <div className="guide-icon-wrapper guide-icon--yellow">
                <PhoneOutlined />
              </div>
              <h4 className="guide-title">Giữ liên lạc</h4>
              <p className="guide-desc">
                Tiết kiệm pin, cập nhật tình hình và không lan truyền thông tin chưa xác minh.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};