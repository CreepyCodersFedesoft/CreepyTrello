const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (req, res) => {
  const msg = {
    to: "dianaeleira@servinformacion.com", // Change to your recipient
    from: "dianaeleira@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      return res.status(200).send({ message: response[0].statusCode });
    })
    .catch((error) => {
      return res.status(response[0].statusCode).send({ message: response[0].headers });
    });
};
module.exports = { sendMail };

