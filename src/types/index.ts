export interface Driver {
  id: string;
  name: string;
  phone: string;
  ambulanceNumber: string;
  hospitalId: string;
  timings: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}
export interface Hospital {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  address: string;
  emergency: string;
  departments: string[];
  image: string;
  taluk: 'Mangaluru Taluk' | 'Bantwal Taluk' | 'Puttur Taluk' | 'Sullia Taluk' | 'Belthangady Taluk' | 'Kadaba Taluk' | 'Mulki Taluk';
  mapUrl?: string;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience: number;
  hospitalId: string;
  phone: string;
  email: string;
  specialization: string[];
  opdDays: string[];
  image: string;
}

export interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  type: 'OPD' | 'Emergency' | 'Surgery';
  isAvailable: boolean;
}

export interface TimeSlot {
  time: string;
  doctor: Doctor;
  type: 'OPD' | 'Emergency' | 'Surgery';
  isAvailable: boolean;
}

export interface Feedback {
  id: string;
  name: string;
  subject: string;
  message: string;
  createdAt: string;
}