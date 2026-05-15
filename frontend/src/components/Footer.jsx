import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* College Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold leading-tight">Merit Haji Ismail Sahib</h3>
                <p className="text-xs text-gray-400">Arts & Science College</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Providing quality education and value-based contribution to higher education since 1954.
            </p>
            <p className="text-accent text-xs font-semibold italic font-heading">
              "Enter To Learn, Leave To Serve"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-accent text-xs font-bold uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Courses', path: '/courses' },
                { name: 'Student Login', path: '/login' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 text-sm hover:text-accent transition-colors flex items-center gap-2 group">
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-accent text-xs font-bold uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Pernambut, Vellore District,<br />Tamil Nadu – 635810
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-accent shrink-0" />
                <span className="text-gray-400 text-sm">+91 04172 265 266</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-accent shrink-0" />
                <span className="text-gray-400 text-sm">info@mhiscollege.edu.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={14} className="text-accent shrink-0" />
                <span className="text-gray-400 text-sm">Mon–Sat: 8:30 AM – 4:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Affiliations */}
          <div>
            <h4 className="text-accent text-xs font-bold uppercase tracking-widest mb-5">Affiliations</h4>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-white mb-1">Affiliated to</p>
                <p className="text-sm text-accent font-heading font-semibold">Thiruvalluvar University</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-white mb-1">Recognized by</p>
                <p className="text-sm text-accent font-heading font-semibold">UGC | NAAC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Merit Haji Ismail Sahib Arts & Science College. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Designed with ♥ for academic excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
