import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GratitudePage',
    required: true,
  },
  pageUniqueId: {
     type: String,
     required: true
  },
  name: {
    type: String,
    default: 'Receiver'
  },
  emoji: {
    type: String,
    default: '❤️'
  },
  message: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
