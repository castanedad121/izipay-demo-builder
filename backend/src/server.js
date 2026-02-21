// backend/src/server.js
import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { sequelize } from "./config/db.js";
import { Config } from "./models/Config.js";

const port = Number(process.env.PORT || 3001);

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () =>
    console.log(`Backend listo: http://localhost:${port}`),
  );
})();
