import { useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  User as UserIcon, Mail, GraduationCap, BookOpen, MapPin, 
  Users, Shield, Calendar, Phone, Hash, Heart, Globe, Building2, 
  FileText, Briefcase, BadgeCheck, ChevronDown, ChevronUp
} from 'lucide-react';



const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('personal');

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (authUser?.id) {
        try {
          const [profileRes, statsRes] = await Promise.all([
            API.get(`/auth/profile/${authUser.id}`),
            API.get(`/attendance/summary/${authUser.id}`)
          ]);
          setProfile(profileRes.data);
          setPercentage(parseFloat(statsRes.data.summary?.percentage) || 0);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFullProfile();
  }, [authUser]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Loading Student Record...</p>
    </div>
  );

  const isShortage = percentage < 75;

  const toggleSection = (id) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const Field = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold ${value && value !== 'N/A' ? 'text-gray-800' : 'text-gray-300'}`}>
          {value || 'Not Provided'}
        </p>
      </div>
    </div>
  );

  const Section = ({ id, icon: Icon, title, children }) => {
    const isOpen = expandedSection === id;
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between px-7 py-5 hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Icon size={16} />
            </div>
            <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest">{title}</h3>
          </div>
          {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {isOpen && (
          <div className="px-7 pb-6 border-t border-gray-50">
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-1 pt-3">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* ── Profile Card ──────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top Accent */}
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-gray-100 shadow-lg ring-4 ring-gray-50 overflow-hidden">
                {profile?.profile?.personal?.photo ? (
                  <img src={profile.profile.personal.photo} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <UserIcon size={48} className="text-primary/30" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{profile?.name}</h1>
                <BadgeCheck size={20} className="text-primary shrink-0" />
              </div>
              <p className="text-xs font-black text-primary uppercase tracking-[0.25em] mt-1">
                {profile?.profile?.admission?.admissionNo || 'Pending Registration'}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/5 text-secondary text-[10px] font-black rounded-lg uppercase tracking-widest">
                  <GraduationCap size={12} />
                  {profile?.profile?.admission?.course || 'N/A'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">
                  <Calendar size={12} />
                  {profile?.profile?.admission?.semester || 'N/A'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  AY {profile?.profile?.admission?.academicYear || '2026'}
                </span>
              </div>
            </div>

            {/* Attendance Ring */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" 
                    stroke={isShortage ? '#ef4444' : '#10b981'} 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 2.64} 264`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${isShortage ? 'text-red-600' : 'text-emerald-600'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accordion Sections ────────────────────────────────────── */}
      <div className="space-y-3">

        {/* Personal Information */}
        <Section id="personal" icon={UserIcon} title="Personal Information">
          <Field icon={UserIcon} label="Full Name" value={profile?.name} />
          <Field icon={Mail} label="Email Address" value={profile?.email} />
          <Field icon={Calendar} label="Date of Birth" value={profile?.profile?.personal?.dob} />
          <Field icon={UserIcon} label="Gender" value={profile?.profile?.personal?.gender} />
          <Field icon={Globe} label="Nationality" value={profile?.profile?.personal?.nationality} />
          <Field icon={Heart} label="Blood Group" value={profile?.profile?.personal?.bloodGroup} />
          <Field icon={Phone} label="Student Contact" value={profile?.profile?.personal?.contactNumber} />
          <Field icon={Shield} label="Aadhaar" value={
            profile?.profile?.identification?.aadhaar 
              ? `XXXX-XXXX-${profile.profile.identification.aadhaar.slice(-4)}`
              : null
          } />
        </Section>

        {/* Parent / Guardian */}
        <Section id="parent" icon={Users} title="Parent / Guardian Details">
          <Field icon={UserIcon} label="Father's Name" value={profile?.profile?.parent?.fatherName} />
          <Field icon={UserIcon} label="Mother's Name" value={profile?.profile?.parent?.motherName} />
          <Field icon={Users} label="Guardian Name" value={profile?.profile?.parent?.guardianName} />
          <Field icon={Phone} label="Contact Number" value={profile?.profile?.parent?.contact} />
          <Field icon={Mail} label="Parent Email" value={profile?.profile?.parent?.email} />
          <Field icon={Briefcase} label="Occupation" value={profile?.profile?.parent?.occupation} />
          <div className="md:col-span-2">
            <Field icon={MapPin} label="Guardian Address" value={profile?.profile?.parent?.address} />
          </div>
        </Section>

        {/* Address */}
        <Section id="address" icon={MapPin} title="Address Information">
          <div className="md:col-span-2">
            <Field icon={MapPin} label="Permanent Address" value={profile?.profile?.address?.permanent} />
          </div>
          <div className="md:col-span-2">
            <Field icon={MapPin} label="Current Address" value={profile?.profile?.address?.current} />
          </div>
          <Field icon={Building2} label="City" value={profile?.profile?.address?.city} />
          <Field icon={MapPin} label="State" value={profile?.profile?.address?.state} />
          <Field icon={Hash} label="PIN Code" value={profile?.profile?.address?.zip} />
          <Field icon={Globe} label="Country" value={profile?.profile?.address?.country} />
        </Section>

        {/* Academic Background */}
        <Section id="academic" icon={BookOpen} title="Previous Academic Record">
          <Field icon={Building2} label="Previous School" value={profile?.profile?.academic?.previousSchool} />
          <Field icon={BookOpen} label="Last Class Attended" value={profile?.profile?.academic?.lastClass} />
          <Field icon={GraduationCap} label="Marks / Percentage" value={
            profile?.profile?.academic?.marks ? `${profile.profile.academic.marks}%` : null
          } />
          <Field icon={FileText} label="Board" value={profile?.profile?.academic?.board} />
          <Field icon={Globe} label="Medium of Instruction" value={profile?.profile?.academic?.medium} />
          <Field icon={FileText} label="TC Details" value={profile?.profile?.academic?.tcDetails} />
        </Section>

        {/* Admission */}
        <Section id="admission" icon={GraduationCap} title="Admission Details">
          <Field icon={Hash} label="Admission Number" value={profile?.profile?.admission?.admissionNo} />
          <Field icon={Calendar} label="Admission Date" value={profile?.profile?.admission?.admissionDate} />
          <Field icon={GraduationCap} label="Course" value={profile?.profile?.admission?.course} />
          <Field icon={BookOpen} label="Semester" value={profile?.profile?.admission?.semester} />
          <Field icon={Calendar} label="Academic Year" value={profile?.profile?.admission?.academicYear} />
          <Field icon={FileText} label="Category" value={profile?.profile?.admission?.category} />
        </Section>
      </div>

      {/* ── Disclaimer ────────────────────────────────────────────── */}
      <div className="bg-cream border border-accent/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
          <Shield size={16} />
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          <span className="font-black text-secondary uppercase tracking-wider text-[10px]">Official Record — </span>
          This profile is maintained by the institution's central database. Any discrepancies must be reported to the Registrar's office. Unauthorized modification of records is prohibited.
        </p>
      </div>
    </div>
  );
};

export default Profile;
