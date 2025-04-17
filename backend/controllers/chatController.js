// const Message = require('../models/messageModel.js');

// exports.sendMessage = async (req, res) => {
//   const { content, role } = req.body;
//   const message = new Message({ userId: req.id, content, role });
//   await message.save();
//   res.status(201).json(message);
// };

// exports.getHistory = async (req, res) => {
//   const messages = await Message.find({ userId: req.id }).sort('timestamp');
//   res.json(messages);
// };

// exports.clearHistory = async (req, res) => {
//   await Message.deleteMany({ userId: req.id });
//   res.json({ message: 'Chat history cleared.' });
// };



const Chat = require('../models/chatModel.js'); // ✅ Import the correct model

// POST /api/chat - Save a new chat (user and assistant messages)
exports.sendMessage = async (req, res) => {
  const { userMessages, assistantMessages } = req.body;

  if (!userMessages || !assistantMessages) {
    return res.status(400).json({ message: 'Missing userMessages or assistantMessages' });
  }

  try {
    const chat = new Chat({ userMessages, assistantMessages }); // ✅ Use Chat model
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving chat' });
  }
};

// GET /api/chat - Get full chat history
exports.getHistory = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // ✅ Use Chat model
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

// DELETE /api/chat - Clear all chat history
exports.clearHistory = async (req, res) => {
  try {
    await Chat.deleteMany(); // ✅ Use Chat model
    res.json({ message: 'Chat history cleared.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing history' });
  }
};
