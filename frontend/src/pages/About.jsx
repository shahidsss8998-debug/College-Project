import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SectionTitle from '../components/SectionTitle';
import Footer from '../components/Footer';
import { Target, Eye, Award, ShieldCheck, Heart, UserCheck, Briefcase, GraduationCap, ChevronRight, BookOpen, Star } from 'lucide-react';

const About = () => {
  const { user } = useContext(AuthContext);

  const values = [
    { icon: Award, title: "Academic Excellence", desc: "We strive for the highest standards in teaching and research across all departments." },
    { icon: ShieldCheck, title: "Integrity & Ethics", desc: "Honesty and transparency form the core foundation of our institutional operations." },
    { icon: Heart, title: "Student Wellbeing", desc: "Our students' success, safety, and holistic development are our top priorities." }
  ];

  const facultyHighlights = [
    { name: "Academic Faculty", count: "85+", icon: UserCheck },
    { name: "Ph.D Scholars", count: "32", icon: GraduationCap },
    { name: "Industry Experts", count: "15", icon: Briefcase },
  ];

  const milestones = [
    { year: "1954", event: "College founded by visionary philanthropists" },
    { year: "1978", event: "Affiliated to Thiruvalluvar University" },
    { year: "1995", event: "Recognized by UGC under 2(f) and 12(B)" },
    { year: "2010", event: "NAAC Accreditation received" },
    { year: "2020", event: "Smart Campus & Digital Library launched" },
    { year: "2026", event: "70+ years of academic excellence" },
  ];

  return (
    <div>
      {/* Page Header with Breadcrumb */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
            alt="Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-gradient"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-accent font-semibold">About Us</span>
          </nav>
          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">About Our College</h1>
          <p className="text-white/70 text-lg font-heading italic max-w-2xl mx-auto">
            "Enter To Learn, Leave To Serve"
          </p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 sm:mb-24">
            <div className="text-center sm:text-left">
              <SectionTitle title="Our Legacy" subtitle="Established 1954" />
              <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                Merit Haji Ismail Sahib Arts and Science College is committed to providing quality education and value-based contributions to higher education for all sections of society. Our institution serves as a catalyst for student growth, identifying talents and shaping future leaders.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8 text-xs sm:text-sm">
                Located in Pernambut, we focus on skill development and holistic growth, ensuring our students are equipped to face the challenges of the modern world while remaining responsible citizens.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <p className="font-heading text-xl sm:text-2xl font-black text-primary">70+</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Years</p>
                </div>
                <div className="bg-accent/5 border border-accent/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <p className="font-heading text-xl sm:text-2xl font-black text-accent-dark">2500+</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Alumni</p>
                </div>
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <p className="font-heading text-xl sm:text-2xl font-black text-secondary">4</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Programs</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <img src="https://images.unsplash.com/photo-1523050338692-7b84540d13bd?auto=format&fit=crop&w=400&q=80" alt="Students" className="rounded-2xl shadow-lg w-full h-40 sm:h-64 object-cover mt-4 sm:mt-8" />
              <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80" alt="Campus" className="rounded-2xl shadow-lg w-full h-40 sm:h-64 object-cover" />
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16 sm:mb-24">
            <SectionTitle title="Our Journey" subtitle="Milestones" center />
            <div className="max-w-3xl mx-auto mt-10 sm:mt-12 overflow-hidden px-1">
              <div className="relative">
                <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8 relative">
                    <div className="w-8 sm:w-16 shrink-0 flex items-center justify-center relative z-10">
                      <span className="bg-white border-2 border-accent text-accent px-1.5 py-0.5 rounded-full text-[9px] sm:text-xs font-black">
                        {m.year}
                      </span>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm flex-1 hover:border-accent/30 hover:shadow-md transition-all">
                      <p className="text-xs sm:text-sm text-gray-700 font-bold leading-tight sm:leading-normal">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Faculty (Logged In Only) */}
          {user && (
            <div className="mb-24 bg-secondary rounded-2xl text-white relative overflow-hidden p-6 sm:p-10 lg:p-14">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Our People</p>
                  <h3 className="font-heading text-3xl font-bold mb-6 leading-tight">
                    Faculty Leadership & <br/><span className="text-accent">Governance</span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Our faculty comprises distinguished educators and industry veterans dedicated to mentoring students. With a 1:30 faculty-to-student ratio, we ensure personalized attention and academic rigor across all departments.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {facultyHighlights.map((stat, i) => (
                      <div key={i} className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                        <stat.icon size={18} className="text-accent mb-2" />
                        <p className="text-xl font-bold">{stat.count}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{stat.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-5">Strategic Goals 2026</h4>
                  <ul className="space-y-4">
                    {["NBA Accreditation Phase II", "Smart Campus Digital Hub", "Inter-Departmental Research Grant", "Industry Partnership Program"].map((goal, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                        <Star size={10} className="text-accent shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-cream p-10 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-5">
                <div className="bg-primary p-3 rounded-xl text-white shrink-0">
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-secondary mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Provide quality education and value-based contribution to higher education for all sections of society, helping students build a brighter future through skill development and academic excellence.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-cream p-10 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-5">
                <div className="bg-secondary p-3 rounded-xl text-white shrink-0">
                  <Eye size={28} />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-secondary mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    To provide affordable quality education, develop skills, identify talents, and shape students into future leaders and responsible citizens of tomorrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Why Choose Us" subtitle="Our Core Values" center />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {values.map((v, i) => (
              <div key={i} className="card-hover p-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <v.icon size={28} />
                </div>
                <h4 className="font-heading text-xl font-bold text-secondary mb-3">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
