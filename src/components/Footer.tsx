import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-white border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Emergency Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Emergency Services</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-300" />
                <span>Emergency: 108</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-200" />
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-200" />
                <span>info@govhospitals.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-200" />
                <span>Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block hover:text-orange-300 transition-colors">Patient Rights</a>
              <a href="#" className="block hover:text-orange-300 transition-colors">Health Schemes</a>
              <Link to="/feedback" className="block hover:text-orange-300 transition-colors">
                Feedback
              </Link>
              <a href="#" className="block hover:text-orange-300 transition-colors">Grievances</a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; 2025 Government Healthcare Portal, Karnataka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};