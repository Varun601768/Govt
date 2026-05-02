import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Filter, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHospital } from '../context/HospitalContext';
import { LocationService, Location, HospitalWithDistance } from '../utils/locationService';

export const HospitalsPage: React.FC = () => {
  const { hospitals, getDoctorsByHospital } = useHospital();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedTaluk, setSelectedTaluk] = useState<string>('');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestHospitals, setNearestHospitals] = useState<HospitalWithDistance[]>([]);
  const [showNearest, setShowNearest] = useState(false);

  const taluks = [
    t('hospitals.taluks.mangaluru'),
    t('hospitals.taluks.bantwal'),
    t('hospitals.taluks.puttur'),
    t('hospitals.taluks.sullia'),
    t('hospitals.taluks.belthangady'),
    t('hospitals.taluks.kadaba'),
    t('hospitals.taluks.mulki')
  ];

  useEffect(() => {
    const isNearest = searchParams.get('nearest') === 'true';
    if (isNearest) {
      const savedLocation = sessionStorage.getItem('userLocation');
      if (savedLocation) {
        const location = JSON.parse(savedLocation) as Location;
        setUserLocation(location);
        const nearest = LocationService.findNearestHospitals(hospitals, location);
        setNearestHospitals(nearest);
        setShowNearest(true);
      }
    }
  }, [searchParams, hospitals]);

  const filteredHospitals = showNearest && nearestHospitals.length > 0
    ? nearestHospitals.map(item => item.hospital)
    : selectedTaluk
    ? hospitals.filter(hospital => hospital.taluk === selectedTaluk)
    : hospitals;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {showNearest ? 'Nearest Hospitals' : t('hospitals.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {showNearest ? 'Hospitals near your current location' : t('hospitals.subtitle')}
        </p>
      </div>

      {/* Map Section for Nearest Hospitals */}
      {showNearest && userLocation && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hospital Locations</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4000000!2d${userLocation.longitude}!3d${userLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2s${userLocation.latitude},${userLocation.longitude}!5e0!3m2!1sen!2sus!4v1776348583751!5m2!1sen!2sus`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[400px]"
                title="Google Maps showing nearest hospitals"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing hospitals within 50km of your location
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=hospitals+near+${userLocation.latitude},${userLocation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('hospitals.listTitle')}</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">{t('hospitals.allTaluks')}</option>
                {taluks.map((taluk) => (
                  <option key={taluk} value={taluk}>
                    {taluk}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {filteredHospitals.map((hospital) => {
              const doctorCount = getDoctorsByHospital(hospital.id).length;
              const nearestHospital = showNearest ? nearestHospitals.find(item => item.hospital.id === hospital.id) : null;
              
              return (
                <Link
                  key={hospital.id}
                  to={`/hospital/${hospital.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {hospital.name}
                        </h3>
                        {showNearest && nearestHospital && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Navigation className="h-3 w-3" />
                            {nearestHospital.distance.toFixed(1)} km
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{hospital.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{hospital.phone}</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {hospital.taluk}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{doctorCount} {t('hospitals.doctorsAvailable')}</div>
                      <div>{hospital.departments.length} {t('hospitals.departmentsCount')}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};