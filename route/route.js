const express = require('express');
const router = express.Router();
const { sendEmail } = require('../service/email');

router.post('/email', async (req, res) => {
    console.log('Received request:', req.body);
    try {
        await sendEmail(req.body.email, req.body.messageContent); 
        res.status(200).json({ msg: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Error sending email' });
    }
});

module.exports = router;