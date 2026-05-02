import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Award, Building2, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHospital } from '../context/HospitalContext';

export const DoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { 
    filteredDoctors, 
    hospitals, 
    selectedHospital, 
    selectedDepartment,
    setSelectedHospital, 
    setSelectedDepartment,
    getSchedulesByDoctor 
  } = useHospital();

  useEffect(() => {
    const hospitalParam = searchParams.get('hospital');
    if (hospitalParam) {
      setSelectedHospital(hospitalParam);
    }
  }, [searchParams, setSelectedHospital]);

  const departments = Array.from(new Set(filteredDoctors.map(doctor => doctor.department)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('doctors.title')}</h1>
        <p className="text-xl text-gray-600">
          {t('doctors.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
              {t('doctors.filterByHospital')}
            </label>
            <select
              id="hospital"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t('doctors.allHospitals')}</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              {t('doctors.filterByDepartment')}
            </label>
            <select
              id="department"
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
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => {
          const hospital = hospitals.find(h => h.id === doctor.hospitalId);
          const schedules = getSchedulesByDoctor(doctor.id);
          
          return (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
           

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold">{doctor.department}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{hospital?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{doctor.experience} {t('doctors.experience')}</span>
                  </div>
                </div>

              

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('doctors.opdDays')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                      // Highlight if schedule exists for this doctor on this day
                      const hasSchedule = schedules.some(sch => sch.dayOfWeek === day && sch.doctorId === doctor.id);
                      return (
                        <span
                          key={day}
                          className={`text-xs px-2 py-1 rounded ${
                            hasSchedule
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('common.search')} {t('doctors.title')}</h3>
          <p className="text-gray-600">{t('common.filter')} {t('common.search')}</p>
        </div>
      )}
    </div>
  );
};