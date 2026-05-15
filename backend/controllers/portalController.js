const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Resource = require('../models/Resource');

// --- Announcements ---
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = new Announcement({
      title,
      content,
      createdBy: req.user._id
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(announcement);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Events ---
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;
    const event = new Event({
      title,
      description,
      date,
      venue,
      createdBy: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered' });
    }
    
    event.participants.push(req.user.id);
    await event.save();
    res.json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Resources ---
exports.getResources = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;
    
    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, subject, department, semester, fileUrl } = req.body;
    const resource = new Resource({
      title,
      subject,
      department,
      semester,
      fileUrl,
      uploadedBy: req.user._id
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(resource);
  } catch (error) {
    console.error('Portal Error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

