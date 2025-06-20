import dynamic from 'next/dynamic';
import { TRAIN_CARDS, VIDEO_DATA } from '@/constants/index';

const CardCarousel = dynamic(() => import('./CardCarousel'));
const VideoTickerComponent = dynamic(() => import('../video-ticker/VideoTickerComponent'));
const LargeCards = dynamic(() => import('./LargeCards'));

export default function FastTrainSection() {
  return (
    <section id="jobtrain" className="py-16 md:py-16 px-12 md:px-16 bg-[#09090b]">
      <div className="flex flex-col items-start justify-center gap-2 md:gap-5">
        <div className="flex flex-col items-center md:items-start justify-center w-full">
          <h2 className="text-4xl md:text-6xl font-bold text-white text-center md:text-left"><span>Job</span><span className='bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent'>Train</span></h2>
          <p className="text-gray-400 italic text-md md:text-[18px] py-1 text-center md:text-left">The Netflix of Skilling</p>
        </div>
        {/* <StepsSection /> */}
        <div className="flex flex-col items-center md:items-start justify-center w-full max-w-[100%] mx-auto  mb-10">
          <p className="text-gray-400 text-xl md:text-[40px] py-4 text-center md:text-left justify-center leading-tight max-w-full">
          A<span className="text-white"> web series with a unique storytelling approach,</span> seamlessly integrated with a curriculum that guides learning objectives to ensure effective learning, completion, and certification
          </p>
        </div>
        <div className="w-full pb-10 md:pb-20">
          <VideoTickerComponent videos={VIDEO_DATA} title="Top 5 Trending Training Courses" />
        </div>
        <div className="pt-2 md:pt-6 w-full overflow-hidden pb-8 md:pb-20">
          <CardCarousel title="Top 5 Trending Training Tests" cards={TRAIN_CARDS} />
        </div>
        <div className="w-full py-12">
          <LargeCards />
        </div>
      </div>
    </section>
  );
} 