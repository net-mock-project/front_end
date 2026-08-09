import React from 'react';

interface OtpModalProps {
  phone: string;
  otpCode: string;
  onChangeOtp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  phone,
  otpCode,
  onChangeOtp,
  onSubmit,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-[420px] bg-white rounded-[20px] shadow-2xl p-6 relative border border-gray-100">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6 mt-2">
          <div className="w-12 h-12 bg-red-50 text-[#C9383E] rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            🔒
          </div>
          <h3 className="text-[#172033] text-[20px] font-['Inter'] font-bold">Xác thực mã OTP</h3>
          <p className="text-[#667085] text-[13px] mt-1">
            Mã xác thực đã được gửi tới số điện thoại <span className="font-semibold text-[#172033]">{phone}</span>
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-[#344054] text-[13px] font-['Inter'] font-bold mb-1.5">Nhập mã OTP (6 số)</label>
            <input 
              type="text" 
              maxLength={6}
              value={otpCode}
              onChange={onChangeOtp}
              placeholder="Ví dụ: 123456"
              className="w-full h-[46px] px-[15px] bg-gray-50 rounded-[12px] border border-[#D9DEE7] text-[#172033] text-[16px] text-center tracking-widest font-bold font-['Inter'] outline-none focus:border-[#EF4444] transition-colors"
              autoFocus
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full h-[44.27px] bg-gradient-to-b from-[#E5484D] to-[#EF5F63] shadow-[0px_10px_22px_rgba(229,72,77,0.25)] rounded-[12px] text-white text-[15px] font-['Inter'] font-extrabold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};