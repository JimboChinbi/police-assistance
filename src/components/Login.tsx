import React, { useState } from 'react';
import { Button } from './ui/button';
export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const defaultUsername = 'admin';
  const defaultPassword = 'admin';

  const handleLogin = () => {
    if (username !== defaultUsername || password !== defaultPassword) {
      return alert('Invalid username or password');
    } else {
      window.location.href = '/home';
      localStorage.setItem('isLogin', 'true');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="w-fit border-2 p-4 bg-[#125B50] rounded-lg text-white">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold uppercase">
            POLICE ASSISTANCE MONITORING SYSTEM
          </h1>
          <p className="text-lg">Please login to continue</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-5  w-[40rem] p-4 ">
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
          />
          <Button
            onClick={handleLogin}
            className="p-2 bg-white  text-black rounded-md w-[10rem]"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
