const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createAdmin = async (req, res) => {
    if (
        !req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.userImg ||
        !req.body.roleId
    )
        return res.status(400).send("Process failed: Incomplete data.");

    const validId = await mongoose.Types.ObjectId.isValid(req.body.roleId);
    if (!validId) return res.status(400).send("Invalid role ID");
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser)
        return res.status(400).send("Error: The user is already registered.");

    const hash = await bcrypt.hash(req.body.password, 10);

    let imageUrl = "";
    if (req.files.image) {
      if (req.files.image.type != null) {
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        imageUrl = url + serverImg.slice(2);
      }
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        userImg: imageUrl,
        roleId: req.body.roleId,
    });

    const result = await user.save();
    if (!result) return res.status(400).send("Error: Failed to register user.");

    try {
        const jwtToken = user.generateJWT();
        res.status(200).send({ jwtToken });
    } catch (e) {
        return res.status(400).send("Error: Token generation failed.");
    }
};

const createUser = async (req, res) => {
    if (
        !req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.userImg ||
        !req.body.roleId
    )
        return res.status(400).send("Error: Incomplete data.");

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
        return res.status(400).send("Error: The user is already registered.");

    const hash = await bcrypt.hash(req.body.password, 10);

    const role = await Role.findOne({ name: "user" });
    if (!role) return res.status(400).send("Error: No role was assigned.");

    let imageUrl = "";
    if (req.files.image) {
      if (req.files.image.type != null) {
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        
        imageUrl = url + serverImg.slice(2);
      }
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        userImg: userImg,
        roleId: role._id,
    });

    const result = await user.save();
    if (!result) return res.status(400).send("Error: Failed to register user.");
    try {
        const jwtToken = user.generateJWT();
        res.status(200).send({ jwtToken });
    } catch (e) {
        return res.status(400).send("Error: Token generation failed.");
    }
};

const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Error: Wrong email or password.");

    if (!user.dbStatus)
        return res.status(400).send("Error: Wrong email or password.");

    const hash = await bcrypt.compare(req.body.password, user.password);
    if (!hash) return res.status(400).send("Error: Wrong email or password.");

    try {
        const jwtToken = user.generateJWT();
        return res.status(200).send({ jwtToken });
    } catch (e) {
        return res.status(400).send("Error: Login error.");
    }
};

const listUser = async (req, res) => {
    const users = await User.find({
        $and: [{ name: new RegExp(req.params["name"], "i") }, { dbStatus: "true" }],
    })
        .populate("roleId")
        .exec();
    if (!users || users.length === 0)
        return res.status(400).send("No search results");
    return res.status(200).send({ users });
};
const listUserAll = async (req, res) => {
    const users = await User.find({ name: new RegExp(req.params["name"], "i") })
        .populate("roleId")
        .exec();
    if (!users || users.length === 0)
        return res.status(400).send("No search results");
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
//esta funcion esta diseñada para que un admin actualice a cualquierusuario, peor por cuestiones de seguridad no puede usarla un usuario para actualizar sus propios datos, para ello será necesario registrar posteriormente otra funcion
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
      imageUrl = url + serverImg.slice(2);
    }
  }

  //guardamos la ruta de la imagen anterior para eliminarla
  let userImg = await User.findById(req.body._id);
  userImg = userImg.userImg;
  userImg = userImg.split("/")[4];
  let serverImg = "./uploads/" + userImg;

  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
    userImg: imageUrl,
  });

  if (!user) return res.status(400).send("Error editing user");
  //si todo va bien, borramos la imagen anterior
  try {
    fs.unlinkSync(serverImg);
  } catch (err) {
    console.log("Image no found in server");
  }
  return res.status(200).send({ user });
};
const deleteUser = async (req, res) => {
  if (!req.body._id) return res.status(400).send("Incomplete data");

  const user = await User.findByIdAndUpdate(req.body._id, {
    dbStatus: false,
  });
  if (!user) return res.status(400).send("Error delete user");
  return res.status(200).send({ user });
}; 

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
