import Sidebar from "../components/Sidebar";
import MainContent from "../components/Main";
import InfoIcon from "../components/InfoIcon";

export default function V1Home() {
  return (
    <div className="bg-[#1e1b4b] text-gray-100 min-h-screen">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:gap-60">
          <div className="md:fixed md:w-1/4 w-full">
            <Sidebar />
          </div>
          <div className="hidden md:block md:w-1/4"></div>
          <div className="w-full md:w-3/4">
            <MainContent />
          </div>
        </div>
      </div>
      <InfoIcon />
    </div>
  );
}
