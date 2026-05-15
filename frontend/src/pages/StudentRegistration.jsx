import { useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import { UserPlus, Save, ArrowLeft, Loader2, User, Home, Book, Shield, Users, Image as ImageIcon, Camera, Globe, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StudentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  const isEditMode = Boolean(id);

  const validationSchema = useMemo(() => Yup.object().shape({
    name: Yup.string()
      .required('Full Name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    profile: Yup.object().shape({
      personal: Yup.object().shape({
        dob: Yup.date()
          .required('Date of Birth is required')
          .max(new Date(), 'Date of Birth must be in the past'),
        gender: Yup.string().required('Gender is required'),
        nationality: Yup.string().required('Nationality is required'),
        contactNumber: Yup.string()
          .required('Student Contact Number is required')
          .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
      }),
      parent: Yup.object().shape({
        motherName: Yup.string().required("Mother's Name is required"),
        contact: Yup.string()
          .required('Contact Number is required')
          .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
        email: Yup.string().email('Invalid email format').required('Parent Email is required'),
      }),
      academic: Yup.object().shape({
        previousSchool: Yup.string().required('Previous School is required'),
        marks: Yup.number()
          .min(0, 'Marks cannot be less than 0')
          .max(100, 'Marks cannot be more than 100')
          .required('Marks are required'),
      }),
      identification: Yup.object().shape({
        aadhaar: Yup.string()
          .required('Aadhaar Number is required')
          .matches(/^\d{12}$/, 'Aadhaar Number must be exactly 12 digits'),
      }),
    }),
  }), [isEditMode]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      profile: {
        personal: { dob: '', gender: '', nationality: 'Indian', bloodGroup: '', contactNumber: '', photo: '' },
        parent: { fatherName: '', motherName: '', guardianName: '', contact: '', email: '', occupation: '', address: '' },
        address: { permanent: '', current: '', city: '', state: '', zip: '', country: 'India' },
        academic: { previousSchool: '', marks: '', tcDetails: '', medium: 'English' },
        admission: { course: 'BCA', semester: '1st Semester', academicYear: '2024-2027', category: 'General' },
        identification: { aadhaar: '' }
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setMessage('');
      
      const payload = { ...values };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      try {
        if (isEditMode) {
          await API.put(`/auth/students/${id}`, payload);
          setMessage('Success: Student record updated successfully!');
        } else {
          await API.post('/auth/students', payload);
          setMessage('Success: Student admission completed successfully. Login credentials sent via email.');
        }
        setTimeout(() => navigate('/admin/students'), 2000);
      } catch (error) {
        console.error('Registration Error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Action failed';
        setMessage(`Error: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        setFetching(true);
        try {
          const response = await API.get(`/auth/profile/${id}`);
          const student = response.data;
          
          const mappedValues = {
            name: student.name || '',
            email: student.email || '',
            profile: {
              personal: { ...formik.initialValues.profile.personal, ...(student.profile?.personal || {}) },
              parent: { ...formik.initialValues.profile.parent, ...(student.profile?.parent || {}) },
              address: { ...formik.initialValues.profile.address, ...(student.profile?.address || {}) },
              academic: { ...formik.initialValues.profile.academic, ...(student.profile?.academic || {}) },
              admission: { ...formik.initialValues.profile.admission, ...(student.profile?.admission || {}) },
              identification: { ...formik.initialValues.profile.identification, ...(student.profile?.identification || {}) }
            }
          };
          
          formik.setValues(mappedValues);
          if (student.profile?.personal?.photo) {
            setPhotoPreview(student.profile.personal.photo);
          }
        } catch (error) {
          console.error('Error fetching student:', error);
          setMessage('Error: Failed to load student data.');
        } finally {
          setFetching(false);
        }
      };
      fetchStudent();
    }
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        formik.setFieldValue('profile.personal.photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
      <Icon size={18} className="text-primary" />
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
    </div>
  );

  const ErrorMsg = ({ name }) => {
    const error = name.split('.').reduce((obj, key) => obj && obj[key], formik.errors);
    const touched = name.split('.').reduce((obj, key) => obj && obj[key], formik.touched);
    if (error && touched) {
      return <p className="text-[10px] text-red-500 mt-1 font-bold">{error}</p>;
    }
    return null;
  };

  const getInputClass = (name) => {
    const error = name.split('.').reduce((obj, key) => obj && obj[key], formik.errors);
    const touched = name.split('.').reduce((obj, key) => obj && obj[key], formik.touched);
    const baseClass = "w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none transition-all font-medium";
    if (error && touched) {
      return `${baseClass} border-red-300 ring-1 ring-red-100 bg-red-50 focus:ring-red-200`;
    }
    return `${baseClass} border-gray-200 focus:ring-1 ring-primary focus:border-primary`;
  };

  if (fetching) return <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Loading Student Data...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <button onClick={() => navigate('/admin/students')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-2 font-medium transition-colors">
            <ArrowLeft size={16} /> Back to List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Student Profile' : 'New Student Admission'}
          </h1>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-semibold border animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.includes('Success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Photo Upload Section */}
        <div className="card p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-primary ${photoPreview ? 'border-primary' : 'border-gray-200'}`}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera size={24} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Photo</p>
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg cursor-pointer shadow-lg hover:bg-accent transition-all">
              <ImageIcon size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900">Student Identity Photo</h3>
            <p className="text-xs text-gray-400 font-medium">Upload a professional passport size photograph for official records. Max size 2MB.</p>
          </div>
        </div>

        {/* 1. Account & Personal */}
        <div className="card p-5 sm:p-8">
          <SectionHeader icon={User} title="Account & Personal Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name *</label>
              <input 
                {...formik.getFieldProps('name')}
                className={getInputClass('name')} 
              />
              <ErrorMsg name="name" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address *</label>
              <input 
                type="email"
                {...formik.getFieldProps('email')}
                className={getInputClass('email')} 
              />
              <ErrorMsg name="email" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Contact Number *</label>
              <input 
                type="text"
                {...formik.getFieldProps('profile.personal.contactNumber')}
                className={getInputClass('profile.personal.contactNumber')} 
                placeholder="10 digit mobile number"
              />
              <ErrorMsg name="profile.personal.contactNumber" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth *</label>
              <input 
                type="date"
                {...formik.getFieldProps('profile.personal.dob')}
                className={getInputClass('profile.personal.dob')} 
              />
              <ErrorMsg name="profile.personal.dob" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender *</label>
              <select 
                {...formik.getFieldProps('profile.personal.gender')}
                className={getInputClass('profile.personal.gender')}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <ErrorMsg name="profile.personal.gender" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nationality *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  {...formik.getFieldProps('profile.personal.nationality')}
                  className={`${getInputClass('profile.personal.nationality')} pl-9`} 
                />
              </div>
              <ErrorMsg name="profile.personal.nationality" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
              <select 
                {...formik.getFieldProps('profile.personal.bloodGroup')}
                className={getInputClass('profile.personal.bloodGroup')}
              >
                <option value="">Select Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Parent Details */}
        <div className="card p-5 sm:p-8">
          <SectionHeader icon={Users} title="Parent / Guardian Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Father's Name</label>
              <input 
                {...formik.getFieldProps('profile.parent.fatherName')}
                className={getInputClass('profile.parent.fatherName')} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mother's Name *</label>
              <input 
                {...formik.getFieldProps('profile.parent.motherName')}
                className={getInputClass('profile.parent.motherName')} 
              />
              <ErrorMsg name="profile.parent.motherName" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Number *</label>
              <input 
                {...formik.getFieldProps('profile.parent.contact')}
                className={getInputClass('profile.parent.contact')} 
                placeholder="10 digit mobile number"
              />
              <ErrorMsg name="profile.parent.contact" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parent Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="email"
                  {...formik.getFieldProps('profile.parent.email')}
                  className={`${getInputClass('profile.parent.email')} pl-9`} 
                />
              </div>
              <ErrorMsg name="profile.parent.email" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identification (Aadhaar) *</label>
              <input 
                maxLength="12" 
                {...formik.getFieldProps('profile.identification.aadhaar')}
                onChange={(e) => formik.setFieldValue('profile.identification.aadhaar', e.target.value.replace(/\D/g,''))}
                className={getInputClass('profile.identification.aadhaar')}
                placeholder="000000000000"
              />
              <ErrorMsg name="profile.identification.aadhaar" />
            </div>
          </div>
        </div>

        {/* 4. Academic History */}
        <div className="card p-5 sm:p-8">
          <SectionHeader icon={Book} title="Academic History" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Previous School *</label>
              <input 
                {...formik.getFieldProps('profile.academic.previousSchool')}
                className={getInputClass('profile.academic.previousSchool')} 
                placeholder="Name of last school attended"
              />
              <ErrorMsg name="profile.academic.previousSchool" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Marks / Grade *</label>
              <input 
                type="number"
                {...formik.getFieldProps('profile.academic.marks')}
                className={getInputClass('profile.academic.marks')} 
                placeholder="0-100"
              />
              <ErrorMsg name="profile.academic.marks" />
            </div>
          </div>
        </div>

        {/* 5. Course & Admission */}
        <div className="card p-5 sm:p-8">
          <SectionHeader icon={Shield} title="Admission Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course *</label>
              <select 
                {...formik.getFieldProps('profile.admission.course')}
                className={getInputClass('profile.admission.course')}
              >
                <option value="BCA">BCA</option>
                <option value="B.Sc CS">B.Sc CS</option>
                <option value="B.Com">B.Com</option>
                <option value="BBA">BBA</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Semester *</label>
              <select 
                {...formik.getFieldProps('profile.admission.semester')}
                className={getInputClass('profile.admission.semester')}
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academic Year</label>
              <input 
                {...formik.getFieldProps('profile.admission.academicYear')}
                className={getInputClass('profile.admission.academicYear')} 
              />
            </div>
          </div>
        </div>

        {/* 3. Address */}
        <div className="card p-5 sm:p-8">
          <SectionHeader icon={Home} title="Address Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permanent Address</label>
              <textarea 
                rows="2" 
                {...formik.getFieldProps('profile.address.permanent')}
                className={getInputClass('profile.address.permanent')} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
              <input 
                {...formik.getFieldProps('profile.address.city')}
                className={getInputClass('profile.address.city')} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
              <input 
                {...formik.getFieldProps('profile.address.state')}
                className={getInputClass('profile.address.state')} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zip Code</label>
              <input 
                {...formik.getFieldProps('profile.address.zip')}
                className={getInputClass('profile.address.zip')} 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
          <button type="button" onClick={() => navigate('/admin/students')} className="px-8 py-3 rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-100 transition-all text-center">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8 sm:px-12 py-3 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditMode ? 'Update Profile' : 'Finalize Admission'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
