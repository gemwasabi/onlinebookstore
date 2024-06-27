import React from 'react';
import { Link } from 'react-router-dom';

const UserSettings = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#B4BDB0] text-white p-4">
      <div className="w-full max-w-6xl bg-[#8E9A83] shadow-lg rounded-lg flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 bg-[#60725c] p-4 text-[#c3c9be]">
          <h2 className="text-xl lg:text-2xl text-left font-bold mb-4 lg:mb-10">Settings</h2>
          <Link to="/usersettings" className="block w-full text-left px-1 py-2 mb-2 lg:mb-4 bg-[#8E9A83] rounded">
            Përdoruesit
          </Link>
          <Link to="/usersettings2" className="block w-full text-left px-1 py-2 mb-2 lg:mb-4 bg-[#8E9A83] rounded">
            Adresat
          </Link>
          <Link to="/usersettings3" className="block w-full text-left px-1 py-2 mb-2 lg:mb-4 bg-[#8E9A83] rounded">
            Kartelat bankare
          </Link>
        </div>
        <div className="w-full lg:w-3/4 p-4 lg:p-10 space-y-6 bg-[#7b8f76]">
          <h3 className="text-2xl font-bold text-center mb-4 lg:mb-8">User Address Settings</h3>
          <div className="w-full lg:w-3/4 p-4 lg:p-10 bg-[#7b8f76]">
            <h3 className="text-2xl font-bold text-center mb-4 lg:mb-8">User Address Settings</h3>
            <form>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 px-2">
                <div className="col-span-1 lg:col-span-2">
                  <h3 className="text-xl font-bold text-[#c3c9be] mb-4">Adresa e përdoruesit</h3>
                </div>
                <div>
                  <label htmlFor="street" className="block mb-2 text-sm font-medium text-[#5a6856]">Rruga</label>
                  <input type="text" id="street" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="Rruga" required />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-2 text-sm font-medium text-[#5a6856]">Qyteti</label>
                  <input type="text" id="city" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="Qyteti" required />
                </div>
                <div>
                  <label htmlFor="state" className="block mb-2 text-sm font-medium text-[#5a6856]">Shteti</label>
                  <input type="text" id="state" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="Shteti" required />
                </div>
                <div>
                  <label htmlFor="zip" className="block mb-2 text-sm font-medium text-[#5a6856]">Kodi Postar</label>
                  <input type="text" id="zip" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="Kodi Postar" required />
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button type="button" className="text-white bg-[#60725c] hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#4e5e4b] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Ruaj Ndryshimet</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
