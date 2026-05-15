import { ChevronRight, Calendar } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col xs:flex-row group hover:border-primary/30 hover:shadow-md transition-all duration-300">
      {/* Date Badge */}
      <div className="bg-primary text-white px-4 py-3 xs:py-4 flex flex-row xs:flex-col items-center justify-center min-w-[70px] shrink-0 gap-2 xs:gap-1">
        <Calendar size={14} className="text-white/70" />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">
          {announcement.date || 'New'}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 xs:p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-secondary mb-1 group-hover:text-primary transition-colors font-heading">
            {announcement.title}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 xs:line-clamp-1">
            {announcement.content}
          </p>
        </div>
        <button className="text-primary hidden sm:block opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
