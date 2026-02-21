import { Config } from "../models/Config.js";

export async function list(req, res) {
  const rows = await Config.findAll({ order: [["createdAt", "DESC"]] });
  res.json(rows);
}

export async function getOne(req, res) {
  const row = await Config.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Config no existe" });
  res.json(row);
}

export async function create(req, res) {
  const cfg = await Config.create(req.body);
  res.status(201).json(cfg);
}

export async function update(req, res) {
  const cfg = await Config.findByPk(req.params.id);
  if (!cfg) return res.status(404).json({ message: "Config no existe" });

  await cfg.update(req.body);
  res.json(cfg);
}

export async function remove(req, res) {
  const cfg = await Config.findByPk(req.params.id);
  if (!cfg) return res.status(404).json({ message: "Config no existe" });

  await cfg.destroy();
  res.json({ ok: true });
}

export async function duplicate(req, res) {
  const cfg = await Config.findByPk(req.params.id);
  if (!cfg) return res.status(404).json({ message: "Config no existe" });

  const data = cfg.toJSON();
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  data.clientName = `${data.clientName} (Copia)`;

  // refresca ids de productos
  data.products = (data.products || []).map((p) => ({
    ...p,
    id: crypto.randomUUID(),
  }));

  const copy = await Config.create(data);
  res.status(201).json(copy);
}
