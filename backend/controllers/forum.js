const db = require("../db");

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).json({ error: "Bad Request" });
  try {
    await db.execute("INSERT INTO forums (name,description) VALUES(?,?)", [
      req.body.name,
      req.body.description,
    ]);
    res.status(201).json({ message: "Forum Created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const [forums] = await db.query("SELECT * FROM forums");
    res.status(200).json(forums);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.get = async (req, res) => {
  try {
    const [forums] = await db.execute("SELECT * FROM forums WHERE id = ? LIMIT 1", [req.params.id]);
    if (!forums.length) return res.status(404).json({ error: "Forum Not Found" });
    res.status(200).json(forums[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.modify = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).json({ error: "Bad Request" });
  try {
    const [result] = await db.execute(
      "UPDATE forums SET name = ?, description = ? WHERE id = ? LIMIT 1",
      [req.body.name, req.body.description, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Forum Not Found" });
    res.status(200).json({ message: "Forum Modified" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM forums WHERE id = ? LIMIT 1", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Forum Not Found" });
    res.status(200).json({ message: "Forum Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
