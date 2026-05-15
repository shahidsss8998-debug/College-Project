import SectionTitle from './SectionTitle';
import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
  const points = [
    "World-class Research Facilities",
    "Internationally Recognized Faculty",
    "Diverse & Inclusive Campus Culture",
    "Strong Industry Partnerships"
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <SectionTitle 
              title="Excellence in Education Since 1954" 
              subtitle="Our Heritage" 
            />
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Excelsior University has been a beacon of higher learning for over half a century. We pride ourselves on creating an environment that fosters critical thinking, creativity, and personal growth.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {points.map((point, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <CheckCircle2 className="text-secondary shrink-0" />
                  <span className="font-bold text-primary text-sm">{point}</span>
                </div>
              ))}
            </div>
            <button className="bg-primary text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-xl shadow-blue-900/10">
              Learn Our History
            </button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Academic Building" 
              className="rounded-[3rem] shadow-2xl relative"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
