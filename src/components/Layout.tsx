import React, { useState } from 'react';
import { Menu, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { isLoggedIn, logout, setIsLoggedIn } = useAuth();

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button
              className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400"
              onClick={() => (window.location.href = '/dashboard')}
            >
              Mind Mosaic
            </button>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Login/Logout Button */}
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300 shadow-md"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition duration-300 shadow-md"
                >
                  <LogIn className="w-5 h-5" /> Login
                </button>
              )}
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {isDarkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-500" />}
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-700 py-2">
            <div className="px-2 space-y-1">
              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 w-full px-4 py-2 text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <LogIn className="w-5 h-5" /> Login
                </button>
              )}

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />} 
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsLoggedIn(true);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}


























//OLD CODE WITH WORKING LOGIN LOGOUT BUT NOT GOOD UI
// import React, { useState } from 'react';
// import { Menu, Moon, Sun } from 'lucide-react';
// import AuthModal from './AuthModal';
// import { useAuth } from '../contexts/AuthContext';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//   // Use the global auth context
//   const { isLoggedIn, logout, setIsLoggedIn } = useAuth();

//   // Handler for login button click
//   const handleLoginClick = () => {
//     setIsAuthModalOpen(true);
//   };

//   return (
//     <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
//       <nav className="bg-white dark:bg-gray-800 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
//                 Mind Mosaic
//               </span>
//             </div>
            
//             <div className="hidden md:flex items-center space-x-4">
//               {/* Login/Logout Button */}
//               {isLoggedIn ? (
//                 <button
//                   onClick={logout}
//                   className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleLoginClick}
//                   className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Login
//                 </button>
//               )}

//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//               </button>
//             </div>

//             <div className="md:hidden flex items-center">
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t dark:border-gray-700">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {/* Mobile Login/Logout */}
//               {isLoggedIn ? (
//                 <button
//                   onClick={logout}
//                   className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleLoginClick}
//                   className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Login
//                 </button>
//               )}
              
//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 {isDarkMode ? (
//                   <div className="flex items-center">
//                     <Sun className="w-5 h-5 mr-3" /> Light Mode
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     <Moon className="w-5 h-5 mr-3" /> Dark Mode
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {children}
//       </main>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//         onSuccess={() => {
//           setIsLoggedIn(true);
//           setIsAuthModalOpen(false);
//         }}
//       />
//     </div>
//   );
// }
