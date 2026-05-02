import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setSearchQuery } = useHospital();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    navigate('/doctors');
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search doctors, departments, hospitals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-colors"
        />
      </div>
    </form>
  );
};