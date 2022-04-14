const db = require("../db");

exports.create = async (req, res) => {
  if (!req.body.name)
  return res.status(400).json({ error: "Bad Request" });
  try {
    await db.execute("INSERT INTO roles (name) VALUES(?)", [
      req.body.name,
    ]);
    res.status(201).json({ message: "Role Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const [roles] = await db.query("SELECT * FROM roles");
    res.status(200).json(roles);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const [roles] = await db.execute("SELECT * FROM roles WHERE id = ? LIMIT 1", [req.params.id]);
    if (!roles.length) return res.status(404).json({ error: "Role Not Found" });
    res.status(200).json(roles[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modify = async (req, res) => {
  if (!req.body.name || !req.body.is_moderator)
  return res.status(400).json({ error: "Bad Request" });
  try {
    const [result] = await db.execute(
      "UPDATE roles SET name = ?, is_moderator = ? WHERE id = ? LIMIT 1",
      [req.body.name, req.body.is_moderator, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Role Not Found" });
    res.status(200).json({ message: "Role Modified" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM roles WHERE id = ? LIMIT 1", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Role Not Found" });
    res.status(200).json({ message: "Role Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};