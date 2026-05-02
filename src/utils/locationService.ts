export interface Location {
  latitude: number;
  longitude: number;
}

export interface HospitalWithDistance {
  hospital: any;
  distance: number;
}

export class LocationService {
  static getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          // Pass through the GeolocationPositionError for better error handling
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static findNearestHospitals(hospitals: any[], userLocation: Location): HospitalWithDistance[] {
    return hospitals
      .map(hospital => {
        // For demo purposes, we'll use approximate coordinates for hospitals
        // In a real app, hospitals should have latitude/longitude in their data
        const hospitalLocation = this.getHospitalCoordinates(hospital);
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hospitalLocation.latitude,
          hospitalLocation.longitude
        );
        
        return {
          hospital,
          distance
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  private static getHospitalCoordinates(hospital: any): Location {
    // Precise coordinates for major government hospitals in Karnataka
    const hospitalCoordinates: { [key: string]: Location } = {
      'Wenlock District Hospital': { latitude: 12.8714, longitude: 74.8420 },
      'Lady Goschen Hospital': { latitude: 12.8720, longitude: 74.8430 },
      'KMC Hospital': { latitude: 12.8700, longitude: 74.8400 },
      'District Hospital Puttur': { latitude: 12.7689, longitude: 75.2015 },
      'Government Hospital Bantwal': { latitude: 12.8967, longitude: 74.9891 },
      'District Hospital Sullia': { latitude: 12.5098, longitude: 75.3812 },
      'Government Hospital Belthangady': { latitude: 13.0267, longitude: 75.3298 },
      'PHC Kadaba': { latitude: 12.7612, longitude: 75.1987 },
      'Community Health Center Mulki': { latitude: 13.0789, longitude: 74.7912 }
    };

    return hospitalCoordinates[hospital.name] || { latitude: 12.8714, longitude: 74.8420 };
  }

  static generateGoogleMapsWithMarkers(userLocation: Location, hospitals: any[]): string {
    // Get nearest hospitals (up to 10)
    const nearestHospitals = this.findNearestHospitals(hospitals, userLocation).slice(0, 10);
    
    // Create markers for each hospital
    const markers = nearestHospitals.map((item, index) => {
      const coords = this.getHospitalCoordinates(item.hospital);
      return `label:${index + 1}|${item.hospital.name}|${coords.latitude},${coords.longitude}`;
    }).join('&');

    // Generate Google Maps URL with markers and user location
    const baseUrl = 'https://www.google.com/maps/dir/';
    const userCoords = `${userLocation.latitude},${userLocation.longitude}`;
    const destinations = nearestHospitals.map(item => {
      const coords = this.getHospitalCoordinates(item.hospital);
      return `${coords.latitude},${coords.longitude}`;
    }).join('/');

    return `${baseUrl}${userCoords}/${destinations}`;
  }

  static generateGoogleMapsSearchUrl(userLocation: Location): string {
    return `https://www.google.com/maps/search/?api=1&query=government+hospitals+near+${userLocation.latitude},${userLocation.longitude}`;
  }

  static generateGoogleMapsUrl(userLocation: Location, hospitalLocation: Location): string {
    return `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${hospitalLocation.latitude},${hospitalLocation.longitude}`;
  }

  static generateGoogleMapsEmbedUrl(location: Location): string {
    return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${location.latitude},${location.longitude}&zoom=15&maptype=roadmap`;
  }
}
