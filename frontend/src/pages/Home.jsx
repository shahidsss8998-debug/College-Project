import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SectionTitle from '../components/SectionTitle';
import AnnouncementCard from '../components/AnnouncementCard';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import {
  GraduationCap, Users, Award, BookOpen, ArrowRight,
  Megaphone, ChevronRight, Building, TrendingUp, Star
} from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  const previewAnnouncements = [
    { title: "Graduation Day", date: "Dec 2026", content: "Celebrating the achievements of our graduating batch. Stay tuned for registration details." },
    { title: "Semester Examinations", date: "Coming Soon", content: "The official schedule for the upcoming semester examinations will be posted shortly." },
    { title: "Sports Events 2026", date: "Ongoing", content: "Our annual sports meet is in progress. Check the schedule for inter-departmental matches." }
  ];

  const previewCourses = [
    { title: "B.Sc Computer Science", desc: "Foundational science and advanced computing techniques for the digital era.", duration: "3 Years" },
    { title: "BCA", desc: "Comprehensive study of computer applications and modern software development.", duration: "3 Years" },
    { title: "BBA", desc: "Shaping the business leaders of tomorrow.", duration: "3 Years" },
    { title: "B.Com", desc: "In-depth knowledge of commerce and financial management.", duration: "3 Years" }
  ];

  const stats = [
    { label: "Established", value: "1954", icon: Building },
    { label: "Students", value: "2500+", icon: Users },
    { label: "Faculty", value: "85+", icon: GraduationCap },
    { label: "Placement", value: "92%", icon: TrendingUp }
  ];

  const tickerItems = [
    "📢 Admissions Open for 2026-27",
    "🏆 Top Ranks in Thiruvalluvar University",
    "📅 Annual Sports Meet in progress",
    "🎓 92% placement for 2025 batch"
  ];

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[450px] sm:min-h-[600px] flex items-center justify-center">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="College Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/95"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
          <div className="max-w-4xl mx-auto text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] sm:text-xs font-bold mb-6 border border-white/20">
              <Star size={10} className="text-accent" />
              Affiliated to Thiruvalluvar University
            </div>
            <h1 className="font-heading text-xl min-[400px]:text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] mb-4 break-words">
              Merit Haji Ismail Sahib <br className="hidden sm:block" />
              <span className="text-accent italic">Arts & Science College</span>
            </h1>
            <p className="font-heading text-xs sm:text-lg lg:text-xl text-white/90 italic mb-6 border-l-0 sm:border-l-4 sm:border-accent sm:pl-4">
              "Enter To Learn, Leave To Serve"
            </p>
            <p className="text-[11px] sm:text-base text-gray-200 mb-8 max-w-2xl mx-auto sm:mx-0 leading-relaxed font-medium">
              Providing quality education since 1954 in Pernambut, Tamil Nadu.
              We nurture future leaders through academic excellence and values.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
              <Link to="/courses" className="bg-accent hover:bg-accent-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-black text-xs sm:text-sm transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2">
                Explore Programs <ArrowRight size={16} />
              </Link>
              {!user ? (
                <Link to="/login" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2">
                  Student Portal <ChevronRight size={16} />
                </Link>
              ) : (
                <Link to={user.role === 'admin' ? '/admin' : '/student'} className="bg-white text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-black text-xs sm:text-sm transition-all shadow-xl hover:bg-gray-100 flex items-center justify-center gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS TICKER */}
      <div className="bg-secondary text-white border-y border-white/5 relative overflow-hidden">
        <div className="flex items-center w-full">
          <div className="bg-accent px-3 py-2.5 sm:px-6 sm:py-4 shrink-0 flex items-center gap-2 z-10 shadow-xl relative">
            <Megaphone size={14} className="text-white" />
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">Latest</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-9 sm:h-14">
            <div className="ticker-animate flex items-center absolute whitespace-nowrap h-full">
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="mx-6 sm:mx-12 text-[10px] sm:text-sm font-medium text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <section className="py-14 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-accent text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <SectionTitle title="Welcome to Our College" subtitle="About Us" />
              <p className="text-gray-600 leading-relaxed mb-6">
                Merit Haji Ismail Sahib Arts and Science College has been a beacon of academic
                excellence since 1954. Affiliated to Thiruvalluvar University and recognized by
                UGC, we are committed to nurturing future leaders.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/about" className="btn-primary text-sm flex items-center gap-2">
                  Learn More <ArrowRight size={14} />
                </Link>
                <Link to="/courses" className="btn-outline text-sm">View Programs</Link>
              </div>
            </div>
            <div className="bg-cream rounded-2xl p-8 border border-gray-100 relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  From the Principal
                </span>
              </div>
              <div className="flex items-start gap-5 mt-4">
                <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Principal" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed italic font-heading mb-3">
                    "At MHIS College, we strive to empower every student with knowledge and values."
                  </p>
                  <p className="text-secondary font-bold text-sm">Dr. M. Mohammed Ismail</p>
                  <p className="text-accent text-xs font-semibold">Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-16 bg-bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <SectionTitle title="Academic Programs" subtitle="What We Offer" />
            <Link to="/courses" className="text-primary hover:text-accent font-semibold text-sm flex items-center gap-1 transition-colors shrink-0">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewCourses.map((c, i) => (
              <CourseCard key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Why Choose Us" subtitle="Our Strengths" center />
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { icon: Award, title: "Academic Excellence", desc: "Consistently high results with top university ranks year after year." },
              { icon: Users, title: "Expert Faculty", desc: "85+ qualified professors providing personalized attention." },
              { icon: BookOpen, title: "Modern Facilities", desc: "Well-equipped labs, digital library, and smart classrooms." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center group hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                  <item.icon size={26} />
                </div>
                <h4 className="font-heading text-lg font-bold text-secondary mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="py-16 bg-bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Latest Announcements" subtitle="Stay Informed" />
          <div className="space-y-4 mt-8">
            {previewAnnouncements.map((ann, i) => (
              <AnnouncementCard key={i} announcement={ann} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="overlay-gradient rounded-2xl p-10 lg:p-14 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <p className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3">Admissions 2026-27</p>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold mb-4">Begin Your Academic Journey</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Applications are now open for all programs. Join 70+ years of excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses" className="bg-accent hover:bg-accent-dark text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all shadow-lg">
                  Apply Now
                </Link>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-lg font-semibold text-sm border border-white/20 transition-all">
                  Download Prospectus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
