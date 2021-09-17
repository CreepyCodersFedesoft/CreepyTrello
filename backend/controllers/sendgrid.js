const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (req, res) => {
  const urlMail = req.protocol + "://" + req.get("host") + "/api/user/activateUser/" + req.body.email;

  const msg = {
    to: req.body.email, // Change to your recipient
    from: "dianaeleira@gmail.com", // Change to your verified sender
    subject: "Bienvenido a Creppy Trello Software",
    name: "Creppy Trello",
    html:
      "Hi, " +
      req.body.name +
      "!<br />Bienvenido a Creppy Trello Software." +
      "Por favor, active su correo haciendo clic <strong><a href='" +
      urlMail +
      "'>aquí</a></strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      return "ok";
    })
    .catch((error) => {
      return "error";
    });
};
module.exports = { sendMail };
