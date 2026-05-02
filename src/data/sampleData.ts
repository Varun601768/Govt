import { Hospital, Doctor, Schedule } from '../types';

export const sampleData = {
  hospitals: [
    {
      id: '1',
      name: 'Wenlock Hospital',
      location: 'Mangalore',
      phone: '+91-824-2422271',
      email: 'wenlock@gov.in',
      address: 'Hampankatta, Mangalore, Karnataka 575001',
      emergency: '108',
      departments: ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Gynecology'],
      image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      name: 'Government Hospital Puttur',
      location: 'Puttur',
      phone: '+91-8251-234567',
      email: 'puttur@gov.in',
      address: 'Hospital Road, Puttur, Dakshina Kannada, Karnataka 574201',
      emergency: '108',
      departments: ['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'Gynecology'],
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ] as Hospital[],

  doctors: [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      department: 'Cardiology',
      qualification: 'MBBS, MD (Cardiology)',
      experience: 15,
      hospitalId: '1',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@wenlock.gov.in',
      specialization: ['Heart Surgery', 'Interventional Cardiology'],
      opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      department: 'Neurology',
      qualification: 'MBBS, MD (Neurology)',
      experience: 12,
      hospitalId: '1',
      phone: '+91-9876543211',
      email: 'priya.sharma@wenlock.gov.in',
      specialization: ['Stroke Treatment', 'Epilepsy Management'],
      opdDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      image: 'https://images.pexels.com/photos/559827/pexels-photo-559827.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      name: 'Dr. Suresh Rao',
      department: 'Orthopedics',
      qualification: 'MBBS, MS (Orthopedics)',
      experience: 18,
      hospitalId: '1',
      phone: '+91-9876543212',
      email: 'suresh.rao@wenlock.gov.in',
      specialization: ['Joint Replacement', 'Sports Medicine'],
      opdDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
      image: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '4',
      name: 'Dr. Meera Bhat',
      department: 'General Medicine',
      qualification: 'MBBS, MD (Medicine)',
      experience: 10,
      hospitalId: '2',
      phone: '+91-9876543213',
      email: 'meera.bhat@puttur.gov.in',
      specialization: ['Diabetes Management', 'Hypertension'],
      opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '5',
      name: 'Dr. Arun Kamath',
      department: 'Surgery',
      qualification: 'MBBS, MS (Surgery)',
      experience: 20,
      hospitalId: '2',
      phone: '+91-9876543214',
      email: 'arun.kamath@puttur.gov.in',
      specialization: ['General Surgery', 'Laparoscopic Surgery'],
      opdDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
      image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '6',
      name: 'Dr. Lakshmi Nair',
      department: 'Pediatrics',
      qualification: 'MBBS, MD (Pediatrics)',
      experience: 8,
      hospitalId: '2',
      phone: '+91-9876543215',
      email: 'lakshmi.nair@puttur.gov.in',
      specialization: ['Child Healthcare', 'Immunization'],
      opdDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      image: 'https://images.pexels.com/photos/1027345/pexels-photo-1027345.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ] as Doctor[],

  schedules: [
    // Dr. Rajesh Kumar (Cardiology)
    { id: '1', doctorId: '1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00', type: 'OPD', isAvailable: true },
    { id: '2', doctorId: '1', dayOfWeek: 'Monday', startTime: '14:00', endTime: '17:00', type: 'OPD', isAvailable: true },
    { id: '3', doctorId: '1', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '12:00', type: 'OPD', isAvailable: true },
    { id: '4', doctorId: '1', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '12:00', type: 'Surgery', isAvailable: true },
    
    // Dr. Priya Sharma (Neurology)
    { id: '5', doctorId: '2', dayOfWeek: 'Monday', startTime: '10:00', endTime: '13:00', type: 'OPD', isAvailable: true },
    { id: '6', doctorId: '2', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '13:00', type: 'OPD', isAvailable: true },
    { id: '7', doctorId: '2', dayOfWeek: 'Friday', startTime: '09:00', endTime: '12:00', type: 'OPD', isAvailable: true },
    
    // Dr. Suresh Rao (Orthopedics)
    { id: '8', doctorId: '3', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '13:00', type: 'OPD', isAvailable: true },
    { id: '9', doctorId: '3', dayOfWeek: 'Thursday', startTime: '09:00', endTime: '13:00', type: 'OPD', isAvailable: true },
    { id: '10', doctorId: '3', dayOfWeek: 'Friday', startTime: '14:00', endTime: '18:00', type: 'Surgery', isAvailable: true },
    
    // Dr. Meera Bhat (General Medicine)
    { id: '11', doctorId: '4', dayOfWeek: 'Monday', startTime: '08:00', endTime: '14:00', type: 'OPD', isAvailable: true },
    { id: '12', doctorId: '4', dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '14:00', type: 'OPD', isAvailable: true },
    { id: '13', doctorId: '4', dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '14:00', type: 'OPD', isAvailable: true },
    
    // Dr. Arun Kamath (Surgery)
    { id: '14', doctorId: '5', dayOfWeek: 'Monday', startTime: '07:00', endTime: '12:00', type: 'Surgery', isAvailable: true },
    { id: '15', doctorId: '5', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '13:00', type: 'OPD', isAvailable: true },
    { id: '16', doctorId: '5', dayOfWeek: 'Thursday', startTime: '07:00', endTime: '12:00', type: 'Surgery', isAvailable: true },
    
    // Dr. Lakshmi Nair (Pediatrics)
    { id: '17', doctorId: '6', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '14:00', type: 'OPD', isAvailable: true },
    { id: '18', doctorId: '6', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '14:00', type: 'OPD', isAvailable: true },
    { id: '19', doctorId: '6', dayOfWeek: 'Friday', startTime: '10:00', endTime: '14:00', type: 'OPD', isAvailable: true },
  ] as Schedule[]
};