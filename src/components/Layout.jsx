import { Link, Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>

            <nav className="fixed top-0 w-full z-40 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl hover:opacity-80 transition-opacity flex-shrink-0">
                        <img src="/assets/logo.svg" alt="Headhunt Logo" className="w-8 h-8" />
                        <span className="hidden sm:inline">HEADHUNT</span>
                    </Link>
                    <div className="flex flex-nowrap gap-6 text-sm font-medium text-gray-400 overflow-x-auto no-scrollbar py-2 ml-auto">
                        <Link to="/employers" className="hover:text-white transition-colors whitespace-nowrap">EMPLOYERS</Link>
                        <Link to="/about" className="hover:text-white transition-colors whitespace-nowrap">ABOUT</Link>
                        <Link to="/match" className="hover:text-white transition-colors font-bold text-blue-400 whitespace-nowrap">MATCH</Link>
                        <Link to="/jobs" className="hover:text-white transition-colors whitespace-nowrap">JOBS</Link>
                        <Link to="/network" className="hover:text-white transition-colors whitespace-nowrap">NETWORK</Link>
                        <Link to="/admin" className="hover:text-white transition-colors whitespace-nowrap">ADMIN</Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
                {/* React Router Outlet is handled in App.jsx by child routes, 
            but here we expect children if used as wrapper, 
            or we need to use <Outlet /> if using Layout route.
            Let's adjust App.jsx or here. App.jsx uses Layout as a layout route wrapper.
        */}
                <div className="animate-fade-in">
                    {/* If Layout is used as a wrapper in App.jsx via <Route element={<Layout/>}> <Outlet/> </Route> 
               we need to render Outlet. But my App.jsx above acts as if Layout wraps content?
               Wait, in App.jsx: <Route path="/" element={<Layout />}>...
               So Layout needs to render <Outlet />.
            */}
                    {/* Fixing below in next edit or assume I fix it here */}
                    <Outlet />
                </div>
            </main>

            <footer className="border-t border-white/10 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>© 2024 Headhunt. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
                        <Link to="/legal#privacy" className="hover:text-gray-400">Privacy Policy</Link>
                        <span>•</span>
                        <Link to="/legal#terms" className="hover:text-gray-400">Terms of Service</Link>
                        <span>•</span>
                        <Link to="/legal#cookies" className="hover:text-gray-400">Cookie Policy</Link>
                    </div>
                    <p className="mt-4 text-xs text-gray-600 max-w-3xl mx-auto">
                        Headhunt is a recruitment platform connecting employers with talent. We are not a law firm or staffing agency.
                        All information provided is for general informational purposes only. Use of this platform constitutes acceptance of our Terms of Service.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
