const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (req, res) => {
  const urlMail = process.env.URL_MESSAGES + "/api/user/activateUser/" + req.body.email;

  const msg = {
    to: req.body.email, // Change to your recipient
    from: "dianaeleira@gmail.com", // Change to your verified sender
    subject: "Welcome to Creppy Trello Software",
    name: "Creppy Trello",
    html:
      "Hi, " +
      req.body.name +
      "!<br />Welcome to Creppy Trello Software." +
      "Please activate your email by clicking <strong><a href='" +
      urlMail +
      "'>here</a></strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      //return res.status(200).send({ message: response[0].statusCode });
      return "ok";
    })
    .catch((error) => {
      return "error";
      //return res.status(response[0].statusCode).send({ message: response[0].headers });
    });
};
module.exports = { sendMail };
