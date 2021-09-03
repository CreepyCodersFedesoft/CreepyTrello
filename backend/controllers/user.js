const User = require("../models/user");
const bcrypt = require("bcrypt");
const moment = require("moment");
//importar bcrypt

const createUser = async (req, res) => {};
const createAdmin = async (req, res) => {};
const login = async (req, res) => {};
const listUser = async (req, res) => {};
const listUserAll = async (req, res) => {
  const users = await User.find({ name: new RegExp(req.params["name"], "i") })
    .populate("roleId")
    .exec();
  if (!users || users.length === 0)
    return res.status(400).send("Error: No users");
  return res.status(200).send({ users });
};
const getRole = async (req, res) => {
  const user = await User.findOne({ email: req.params.email })
    .populate("roleId")
    .exec();
  if (!user || user.length === 0)
    return res.status(400).send("Error: User no found");
  const role = user.roleId.name;
  return res.status(200).send({ role });
};
const updateUser = async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send("Error: Empty fields");

  let pass = "";
  let imageUrl = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const userFind = await User.findOne({ email: req.body.email });
    pass = userFind.password;
  }

  if (req.files.image) {
    if (req.files.image.type != null) {
      const url = req.protocol + "://" + req.get("host") + "/";
      const serverImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(serverImg)
      );
      imageUrl =
        url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
    }
  }

  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
    userImg: imageUrl,
  });

  if (!user) return res.status(400).send("Error editing user");
  return res.status(200).send({ user });
};
const deleteUser = async (req, res) => {}; //se actualiza el estado a false

module.exports = {
  createAdmin,
  createUser,
  login,
  listUser,
  updateUser,
  deleteUser,
  listUserAll,
  getRole,
};
