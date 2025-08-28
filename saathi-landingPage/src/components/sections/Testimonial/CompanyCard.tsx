import Image from 'next/image';
import React from 'react';

interface CompanyItem {
  id: string;
  companyURL: string;
}

interface CompanyCardProps {
  company: CompanyItem;
  isDuplicate?: boolean;
}

const CompanyCard = ({
  company,
  isDuplicate = false,
}: CompanyCardProps) => (
  <div
    key={`${isDuplicate ? "duplicate" : "original"}-${company.id}`}
    className="relative flex-shrink-0 mx-2 transition-all duration-300"
  >
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
      <Image
        src={company.companyURL}
        alt="Company Logo"
        width={162}
        height={72}
        className="object-contain max-w-full max-h-full filter brightness-110"
        style={{
          objectFit: 'contain'
        }}
      />
    </div>
  </div>
);

export default CompanyCard;