import React from 'react';
import { Link } from 'react-router-dom';

const UserSettings2 = () => {
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
          <h3 className="text-2xl font-bold text-center mb-4 lg:mb-8">User Settings</h3>
          <div className="w-full lg:w-3/4 p-4 lg:p-10 bg-[#7b8f76]">
            <h3 className="text-2xl font-bold text-center mb-4 lg:mb-8">User Profile Settings</h3>
            <form>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 px-2">
                <div className="col-span-1 lg:col-span-2">
                  <h3 className="text-xl font-bold text-[#c3c9be] mb-4">Detajet e llogarisë</h3>
                </div>
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-[#5a6856]">Emri dhe Mbiemri</label>
                  <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="Filane Fisteku" required />
                </div>
                <div>
                  <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-[#5a6856]">Nr. i tel</label>
                  <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="+383" required />
                </div>
                <div>
                  <label htmlFor="company" className="block mb-2 text-sm font-medium text-[#5a6856]">E-mail adresa</label>
                  <input type="text" id="company" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="example@example.com" required />
                </div>
                <div>
                  <label htmlFor="visitors" className="block mb-2 text-sm font-medium text-[#5a6856]">Qyteti</label>
                  <select id="visitors" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" required>
                    <option value=""></option>
                    <option value="Besianë (Podujevë)">Besianë (Podujevë)</option>
                    <option value="Deçan">Deçan</option>
                    <option value="Dragash">Dragash</option>
                    <option value="Drenas (Glogovac)">Drenas (Glogovac)</option>
                    <option value="Ferizaj">Ferizaj</option>
                    <option value="Fushë Kosovë">Fushë Kosovë</option>
                    <option value="Gjakova">Gjakova</option>
                    <option value="Gjilan">Gjilan</option>
                    <option value="Hani i Elezit">Hani i Elezit</option>
                    <option value="Istog">Istog</option>
                    <option value="Junik">Junik</option>
                    <option value="Kaçanik">Kaçanik</option>
                    <option value="Kamenicë">Kamenicë</option>
                    <option value="Klinë">Klinë</option>
                    <option value="Leposaviq">Leposaviq</option>
                    <option value="Lipjan">Lipjan</option>
                    <option value="Malishevë">Malishevë</option>
                    <option value="Mitrovica">Mitrovica</option>
                    <option value="North Mitrovica">North Mitrovica</option>
                    <option value="Obiliq">Obiliq</option>
                    <option value="Peja">Peja</option>
                    <option value="Prishtina">Prishtina</option>
                    <option value="Prizren">Prizren</option>
                    <option value="Rahovec">Rahovec</option>
                    <option value="Ranillug">Ranillug</option>
                    <option value="Shtërpcë">Shtërpcë</option>
                    <option value="Shtime">Shtime</option>
                    <option value="Skenderaj">Skenderaj</option>
                    <option value="Suhareka">Suhareka</option>
                    <option value="Viti">Viti</option>
                    <option value="Vushtrri">Vushtrri</option>
                    <option value="Zubin Potok">Zubin Potok</option>
                    <option value="Zvečan">Zvečan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-[#5a6856]">Fjalekalimi</label>
                  <input type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="********" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required />
                </div>
                <div>
                  <label htmlFor="website" className="block mb-2 text-sm font-medium text-[#5a6856]">Nr.personal</label>
                  <input type="url" id="website" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900" placeholder="00000000" required />
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button type="button" className="text-white bg-[#60725c] hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#4e5e4b] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Edito Profilin</button>
                <button type="button" className="text-white bg-[#8E9A83] hover:bg-red-400 focus:ring-[#7b8f76] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Fshij Profilin</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings2;
