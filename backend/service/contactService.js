const contactRepository = require("../repository/contactRepository");
const { Resend } = require("resend");

const createMessage = async (req, res, next) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const contactMessage = await contactRepository.createMessage({
      name,
      email,
      subject,
      message,
    });

    await resend.emails.send({
      from: "Autoparts <onboarding@resend.dev>",
      to: "miguelmarinho2003@gmail.com",
      replyTo: email,
      subject: "New Contact Message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Contact Request</h2>

        <p>A new message has been submitted through the website contact form.</p>

        <hr />

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>

        <div style="background:#f5f5f5;padding:15px;border-radius:6px;">
            ${message.replace(/\n/g, "<br>")}
        </div>

        <hr />

        <p>
            Reply directly to:
            <a href="mailto:${email}">
            ${email}
            </a>
        </p>
        </div>
    `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contactMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
};
