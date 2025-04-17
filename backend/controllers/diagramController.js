const Diagram = require('../models/Diagram');

exports.createDiagram = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        const newDiagram = new Diagram({
            title,
            description,
            imageUrl,
            user: req.id // from token middleware
        });

        await newDiagram.save();

        res.status(201).json({ message: 'Diagram saved!', diagram: newDiagram });
    } catch (err) {
        res.status(500).json({ message: 'Error creating diagram', error: err.message });
    }
};

exports.getAllDiagrams = async (req, res) => {
    try {
        const diagrams = await Diagram.find({ user: req.id }).sort({ createdAt: -1 });
        res.status(200).json(diagrams);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching diagrams', error: err.message });
    }
};

exports.deleteDiagram = async (req, res) => {
    try {
        const { id } = req.params;

        const diagram = await Diagram.findOne({ _id: id, user: req.id });

        if (!diagram) {
            return res.status(404).json({ message: 'Diagram not found or unauthorized' });
        }

        await diagram.deleteOne();
        res.status(200).json({ message: 'Diagram deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting diagram', error: err.message });
    }
};
