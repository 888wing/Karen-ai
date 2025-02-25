export default function BottomNavbar() {
  return (
    <div className="bg-[#E6AA63] py-2 px-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
            A
          </div>
          <span className="text-xs mt-1">Karen Pro</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl">
            📊
          </div>
          <span className="text-xs mt-1">Chart</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xl">
            ⚙️
          </div>
          <span className="text-xs mt-1">Setting</span>
        </div>
      </div>
    </div>
  );
}