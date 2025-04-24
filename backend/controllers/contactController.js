/**
 * @fileoverview Controller for handling contact form submissions.
 */

/**
 * Handles the submission of the contact form.
 * For now, it just logs the received data.
 * 
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const handleContactSubmission = async (req, res) => {
  // The authMiddleware should have verified the user 
  // and attached the user ID to req.user.id
  if (!req.user?.id) { 
    // This check might be slightly redundant if the middleware always blocks unauthenticated requests,
    // but it's good practice to ensure the controller has the expected data.
    console.error('Contact Controller - User ID not found on req.user.id after auth middleware.');
    return res.status(401).json({ message: 'Authentication details missing.' });
  }

  const { subject, message } = req.body;
  const userId = req.user.id; 

  // Basic validation
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }

  console.log('Received contact form submission:');
  console.log('User ID:', userId);
  console.log('Subject:', subject);
  console.log('Message:', message);

  try {
    // --- Placeholder for Email Sending Logic --- 
    // In the future, add code here to send an email using Nodemailer, SendGrid, etc.
    // Example: await sendContactEmail({ userId, subject, message });
    // --- End Placeholder --- 

    // Send success response
    res.status(200).json({ message: 'Message received successfully!' });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ message: 'Error processing your message. Please try again later.' });
  }
};

module.exports = {
  handleContactSubmission,
};
