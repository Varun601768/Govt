import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Clock, Search, Phone, MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../components/SearchBar';
import { LocationService, Location } from '../utils/locationService';
import { useHospital } from '../context/HospitalContext';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hospitals } = useHospital();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleFindNearestHospital = async () => {
    setIsLoadingLocation(true);
    setLocationError('');
    setSuccessMessage('');

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please use a modern browser.');
      setIsLoadingLocation(false);
      return;
    }

    try {
      console.log('Getting location...');
      const location = await LocationService.getCurrentLocation();
      console.log('Location obtained:', location);
      
      // Generate enhanced Google Maps URL with exact hospital locations
      const googleMapsUrl = LocationService.generateGoogleMapsWithMarkers(location, hospitals);
      console.log('Opening Google Maps with exact hospital locations:', googleMapsUrl);
      
      // Open Google Maps in a new tab
      const newWindow = window.open(googleMapsUrl, '_blank');
      
      if (newWindow) {
        // Show success message
        setSuccessMessage('Google Maps opened with exact government hospital locations!');
        setLocationError('');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        // If popup was blocked, try direct navigation
        window.location.href = googleMapsUrl;
      }
      
      // Also store location for potential fallback use
      sessionStorage.setItem('userLocation', JSON.stringify(location));
      
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Handle different types of location errors
      if (error && typeof error === 'object' && 'code' in error) {
        const geoError = error as GeolocationPositionError;
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services in your browser settings and try again.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please try again later.');
            break;
          case geoError.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An error occurred while getting your location. Please try again.');
        }
      } else {
        setLocationError('Failed to get location. Please check your location settings.');
      }
      
      // Don't automatically redirect - let user try again or use manual option
      console.log('Location failed, not redirecting automatically');
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  const features = [
    {
      icon: Building2,
      title: t('home.features.hospitals'),
      description: t('home.description')
    },
    {
      icon: Users,
      title: t('home.features.doctors'),
      description: t('doctors.subtitle')
    },
    {
      icon: Clock,
      title: t('home.features.timings'),
      description: t('timings.subtitle')
    },
    {
      icon: Search,
      title: t('common.search'),
      description: t('home.description')
    }
  ];

  return (
    <div className="space-y-14 pb-12">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="uppercase tracking-wider text-blue-100 text-sm mb-3">Official Citizen Health Service</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
            
            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar />
            </div>
            
            {/* Location Success Message */}
            {successMessage && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                  <p>{successMessage}</p>
                </div>
              </div>
            )}
            
            {/* Location Error Message */}
            {locationError && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                  <p>{locationError}</p>
                  <div className="mt-3">
                    <Link
                      to="/hospitals"
                      className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-900 font-medium text-sm"
                    >
                      <Building2 className="h-4 w-4" />
                      Browse All Hospitals Instead
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleFindNearestHospital}
                disabled={isLoadingLocation}
                className="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <MapPin className="h-5 w-5 mr-2" />
                )}
                {isLoadingLocation ? 'Getting Location...' : t('home.features.hospitals')}
              </button>
              <Link
                to="/doctors"
                className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-900 transition-colors inline-flex items-center justify-center"
              >
                <Users className="h-5 w-5 mr-2" />
                {t('home.features.doctors')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t('home.subtitle')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t('home.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center bg-white border border-slate-200 p-6 shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Section */}
      <section className="bg-orange-50 border-l-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">{t('hospitalDetail.emergencyServices')}</h2>
              <p className="text-orange-800">24/7 emergency services available at all government hospitals</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-6 w-6 text-orange-700" />
                <span className="text-2xl font-bold text-orange-900">108</span>
              </div>
              <button
                onClick={handleFindNearestHospital}
                disabled={isLoadingLocation}
                className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {t('home.features.hospitals')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 shadow-md p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">{t('common.search')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={handleFindNearestHospital}
              disabled={isLoadingLocation}
              className="bg-blue-900 text-white p-6 rounded-md hover:bg-blue-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <Building2 className="h-8 w-8 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{t('navigation.hospitals')}</h3>
              <p className="text-blue-100">{t('home.features.hospitals')}</p>
              {isLoadingLocation && (
                <div className="mt-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Getting location...</span>
                </div>
              )}
            </button>
            
            <Link
              to="/doctors"
              className="bg-blue-800 text-white p-6 rounded-md hover:bg-blue-900 transition-colors"
            >
              <Users className="h-8 w-8 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{t('navigation.doctors')}</h3>
              <p className="text-blue-100">{t('home.features.doctors')}</p>
            </Link>
            
            <Link
              to="/timings"
              className="bg-orange-600 text-white p-6 rounded-md hover:bg-orange-700 transition-colors"
            >
              <Clock className="h-8 w-8 mb-3" />
              <h3 className="text-xl font-semibold mb-2">{t('navigation.timings')}</h3>
              <p className="text-orange-100">{t('home.features.timings')}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};