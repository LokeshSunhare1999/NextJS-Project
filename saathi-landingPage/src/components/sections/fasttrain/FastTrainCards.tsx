import React from "react";

interface CardProps {
  title: string;
  imageUrl: string;
}

const cards: CardProps[] = [
  {
    title: "Job Training like never before",
    imageUrl: "/fastTrain/training.jpg"
  },
  {
    title: "Web Series like Edutainment on Mobile",
    imageUrl: "/fastTrain/series.jpg"
  },
  {
    title: "Higher engagement. Easier Understanding. Faster completion.",
    imageUrl: "/fastTrain/engagement.jpg"
  },
  {
    title: "Get Assessed & Get Certified",
    imageUrl: "/fastTrain/certified.jpg"
  }
];

export default function FastTrainCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6  w-full h-full">
      {cards.map((card, index) => (
        <div 
          key={index}
          className="bg-gray-900/80 backdrop-blur-lg rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-30 md:h-60">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-700" />
            {/* Image would be added here when available */}
          </div>
          <div className="p-4">
            <h4 className="text-lg font-medium text-gray-200">{card.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
} 