import './App.css';
import { RegisterSection } from '../features/register/RegisterSection';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div className="shadow-2xl overflow-hidden rounded-2xl w-[1440px] h-[900px] bg-white relative">
        <RegisterSection />
      </div>
    </main>
  );
}