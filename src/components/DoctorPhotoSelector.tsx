import React, { useRef } from 'react';

interface DoctorPhotoSelectorProps {
  value: string;
  onChange: (fileUrl: string, file?: File) => void;
}

const DoctorPhotoSelector: React.FC<DoctorPhotoSelectorProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result, file);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Photo</label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="mb-2"
      />
      {value && (
        <img src={value} alt="Doctor Preview" className="w-24 h-24 object-cover rounded-full border" />
      )}
    </div>
  );
};

export default DoctorPhotoSelector;
