const login = require('../models/loginmodel')

const createuser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const newlogin = await login.create({ username, password });
        res.status(200).json(newlogin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createuser
}