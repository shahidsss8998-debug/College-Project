const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], minlength: [3, 'Name must be at least 3 characters'], index: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },

  // Structured Student Profile Data
  profile: {
    personal: {
      dob: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || new Date(v) < new Date();
          },
          message: 'Date of birth must be in the past'
        }
      },
      gender: String,
      nationality: String,
      bloodGroup: String,
      contactNumber: {
        type: String,
        match: [/^\d{10}$/, 'Student contact number must be exactly 10 digits']
      },
      photo: String, // URL or Base64
    },
    parent: {
      fatherName: String,
      motherName: String,
      guardianName: String,
      contact: {
        type: String,
        match: [/^\d{10}$/, 'Contact number must be exactly 10 digits']
      },
      email: String,
      occupation: String,
      address: String,
    },
    address: {
      permanent: String,
      current: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    academic: {
      previousSchool: String,
      lastClass: String,
      marks: {
        type: Number,
        min: [0, 'Marks cannot be less than 0'],
        max: [100, 'Marks cannot be more than 100']
      },
      board: String,
      tcDetails: String,
      medium: String,
    },
    admission: {
      course: String,
      semester: String,
      academicYear: String,
      admissionDate: String,
      admissionNo: { type: String, unique: true, sparse: true },
      category: String,
    },
    identification: {
      aadhaar: {
        type: String,
        match: [/^\d{12}$/, 'Aadhaar must be exactly 12 digits']
      },
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
