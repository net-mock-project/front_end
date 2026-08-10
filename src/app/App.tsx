import './App.css';
import { RegisterSection } from '../features/register/RegisterSection';

export default function App() {
  return (
    <main 
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        // Trên mobile có thể bỏ padding hoặc giảm đi cho gọn
        padding: '0px' 
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1440px',
          // Trên màn hình lớn giữ chiều cao đẹp, trên mobile cho tự do giãn theo nội dung
          height: '100vh', 
          maxHeight: '900px',
          backgroundColor: '#ffffff',
          display: 'flex',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <RegisterSection />
      </div>
    </main>
  );
}