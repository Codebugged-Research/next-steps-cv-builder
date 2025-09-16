import { LogOut } from "lucide-react";


const Header = ({ onLogout }) => (
    <header className="bg-gray-200 shadow-sm border-b border-gray-200">
        <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 px-12">
                <div className="flex items-center">
                    <img
                        src="/NEXT-STEPS-LOGO.png"
                        alt="Next Steps Logo"
                        className="h-10"
                    />
                    <h1 className="text-xl font-semibold text-[#04445E]">
                        Next Steps-USMLE CV Builder
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome</span>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 text-[#04445E] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>
)

export default Header;