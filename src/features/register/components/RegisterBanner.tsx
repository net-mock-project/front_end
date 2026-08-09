import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SafetyCertificateOutlined } from '@ant-design/icons';

// Dữ liệu cho các thẻ thống kê
const STATS_DATA = [
  { value: '24/7', label: 'Tiếp nhận yêu cầu' },
  { value: '3 phút', label: 'Hoàn tất đăng ký' },
  { value: 'Miễn phí', label: 'Cho mọi người dùng' },
];

// Dữ liệu cho các điểm ghim trang trí nền
const MARKERS_DATA = [
  { left: '645.56px', top: '468.41px', bg: '#16A34A', val: '4' },
  { left: '541.74px', top: '738.41px', bg: '#F59E0B', val: '1' },
  { left: '460.16px', top: '495.41px', bg: '#DC2626', val: '7' },
  { left: '245.09px', top: '720.41px', bg: '#2563EB', val: '5' },
  { left: '104.19px', top: '630.41px', bg: '#F59E0B', val: '2' },
  { left: '615.89px', top: '180.41px', bg: '#DC2626', val: '3' },
  { left: '289.59px', top: '216.41px', bg: '#16A34A', val: '6' },
];

export const RegisterBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-[741.60px] h-[900px] relative overflow-hidden flex-shrink-0"
      style={{
        background: `
          radial-gradient(ellipse 126.44% 104.19% at 22.00% 18.00%, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0) 19%),
          radial-gradient(ellipse 117.13% 96.51% at 78.00% 72.00%, rgba(22, 163, 74, 0.10) 0%, rgba(22, 163, 74, 0) 21%),
          linear-gradient(26deg, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0.92) 46%, rgba(255, 255, 255, 0.92) 49%, rgba(255, 255, 255, 0) 50%),
          linear-gradient(116deg, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0.92) 46%, rgba(255, 255, 255, 0.92) 49%, rgba(255, 255, 255, 0) 50%),
          #DFECE3
        `
      }}
    >
      {/* Logo & Brand (Điều hướng về Trang chủ bằng React Router) */}
      <div 
        className="absolute left-[68px] top-[72px] flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate('/')}
      >
        <div className="w-[42px] h-[42px] bg-gradient-to-br from-[#EF4444] to-[#FB7185] shadow-[0px_10px_22px_rgba(229,72,77,0.28)] rounded-[14px] flex items-center justify-center text-white text-lg">
          <SafetyCertificateOutlined />
        </div>
        <div>
          <div className="text-[#172033] text-[16px] font-['Inter'] font-extrabold group-hover:text-[#EF4444] transition-colors">
            RescueHub
          </div>
          <div className="text-[#667085] text-[11px] font-['Inter'] font-semibold">
            Cùng nhau tạo nên thay đổi
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute w-[522.13px] h-[522.13px] left-[-170px] top-[597.87px] rounded-full border border-[rgba(37,99,235,0.13)] pointer-events-none"></div>
      <div className="absolute w-[362.13px] h-[362.13px] left-[479.47px] top-[-100px] rounded-full border border-[rgba(220,38,38,0.15)] pointer-events-none"></div>

      {/* Badge */}
      <div className="absolute left-[68px] top-[219px] px-4 py-2 bg-[rgba(255,255,255,0.88)] rounded-full border border-[rgba(220,38,38,0.16)] flex items-center gap-2 shadow-sm">
        <span className="text-[#C9383E] text-[13px]">●</span>
        <span className="text-[#C9383E] text-[13px] font-['Inter'] font-bold">Tham gia cộng đồng RescueHub</span>
      </div>

      {/* Headline */}
      <div className="absolute left-[68px] top-[271.93px] text-[#172033] text-[52px] font-['Inter'] font-bold leading-[56.16px]">
        Một tài khoản, nhiều<br />cách để giúp đỡ.
      </div>

      {/* Description */}
      <div className="absolute left-[68px] top-[410.77px] text-[#475467] text-[17px] font-['Inter'] leading-[28.90px]">
        Đăng ký để gửi yêu cầu cứu trợ, quyên góp vật tư hoặc trở<br />thành tình nguyện viên khi cộng đồng cần bạn.
      </div>

      {/* Stats Cards */}
      <div className="absolute left-[68px] top-[510.30px] flex gap-4">
        {STATS_DATA.map((stat, index) => (
          <div 
            key={index} 
            className="w-[177.33px] h-[91.20px] bg-[rgba(255,255,255,0.88)] shadow-[0px_10px_26px_rgba(31,41,55,0.06)] rounded-[18px] border border-[rgba(148,163,184,0.22)] p-4 backdrop-blur-[4px]"
          >
            <div className="text-[#172033] text-[24px] font-['Inter'] font-bold">{stat.value}</div>
            <div className="text-[#667085] text-[12px] font-['Inter'] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Background Decorative Markers */}
      {MARKERS_DATA.map((marker, index) => (
        <div 
          key={index}
          className="absolute w-[36px] h-[32px] transform -rotate-45 shadow-[0px_8px_20px_rgba(31,41,55,0.18)] rounded-tr-[17px] rounded-tl-[17px] rounded-br-[17px] rounded-bl-[8px] outline outline-2 outline-white flex items-center justify-center pointer-events-none"
          style={{ 
            left: marker.left, 
            top: marker.top, 
            backgroundColor: marker.bg 
          }}
        >
          <span className="transform rotate-45 text-white text-[10px] font-black">{marker.val}</span>
        </div>
      ))}
    </div>
  );
};