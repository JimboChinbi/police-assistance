import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import App from '@/App';

export default function Root() {
  const location = useLocation();

  // const isLogin = localStorage.getItem('isLogin');

  // if (!isLogin) {
  //   return (window.location.href = '/login');
  // }

  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    window.location.href = '/login';
  };
  

  return (
    <div className="w-full ">
      <div className="flex ">
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
      <Button onClick={handleLogout} className="bg-[#125B50] fixed bottom-5 left-10">
        Logout
      </Button>
    </div>
  );
}
