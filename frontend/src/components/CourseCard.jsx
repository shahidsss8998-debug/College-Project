import { Clock, ArrowRight } from 'lucide-react';

const CourseCard = ({ title, description, desc, duration, image }) => {
  const courseDesc = description || desc;

  // Department color mapping
  const getDeptColor = (courseTitle) => {
    if (courseTitle?.includes('Computer Science') || courseTitle?.includes('B.Sc')) return 'bg-blue-600';
    if (courseTitle?.includes('BCA')) return 'bg-emerald-600';
    if (courseTitle?.includes('BBA')) return 'bg-purple-600';
    if (courseTitle?.includes('B.Com')) return 'bg-amber-600';
    return 'bg-primary';
  };

  return (
    <div className="card-hover overflow-hidden group flex flex-col h-full">
      {/* Department Color Stripe */}
      <div className={`h-1.5 ${getDeptColor(title)}`}></div>
      
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
          alt={title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
            <Clock size={11} />
            {duration}
          </span>
        </div>
        
        <h3 className="font-heading text-xl font-bold text-secondary mb-3 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
          {courseDesc}
        </p>
        
        <button className="flex items-center gap-2 text-primary font-semibold text-sm pt-4 border-t border-gray-100 group-hover:text-accent transition-colors">
          View Details
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
