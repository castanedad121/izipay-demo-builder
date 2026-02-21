import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./config/db.js";
import { Config } from "./models/Config.js";

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const exists = await Config.count();
  if (exists > 0) {
    console.log("Ya existe data, seed omitido.");
    process.exit(0);
  }

  await Config.create({
    clientName: "Touribng",
    storeName: "Rogunr",
    logoUrl: "https://www.dinersclub.pe/themes/custom/dinersclub/logo.svg",
    primaryColor: "#ba0352",

    products: [
      {
        id: crypto.randomUUID(),
        name: "BOLSO PARA GIMNASIO",
        price: 100,
        size: "M",
        color: "Negro",
        imageUrl:
          "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/1344/PMP20001311189/full_image-1.jpeg",
      },
      {
        id: crypto.randomUUID(),
        name: "POLERA DEPORTIVA",
        price: 490,
        size: "M",
        color: "Azul",
        imageUrl:
          "https://media.falabella.com/falabellaPE/123110145_01/w=1200,h=1200,fit=pad",
      },
    ],
  });

  console.log("Seed OK ✅");
  process.exit(0);
})();
