import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const HospitalDetailPage: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const { hospitals, getDoctorsByHospital } = useHospital();

  const hospital = hospitals.find(h => h.id === hospitalId);

  if (!hospital) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hospital Not Found</h1>
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hospitals
          </Link>
        </div>
      </div>
    );
  }

  const doctorCount = getDoctorsByHospital(hospital.id).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative h-80">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 mb-4 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hospitals
          </Link>
          <h1 className="text-4xl font-bold mb-2">{hospital.name}</h1>
          <p className="text-xl text-blue-200">{hospital.location}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hospital Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{hospital.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">{hospital.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">{hospital.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Doctors Available</h3>
                      <p className="text-gray-600">{doctorCount} doctors</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Departments</h3>
                      <p className="text-gray-600">{hospital.departments.length} departments</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Emergency Services</h3>
                      <p className="text-gray-600">{hospital.emergency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Departments</h2>
              <div className="flex flex-wrap gap-3">
                {hospital.departments.map((dept, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Directions</h2>
              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src={hospital.mapUrl || `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3887.0!2d74.8400!3d12.8700!2m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(hospital.location || hospital.address || hospital.name)}!5e0!3m2!1sen!2sin!4v1776348583751!5m2!1sen!2sin`}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[400px]"
                    title={`Google Maps location for ${hospital.name}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Find us easily using the interactive map above for accurate directions to our hospital.
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.location || hospital.address || hospital.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/doctors?hospital=${hospital.id}`}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Doctors
                </Link>
                <Link
                  to={`/timings?hospital=${hospital.id}`}
                  className="block w-full border-2 border-blue-600 text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Check Timings
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Emergency Information</h3>
              <p className="text-blue-700 mb-3">
                {hospital.emergency}
              </p>
              <div className="bg-blue-100 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">
                  For emergency services, please call: {hospital.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
