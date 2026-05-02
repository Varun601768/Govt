import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Calendar, Filter, User, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHospital } from '../context/HospitalContext';

export const TimingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const { 
    hospitals, 
    doctors, 
    schedules, 
    selectedHospital, 
    selectedDepartment,
    setSelectedHospital, 
    setSelectedDepartment 
  } = useHospital();

  useEffect(() => {
    const hospitalParam = searchParams.get('hospital');
    if (hospitalParam) {
      setSelectedHospital(hospitalParam);
    }
  }, [searchParams, setSelectedHospital]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const filteredSchedules = schedules.filter(schedule => {
    const doctor = doctors.find(d => d.id === schedule.doctorId);
    if (!doctor) return false;

    const matchesHospital = selectedHospital === '' || doctor.hospitalId === selectedHospital;
    const matchesDepartment = selectedDepartment === '' || doctor.department === selectedDepartment;
    const matchesDay = schedule.dayOfWeek === selectedDay;

    return matchesHospital && matchesDepartment && matchesDay;
  });

  const getScheduleAtTime = (time: string) => {
    return filteredSchedules.filter(schedule => {
      const scheduleStart = schedule.startTime;
      const scheduleEnd = schedule.endTime;
      return time >= scheduleStart && time < scheduleEnd;
    });
  };

  const departments = Array.from(new Set(doctors.map(doctor => doctor.department)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('timings.title')}</h1>
        <p className="text-xl text-gray-600">
          {t('timings.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="hospital-filter" className="block text-sm font-medium text-gray-700 mb-2">
              {t('timings.filterByHospital')}
            </label>
            <select
              id="hospital-filter"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('timings.allHospitals')}</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">
              {t('doctors.filterByDepartment')}
            </label>
            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('doctors.allDepartments')}</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="day-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Day
            </label>
            <select
              id="day-filter"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          {t('common.search')} {t('timings.title')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            {t('timings.availableSlots')} {selectedDay}
          </h2>
        </div>

        <div className="p-6">
          {timeSlots.map((time) => {
            const schedulesAtTime = getScheduleAtTime(time);
            
            return (
              <div key={time} className="border-b border-gray-200 last:border-b-0 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-24 flex-shrink-0">
                    <span className="text-lg font-semibold text-gray-900">{time}</span>
                  </div>
                  
                  <div className="flex-1">
                    {schedulesAtTime.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {schedulesAtTime.map((schedule) => {
                          const doctor = doctors.find(d => d.id === schedule.doctorId);
                          const hospital = hospitals.find(h => h.id === doctor?.hospitalId);
                          
                          if (!doctor || !hospital) return null;
                          
                          return (
                            <div
                              key={schedule.id}
                              className={`p-4 rounded-lg border-2 ${
                                schedule.type === 'OPD'
                                  ? 'bg-green-50 border-green-200'
                                  : schedule.type === 'Surgery'
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-red-50 border-red-200'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  schedule.type === 'OPD'
                                    ? 'bg-green-100 text-green-700'
                                    : schedule.type === 'Surgery'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {schedule.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{doctor.department}</p>
                              <p className="text-sm text-gray-500 mb-2">{hospital.name}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>{schedule.startTime} - {schedule.endTime}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">{t('timings.available')} {t('doctors.title')}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};