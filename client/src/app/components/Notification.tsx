import { useState, useEffect } from 'react';

const Notification = ({ message, duration = 3000 }:{message:string, duration:number}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      //setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className={`fixed top-0 left-0 w-full flex justify-center items-center transition-transform duration-500 -translate-y-full`}>
      <div className="bg-blue-500 text-white px-4 py-2 rounded shadow">
        {message}
      </div>
    </div>
  );
};

export default Notification;
