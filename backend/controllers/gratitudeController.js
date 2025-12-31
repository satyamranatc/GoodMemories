import GratitudePage from '../models/GratitudePage.js';
import Feedback from '../models/Feedback.js';

// @desc    Create a new gratitude page
// @route   POST /api/pages
// @access  Public
export const createPage = async (req, res) => {
  try {
    const { creatorName, lovedOneName, nickname, message, wishes, theme } = req.body;
    
    // Handle file uploads
    const photos = req.files ? req.files.map(file => file.path) : [];

    if (!lovedOneName || !message) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const newPage = await GratitudePage.create({
      creatorName,
      lovedOneName,
      nickname,
      message,
      wishes,
      photos,
      theme
    });

    res.status(201).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a gratitude page by ID
// @route   GET /api/pages/:pageId
// @access  Public
export const getPage = async (req, res) => {
  try {
    const page = await GratitudePage.findOne({ pageId: req.params.pageId }).lean();

    if (!page) {
      return res.status(404).json({ message: 'Page not found or expired' });
    }

    // Fetch associated feedback
    const feedback = await Feedback.find({ pageUniqueId: req.params.pageId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ page, feedback });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add feedback to a page
// @route   POST /api/pages/:pageId/feedback
// @access  Public
export const addFeedback = async (req, res) => {
  try {
    const { name, emoji, message } = req.body;
    const { pageId } = req.params;

    const page = await GratitudePage.findOne({ pageId });

    if (!page) {
      return res.status(404).json({ message: 'Page not found or expired' });
    }

    const newFeedback = await Feedback.create({
      pageId: page._id,
      pageUniqueId: pageId,
      name,
      emoji,
      message
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
