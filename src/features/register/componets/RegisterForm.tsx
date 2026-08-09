import React from 'react';

interface RegisterFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isFormComplete: boolean;
  loading: boolean;
  onNavigate?: (page: 'login' | 'home' | 'register' | 'forgot') => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isFormComplete,
  loading,
  onNavigate
}) => {
  return (
    <form 
      onSubmit={handleSubmit}
      className="w-[698.40px] h-[900px] relative flex flex-col justify-center px-[99.2px] flex-shrink-0"
      style={{
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%), radial-gradient(ellipse 114.18% 88.60% at 30.00% 30.00%, #FEE2E2 0%, rgba(254, 226, 226, 0) 36%)'
      }}
    >
      <h2 className="text-[#172033] text-[34px] font-['Inter'] font-bold mb-2">Tạo tài khoản</h2>
      <p className="text-[#667085] text-[15px] font-['Inter'] mb-4 leading-[24px]">
        Nhập thông tin cơ bản. Bạn sẽ xác thực số điện thoại bằng mã OTP.
      </p>

      {/* Row 1: Họ và tên & Ngày sinh */}
      <div className="flex gap-[16px] mb-3">
        <div className="flex-1">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Họ và tên</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
            required
          />
        </div>
        <div className="flex-1 relative">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Ngày sinh</label>
          <div className="relative flex items-center">
            <input 
              type="text" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
              required
            />
            <span className="absolute right-4 text-[#667085] pointer-events-none flex items-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Email & Số điện thoại */}
      <div className="flex gap-[16px] mb-3">
        <div className="flex-1">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập địa chỉ email"
            className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Số điện thoại</label>
          <input 
            type="text" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
            required
          />
        </div>
      </div>

      {/* Row 3: Mật khẩu & Xác nhận mật khẩu */}
      <div className="flex gap-[16px] mb-3">
        <div className="flex-1">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Mật khẩu</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu(ít nhất 8 ký tự)"
            className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Xác nhận mật khẩu</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
            className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
            required
          />
        </div>
      </div>

      {/* Row 4: Địa chỉ hiện tại */}
      <div className="mb-4">
        <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1">Địa chỉ hiện tại</label>
        <input 
          type="text" 
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ hiện tại"
          className="w-full h-[42px] px-[15px] bg-white rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[14px] font-['Inter'] outline-none focus:border-[#EF4444] transition-colors shadow-sm"
          required
        />
      </div>

      {/* Terms checkbox */}
      <div className="flex items-center gap-3 mb-5">
        <input 
          type="checkbox" 
          name="agreed"
          checked={formData.agreed}
          onChange={handleChange}
          className="w-4 h-4 accent-[#E5484D] rounded-[3px] cursor-pointer" 
        />
        <span className="text-[#667085] text-[12.5px] font-['Inter']">Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật.</span>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading || !isFormComplete}
        className={`w-full h-[44.27px] rounded-[12px] text-white text-[15px] font-['Inter'] font-extrabold transition-all mb-4 flex items-center justify-center ${
          isFormComplete && !loading 
            ? 'bg-gradient-to-b from-[#E5484D] to-[#EF5F63] shadow-[0px_10px_22px_rgba(229,72,77,0.25)] hover:opacity-95 active:scale-[0.99] cursor-pointer' 
            : 'bg-gray-300 cursor-not-allowed opacity-70 shadow-none'
        }`}
      >
        {loading ? 'Đang xử lý...' : 'Đăng ký và nhận OTP'}
      </button>

      {/* Footer Link */}
      <div className="text-center">
        <span className="text-[#667085] text-[13px] font-['Inter']">Đã có tài khoản? </span>
        <a 
          href="#login" 
          onClick={(e) => { 
            e.preventDefault(); 
            if (onNavigate) {
              onNavigate('login');
            } else {
              alert('Chuyển sang trang Đăng nhập');
            }
          }} 
          className="text-[#C9383E] text-[13px] font-['Inter'] font-extrabold hover:underline"
        >
          Đăng nhập
        </a>
      </div>
    </form>
  );
};