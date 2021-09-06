const Role = require("../models/role");

const createRole = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Incomplete data");

  const existingRole = await Role.findOne({ name: req.body.name });
  if (existingRole) return res.status(400).send("The role already exists");

  const role = new Role({
    name: req.body.name,
    description: req.body.description,
    dbStatus: true,
  });

  const result = await role.save();
  if (!result) return res.status(400).send("Failed to register role");
  return res.status(200).send({ result });
};

const listRole = async (req, res) => {
    const role = await Role.find();
    if (!role || role.length === 0)
      return res.status(400).send("Empty role list");
    return res.status(200).send({ role });    
};
const updateRole = async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.body._id);
    if (!validId) return res.status(400).send("Invalid id");
  
    if (!req.body._id || !req.body.description)
      return res.status(400).send("Incomplete data");
  
    const role = await Role.findByIdAndUpdate(req.body._id, {
      description: req.body.description,
    });
    if (!role) return res.status(400).send("Error editing role");
    return res.status(200).send({ role });    
};

module.exports = { createRole, listRole, updateRole };
