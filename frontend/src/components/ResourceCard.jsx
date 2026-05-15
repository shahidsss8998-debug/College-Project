import { Download, FileText } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all border-b-4 border-b-transparent hover:border-b-primary">
      <div className="bg-gray-50 w-10 h-10 rounded flex items-center justify-center text-primary mb-4">
        <FileText size={20} />
      </div>
      
      <h4 className="text-md font-bold text-primary mb-1 uppercase tracking-tight">{resource.title}</h4>
      <p className="text-secondary text-xs font-semibold mb-4">{resource.subject} • {resource.department}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Semester {resource.semester}</span>
        <button className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:text-accent transition-colors">
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
