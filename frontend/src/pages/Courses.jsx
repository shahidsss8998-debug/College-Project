import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import { ChevronRight, GraduationCap, Clock, BookOpen, Users } from 'lucide-react';

const Courses = () => {
  const allCourses = [
    { title: "B.Sc Computer Science", desc: "A comprehensive program exploring scientific research, programming, and analytical thinking.", duration: "3 Years" },
    { title: "BCA", desc: "Master the technical skills required for a successful career in IT and software development.", duration: "3 Years" },
    { title: "B.Com", desc: "Excellence in business, trade, accounting, and financial management.", duration: "3 Years" },
    { title: "BBA", desc: "Developing the next generation of management leaders and entrepreneurs.", duration: "3 Years" }
  ];

  const highlights = [
    { icon: GraduationCap, value: "4", label: "UG Programs" },
    { icon: Clock, value: "3 Years", label: "Duration" },
    { icon: BookOpen, value: "Semester", label: "Pattern" },
    { icon: Users, value: "1:30", label: "Faculty Ratio" },
  ];

  return (
    <div>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" alt="Classroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 overlay-gradient"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-accent font-semibold">Courses</span>
          </nav>
          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Academic Programs</h1>
          <p className="text-white/70 text-base max-w-2xl mx-auto">Discover our undergraduate programs designed to prepare you for a successful career.</p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <h.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-secondary truncate">{h.value}</p>
                  <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{h.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 sm:py-20 bg-bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Programs" subtitle="Choose Your Path" center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 sm:mt-12">
            {allCourses.map((course, index) => (<CourseCard key={index} {...course} />))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <SectionTitle title="Admission Details" subtitle="Eligibility" />
              <div className="space-y-3 sm:space-y-4 mt-6">
                {[
                  { program: "B.Sc CS", eligibility: "10+2 with Mathematics" },
                  { program: "BCA", eligibility: "10+2 with Maths / CS" },
                  { program: "BBA", eligibility: "10+2 any stream" },
                  { program: "B.Com", eligibility: "10+2 Commerce preferred" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-cream rounded-xl border border-gray-100 hover:border-accent/30 transition-all gap-4">
                    <div className="min-w-0">
                      <p className="font-black text-secondary text-xs sm:text-sm truncate">{item.program}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">{item.eligibility}</p>
                    </div>
                    <span className="text-[9px] sm:text-xs font-black text-accent bg-accent/10 px-3 py-1.5 rounded-full shrink-0 uppercase tracking-widest">Office</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden mt-10 lg:mt-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-4">Important Dates</p>
                <h3 className="font-heading text-xl sm:text-2xl font-black mb-6 tracking-tight">Admission Timeline</h3>
                <div className="space-y-4 sm:space-y-5">
                  {[
                    { phase: "Application Opens", date: "March 2026" },
                    { phase: "Merit List Published", date: "May 2026" },
                    { phase: "Counseling Begins", date: "June 2026" },
                    { phase: "Classes Commence", date: "July 2026" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full shrink-0"></div>
                      <div className="flex-1 flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3">
                        <span className="text-xs sm:text-sm font-bold text-gray-300">{t.phase}</span>
                        <span className="text-[10px] sm:text-xs font-black text-accent uppercase">{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-bg-page px-4">
        <div className="max-w-5xl mx-auto overlay-gradient rounded-2xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">Start Your Journey</p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Ready to Shape Your Future?</h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto">Admissions for 2026 are now open. Download our prospectus or contact us.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-bold text-sm transition-all shadow-lg">Apply Online</button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-sm border border-white/20 transition-all">Download Prospectus</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
