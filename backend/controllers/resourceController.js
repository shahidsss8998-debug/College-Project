const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  const { department, semester } = req.query;
  let query = {};
  if (department) query.department = department;
  if (semester) query.semester = semester;

  try {
    const resources = await Resource.find(query).populate('uploadedBy', 'name');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createResource = async (req, res) => {
  const { title, subject, department, semester, fileUrl } = req.body;
  try {
    const resource = await Resource.create({
      title,
      subject,
      department,
      semester,
      fileUrl,
      uploadedBy: req.user._id
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
