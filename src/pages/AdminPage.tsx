import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Save, X, LogOut } from 'lucide-react';
import DoctorPhotoSelector from '../components/DoctorPhotoSelector';
import { authAPI, hospitalsAPI, doctorsAPI, schedulesAPI, feedbackAPI } from '../services/api';
import { Doctor, Hospital, Schedule, Feedback } from '../types';

export const AdminPage: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'account' | 'doctors' | 'schedules' | 'hospitals' | 'feedback'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorPhotoPreview, setDoctorPhotoPreview] = useState<string>('');
  const [doctorPhotoFile, setDoctorPhotoFile] = useState<File | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const totalFeedback = feedbacks.length;
  const dashboardStats = [
    { label: 'Doctor Statistics', value: doctors.length, note: 'Registered doctors in portal', color: 'bg-green-500' },
    { label: 'Hospital Statistics', value: hospitals.length, note: 'Hospitals available in network', color: 'bg-blue-500' },
    { label: 'Feedback Statistics', value: totalFeedback, note: 'Citizen feedback submissions', color: 'bg-orange-500' },
  ];
  const maxStatValue = Math.max(...dashboardStats.map((item) => item.value), 1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(username, password);
      localStorage.setItem('adminToken', response.token);
      setIsAuthenticated(true);
      await loadData();
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setHospitals([]);
    setDoctors([]);
    setSchedules([]);
  };

  const loadData = async () => {
    try {
      const [hospitalsData, doctorsData, schedulesData, feedbacksData] = await Promise.all([
        hospitalsAPI.getAll(),
        doctorsAPI.getAll(),
        schedulesAPI.getAll(),
        feedbackAPI.getAll(),
      ]);
      // Normalize ids to strings
      const hospitalsNorm = hospitalsData.map((h: any) => ({ ...h, id: h.id || h._id }));
      const doctorsNorm = doctorsData.map((d: any) => ({
        ...d,
        id: d.id || d._id,
        hospitalId: typeof d.hospitalId === 'object' ? (d.hospitalId.id || d.hospitalId._id) : d.hospitalId,
      }));
      const schedulesNorm = schedulesData.map((s: any) => ({
        ...s,
        id: s.id || s._id,
        doctorId: typeof s.doctorId === 'object' ? (s.doctorId.id || s.doctorId._id) : s.doctorId,
      }));
      setHospitals(hospitalsNorm);
      setDoctors(doctorsNorm);
      setSchedules(schedulesNorm);
      const feedbacksNorm = (feedbacksData || []).map((f: any) => ({
        ...f,
        id: f.id || f._id,
        createdAt: f.createdAt ? new Date(f.createdAt).toISOString() : new Date().toISOString(),
      }));
      setFeedbacks(feedbacksNorm);
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleEditDoctor = (doctor: Doctor) => {
  setEditingDoctor({ ...doctor });
  setIsAddingDoctor(false);
  setDoctorPhotoPreview(doctor.image || '');
  setDoctorPhotoFile(null);
  };

  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name: '',
      department: '',
      qualification: '',
      experience: 0,
      hospitalId: hospitals[0]?.id || '',
      phone: '',
      email: '',
      specialization: [],
      opdDays: [],
      image: ''
    };
    setEditingDoctor(newDoctor);
    setIsAddingDoctor(true);
    setDoctorPhotoPreview('');
    setDoctorPhotoFile(null);
  };

  const handleAddHospital = () => {
    const newHospital: Hospital = {
      id: Date.now().toString(),
      name: '',
      location: '',
      phone: '',
      email: '',
      address: '',
      emergency: '108',
      departments: [],
      image: '',
      taluk: 'Mangaluru Taluk',
      mapUrl: ''
    };
    setEditingHospital(newHospital);
    setIsAddingHospital(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setEditingHospital({ ...hospital });
    setIsAddingHospital(false);
  };

  const handleDeleteHospital = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hospital? This will also delete all associated doctors and schedules.')) {
      try {
        await hospitalsAPI.delete(id);
        await loadData();
      } catch (error: any) {
        setError(error.message || 'Failed to delete hospital');
      }
    }
  };

  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    
    try {
      if (isAddingHospital) {
        await hospitalsAPI.create(editingHospital);
      } else {
        await hospitalsAPI.update(editingHospital.id, editingHospital);
      }
      await loadData();
      setEditingHospital(null);
      try { localStorage.setItem('lastAdminUpdate', Date.now().toString()); } catch {}
    } catch (error: any) {
      setError(error.message || 'Failed to save hospital');
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    try {
      let imageUrl = editingDoctor.image;
      // If a new photo file is selected, upload it
      if (doctorPhotoFile) {
        // TODO: Implement actual upload to server, for now use base64 preview
        imageUrl = doctorPhotoPreview;
      }
      const payload: any = {
        ...editingDoctor,
        hospitalId: editingDoctor.hospitalId,
        image: imageUrl
      };
      if (isAddingDoctor) {
        await doctorsAPI.create(payload);
      } else {
        await doctorsAPI.update(editingDoctor.id, payload);
      }
      await loadData();
      setEditingDoctor(null);
      setDoctorPhotoPreview('');
      setDoctorPhotoFile(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save doctor');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor? This will also delete all associated schedules.')) {
      try {
        await doctorsAPI.delete(id);
        await loadData();
      } catch (error: any) {
        setError(error.message || 'Failed to delete doctor');
      }
    }
  };

  const handleAddSchedule = () => {
    const defaultDoctorId = doctors[0]?.id || '';
    const newSchedule: Schedule = {
      id: Date.now().toString(),
      doctorId: defaultDoctorId,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '12:00',
      type: 'OPD',
      isAvailable: true,
    };
    setEditingSchedule(newSchedule);
    setIsAddingSchedule(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule });
    setIsAddingSchedule(false);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await schedulesAPI.delete(id);
        await loadData();
      } catch (error: any) {
        setError(error.message || 'Failed to delete schedule');
      }
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchedule) return;

    try {
      if (isAddingSchedule) {
        await schedulesAPI.create({
          doctorId: editingSchedule.doctorId,
          dayOfWeek: editingSchedule.dayOfWeek,
          startTime: editingSchedule.startTime,
          endTime: editingSchedule.endTime,
          type: editingSchedule.type,
          isAvailable: editingSchedule.isAvailable,
        });
      } else {
        await schedulesAPI.update(editingSchedule.id, {
          doctorId: editingSchedule.doctorId,
          dayOfWeek: editingSchedule.dayOfWeek,
          startTime: editingSchedule.startTime,
          endTime: editingSchedule.endTime,
          type: editingSchedule.type,
          isAvailable: editingSchedule.isAvailable,
        });
      }
      await loadData();
      setEditingSchedule(null);
    } catch (error: any) {
      setError(error.message || 'Failed to save schedule');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600">Enter password to access admin panel</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-4">
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-12 relative">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <p className="text-xl text-gray-600">Manage hospitals, doctors, and schedules</p>

        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Left Sidebar + Content */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-200 p-4 h-fit">
          <nav className="space-y-2">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'account', label: 'Account' },
              { key: 'doctors', label: 'Doctor' },
              { key: 'schedules', label: 'Shecdule' },
              { key: 'hospitals', label: 'Hospital' },
              { key: 'feedback', label: 'Feedbback' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key as any)}
                className={`w-full text-left px-4 py-2.5 rounded-md font-medium transition-colors ${
                  activeSection === item.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-9 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-blue-800">Total Hospitals</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{hospitals.length}</p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-green-800">Total Doctors</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{doctors.length}</p>
                </div>
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-orange-800">Total Feedback</p>
                  <p className="text-3xl font-bold text-orange-700 mt-2">{totalFeedback}</p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statical Analysis</h3>
                  <div className="h-56 flex items-end justify-between gap-3 border-b border-l border-gray-300 px-3 pb-3">
                    {dashboardStats.map((item) => (
                      <div key={item.label} className="flex-1 flex flex-col items-center justify-end">
                        <span className="text-xs font-semibold text-gray-700 mb-2">{item.value}</span>
                        <div
                          className={`w-full max-w-[64px] rounded-t-md ${item.color}`}
                          style={{ height: `${Math.max((item.value / maxStatValue) * 180, 8)}px` }}
                        />
                        <span className="text-[11px] text-gray-600 mt-2 text-center">
                          {item.label.replace(' Statistics', '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Infromation</h3>
                  <svg viewBox="0 0 360 220" className="w-full h-56 border border-gray-200 rounded-md bg-gray-50">
                    <line x1="35" y1="15" x2="35" y2="190" stroke="#9ca3af" strokeWidth="1.5" />
                    <line x1="35" y1="190" x2="340" y2="190" stroke="#9ca3af" strokeWidth="1.5" />
                    <polyline
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      points={dashboardStats
                        .map((item, index) => {
                          const x = 70 + index * 120;
                          const y = 190 - (item.value / maxStatValue) * 150;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                    {dashboardStats.map((item, index) => {
                      const x = 70 + index * 120;
                      const y = 190 - (item.value / maxStatValue) * 150;
                      return (
                        <g key={item.label}>
                          <circle cx={x} cy={y} r="6" fill="#1d4ed8" />
                          <text x={x} y={y - 12} textAnchor="middle" className="fill-gray-800 text-[11px] font-semibold">
                            {item.value}
                          </text>
                          <text x={x} y="208" textAnchor="middle" className="fill-gray-600 text-[10px]">
                            {item.label.replace(' Statistics', '')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {dashboardStats.map((item) => (
                  <div key={item.label} className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">{item.label}:</span> {item.note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 space-y-2">
                <p><span className="font-semibold">Username:</span> {username || 'admin'}</p>
                <p><span className="font-semibold">Role:</span> Administrator</p>
                <p><span className="font-semibold">Status:</span> Logged in</p>
              </div>
            </div>
          )}

          {activeSection === 'hospitals' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Hospitals</h2>
                <button
                  onClick={handleAddHospital}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                        <p className="text-sm text-blue-600">{hospital.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditHospital(hospital)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{hospital.address}</p>
                    <p className="text-sm text-gray-600">Phone: {hospital.phone}</p>
                    <p className="text-sm text-gray-600">Email: {hospital.email}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {hospital.departments.length} departments
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'doctors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Doctors</h2>
                <button
                  onClick={handleAddDoctor}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => {
                  const hospital = hospitals.find(h => h.id === doctor.hospitalId);
                  
                  return (
                    <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-blue-600">{doctor.department}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doctor.qualification}</p>
                      <p className="text-sm text-gray-600 mb-1">{hospital?.name}</p>
                      <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'schedules' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Schedules</h2>
                <button
                  onClick={handleAddSchedule}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedules.map((schedule) => {
                      const doctor = doctors.find(d => d.id === schedule.doctorId);
                      return (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.dayOfWeek}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.startTime} - {schedule.endTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">{schedule.type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.isAvailable ? 'Yes' : 'No'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button onClick={() => handleEditSchedule(schedule)} className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteSchedule(schedule.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'feedback' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Feedback</h2>
                <button
                  onClick={loadData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  Refresh
                </button>
              </div>

              {feedbacks.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-600">
                  No feedback submissions yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {feedbacks.map((f) => (
                        <tr key={f.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{f.subject}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                            <div className="truncate" title={f.message}>{f.message}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {f.createdAt ? new Date(f.createdAt).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isAddingDoctor ? 'Add New Doctor' : 'Edit Doctor'}
              </h3>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editingDoctor.department}
                    onChange={(e) => setEditingDoctor({...editingDoctor, department: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editingDoctor.qualification}
                    onChange={(e) => setEditingDoctor({...editingDoctor, qualification: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    value={editingDoctor.experience}
                    onChange={(e) => setEditingDoctor({...editingDoctor, experience: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingDoctor.phone}
                    onChange={(e) => setEditingDoctor({...editingDoctor, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    onChange={(e) => setEditingDoctor({...editingDoctor, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <DoctorPhotoSelector
                value={doctorPhotoPreview}
                onChange={(preview, file) => {
                  setDoctorPhotoPreview(preview);
                  setDoctorPhotoFile(file || null);
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                <select
                  value={editingDoctor.hospitalId}
                  onChange={(e) => setEditingDoctor({...editingDoctor, hospitalId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingDoctor ? 'Add Doctor' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hospital Modal */}
      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isAddingSchedule ? 'Add New Schedule' : 'Edit Schedule'}
              </h3>
              <button onClick={() => setEditingSchedule(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={editingSchedule.doctorId}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, doctorId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                  <select
                    value={editingSchedule.dayOfWeek}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, dayOfWeek: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={editingSchedule.type}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {['OPD','Emergency','Surgery'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editingSchedule.startTime}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editingSchedule.endTime}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isAvailable"
                  type="checkbox"
                  checked={editingSchedule.isAvailable}
                  onChange={(e) => setEditingSchedule({ ...editingSchedule, isAvailable: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="text-sm text-gray-700">Available</label>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setEditingSchedule(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingSchedule ? 'Add Schedule' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {isAddingHospital ? 'Add New Hospital' : 'Edit Hospital'}
              </h3>
              <button
                onClick={() => setEditingHospital(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveHospital} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingHospital.name}
                    onChange={(e) => setEditingHospital({...editingHospital, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingHospital.location}
                    onChange={(e) => setEditingHospital({...editingHospital, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
                  <select
                    value={editingHospital.taluk || ''}
                    onChange={(e) => setEditingHospital({...editingHospital, taluk: e.target.value as 'Mangaluru Taluk' | 'Bantwal Taluk' | 'Puttur Taluk' | 'Sullia Taluk' | 'Belthangady Taluk' | 'Kadaba Taluk' | 'Mulki Taluk'})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Taluk</option>
                    <option value="Mangaluru Taluk">Mangaluru Taluk</option>
                    <option value="Bantwal Taluk">Bantwal Taluk</option>
                    <option value="Puttur Taluk">Puttur Taluk</option>
                    <option value="Sullia Taluk">Sullia Taluk</option>
                    <option value="Belthangady Taluk">Belthangady Taluk</option>
                    <option value="Kadaba Taluk">Kadaba Taluk</option>
                    <option value="Mulki Taluk">Mulki Taluk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingHospital.email}
                    onChange={(e) => setEditingHospital({...editingHospital, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={editingHospital.address}
                  onChange={(e) => setEditingHospital({...editingHospital, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departments (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingHospital.departments || []).join(', ')}
                  onChange={(e) => {
                    const parts = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setEditingHospital({ ...editingHospital, departments: parts });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cardiology, Pediatrics, Orthopedics"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Number</label>
                <input
                  type="text"
                  value={editingHospital.emergency}
                  onChange={(e) => setEditingHospital({...editingHospital, emergency: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="108"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingHospital.image}
                  onChange={(e) => setEditingHospital({...editingHospital, image: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Map Embed URL (optional)</label>
                <input
                  type="text"
                  value={editingHospital.mapUrl || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, mapUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paste iframe src from Google Maps embed"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingHospital(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingHospital ? 'Add Hospital' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};