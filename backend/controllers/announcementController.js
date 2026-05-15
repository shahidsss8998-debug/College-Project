const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  try {
    const announcement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (announcement) {
      await announcement.deleteOne();
      res.json({ message: 'Announcement removed' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
