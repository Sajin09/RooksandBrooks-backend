const express = require('express')
const multer = require('multer')
const { sendEmail } = require('./service/email')
const emailRouter = require('./route/route')
const cors = require('cors')
const nodemailer= require('nodemailer')

const app = express();
const port = 3001;


const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_JS_APP_USER,
    pass: process.env.NODE_JS_APP_PASSWORD,
  },
});


app.post('/send', upload.single('resume'), async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const resumeFile = req.file;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  const userEmailContent = `
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;

  try {

    await transporter.sendMail({
      from: process.env.NODE_JS_APP_USER,
      to: process.env.NODE_JS_APP_USER,
      subject: 'New Job Application',
      html: userEmailContent,
      attachments: resumeFile ? [{ path: resumeFile.path }] : [],
    });
    res.json({ msg: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to submit application.', error: err.message });
  }
});

// Route to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { email, messageContent } = req.body;

  if (!email || !messageContent) {
    return res.status(400).json({ msg: 'Email and message content are required.' });
  }

  const mailOptions = {
    from: email,
    to: process.env.NODE_JS_APP_USER,
    subject: 'Contact Form Submission',
    html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${messageContent}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ msg: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ msg: 'Failed to send message.' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});