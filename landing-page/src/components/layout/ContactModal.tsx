import React from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-10 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#6C3CD2] mb-6">Contact Us</h2>
        {/* Contact Info */}
        <div className="text-gray-700 text-lg space-y-2 mb-4">
          <div>Saathi WorldApp Pvt. Ltd.</div>
          <div>503 Tower A, 5th Floor,</div>
          <div>Millennium Plaza, Sector-27,</div>
          <div>Gurugram, Haryana 122009.</div>
        </div>
        <div className="text-gray-700 text-lg space-y-1">
          <div>connect@saathi.in</div>
          <div>career@saathi.in</div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 