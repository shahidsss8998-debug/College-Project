import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, BookOpen } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Award size={14} />
              Ranked #1 for Innovation
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-primary leading-[1.1] mb-8">
              Shape Your <span className="text-secondary">Future</span> at Excelsior.
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
              Experience world-class education with expert faculty, modern facilities, and a vibrant campus life designed to unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/courses" 
                className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-secondary transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
              >
                Explore Courses
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/about" 
                className="bg-gray-100 text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary">15k+</span>
                <span className="text-sm text-gray-500 font-bold uppercase">Students</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary">200+</span>
                <span className="text-sm text-gray-500 font-bold uppercase">Faculty</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-primary">95%</span>
                <span className="text-sm text-gray-500 font-bold uppercase">Placement</span>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-secondary rounded-[3rem] rotate-3 transition-transform group-hover:rotate-6 duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1523050338692-7b84540d13bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Campus Life" 
              className="relative rounded-[3rem] shadow-2xl transition-transform group-hover:-translate-y-2 duration-500 object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
