import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hospital, Doctor, Schedule } from '../types';
import { publicAPI } from '../services/api';

interface HospitalContextType {
  hospitals: Hospital[];
  doctors: Doctor[];
  schedules: Schedule[];
  searchQuery: string;
  selectedHospital: string;
  selectedDepartment: string;
  setSearchQuery: (query: string) => void;
  setSelectedHospital: (hospital: string) => void;
  setSelectedDepartment: (department: string) => void;
  filteredDoctors: Doctor[];
  getDoctorsByHospital: (hospitalId: string) => Doctor[];
  getSchedulesByDoctor: (doctorId: string) => Schedule[];
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [h, d, s] = await Promise.all([
          publicAPI.getHospitals(),
          publicAPI.getDoctors(),
          publicAPI.getSchedules(),
        ]);
        if (!isMounted) return;
        // Normalize ids to strings
        const hospitalsNorm: Hospital[] = h.map((x: any) => ({
          ...x,
          id: x.id || x._id,
        }));
        const doctorsNorm: Doctor[] = d.map((x: any) => ({
          ...x,
          id: x.id || x._id,
          hospitalId: typeof x.hospitalId === 'object' ? (x.hospitalId.id || x.hospitalId._id) : x.hospitalId,
        }));
        const schedulesNorm: Schedule[] = s.map((x: any) => ({
          ...x,
          id: x.id || x._id,
          doctorId: typeof x.doctorId === 'object' ? (x.doctorId.id || x.doctorId._id) : x.doctorId,
        }));
        setHospitals(hospitalsNorm);
        setDoctors(doctorsNorm);
        setSchedules(schedulesNorm);
      } catch (err) {
        // Silently ignore to avoid crashing public pages; they can render empty states
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        load();
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lastAdminUpdate') {
        load();
      }
    };
    load();
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospitals.find(h => h.id === doctor.hospitalId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHospital = selectedHospital === '' || doctor.hospitalId === selectedHospital;
    const matchesDepartment = selectedDepartment === '' || doctor.department === selectedDepartment;
    
    return matchesSearch && matchesHospital && matchesDepartment;
  });

  const getDoctorsByHospital = (hospitalId: string) => {
    return doctors.filter(doctor => doctor.hospitalId === hospitalId);
  };

  const getSchedulesByDoctor = (doctorId: string) => {
    return schedules.filter(schedule => schedule.doctorId === doctorId);
  };

  return (
    <HospitalContext.Provider value={{
      hospitals,
      doctors,
      schedules,
      searchQuery,
      selectedHospital,
      selectedDepartment,
      setSearchQuery,
      setSelectedHospital,
      setSelectedDepartment,
      filteredDoctors,
      getDoctorsByHospital,
      getSchedulesByDoctor,
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};