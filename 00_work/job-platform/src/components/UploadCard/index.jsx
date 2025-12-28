import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import ProgressBar from '@/components/ProgressBar';

const UploadCard = ({ fileName = 'File Name', setUploadData, classes, isUploadComplete }) => {
  return (
    <div className={`flex w-[360px] flex-col gap-4 bg-white py-5 ${classes}`}>
      <div className="flex w-full justify-between">
        <span className="text-sm font-semibold">{fileName}</span>
        <CloseOutlined onClick={() => setUploadData(null)} className="cursor-pointer" />
      </div>
      <ProgressBar isUploadComplete={isUploadComplete} />
    </div>
  );
};

export default UploadCard;
