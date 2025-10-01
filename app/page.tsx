import Sidebar from "./components/Sidebar";
import MainContent from "./components/Main";

export default function Home() {
  return (
    <div className="bg-[#1e1b4b] text-gray-100 min-h-screen">
      <div className="max-w-[90rem] mx-auto px-8 pl-4">
        <div className="flex gap-60">
          <div className="fixed w-1/4">
            <Sidebar />
          </div>
          <div className="w-1/4"></div>
          <div className="w-3/4">
            <MainContent />
          </div>
        </div>
      </div>
    </div>
  );
}
