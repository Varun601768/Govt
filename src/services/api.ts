// Drivers API
export const driversAPI = {
  getAll: async (hospitalId?: string) => {
    const url = hospitalId ? `${API_BASE_URL}/drivers?hospitalId=${hospitalId}` : `${API_BASE_URL}/drivers`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
  },
  create: async (driverData: any) => {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(driverData),
    });
    return handleResponse(response);
  },
  update: async (id: string, driverData: any) => {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(driverData),
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
const getApiBaseUrl = () => {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv;
  const { protocol, hostname } = window.location;
  const host = hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
  return `${protocol}//${host}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },
};

// Hospitals API
export const hospitalsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (hospitalData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(hospitalData),
    });
    return handleResponse(response);
  },

  update: async (id: string, hospitalData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(hospitalData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Doctors API
export const doctorsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (doctorData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(response);
  },

  update: async (id: string, doctorData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Schedules API
export const schedulesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/schedules`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (scheduleData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/schedules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });
    return handleResponse(response);
  },

  update: async (id: string, scheduleData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/schedules/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/schedules/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Public API (for non-admin users)
export const publicAPI = {
  getHospitals: async () => {
    const response = await fetch(`${API_BASE_URL}/hospitals`);
    return handleResponse(response);
  },

  getDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    return handleResponse(response);
  },

  getSchedules: async () => {
    const response = await fetch(`${API_BASE_URL}/schedules`);
    return handleResponse(response);
  },
};

// Feedback API (public create, admin get)
export const feedbackAPI = {
  create: async (feedbackData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    return handleResponse(response);
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/feedbacks`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
