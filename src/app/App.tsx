import './App.css';
import { RegisterSection } from '../features/register/componets/RegisterSection';

export default function App() {
  const handleNavigate = (page: string) => {
    console.log("Điều hướng đến trang:", page);
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="shadow-2xl overflow-hidden rounded-2xl w-[1440px] h-[900px] bg-white relative">
        <RegisterSection onNavigate={handleNavigate} />
      </div>
    </main>
  );
}