// backend/src/controllers/payment.controller.js
import { Config } from "../models/Config.js";
import {
  makeOrderNumber,
  makeTransactionId,
  makeDateTimeTransaction16,
} from "../utils/ids.js";

function calcAmountFromItems(items = []) {
  // items: [{ id, qty, price }]
  const total = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0),
    0,
  );
  return total.toFixed(2);
}

export async function buildCheckout(req, res) {
  const { configId, items } = req.body;

  const cfg = await Config.findByPk(configId);
  if (!cfg) return res.status(404).json({ message: "Config no existe" });

  const amount = calcAmountFromItems(items);

  const transactionId = makeTransactionId();
  const orderNumber = makeOrderNumber();
  const dateTimeTransaction = makeDateTimeTransaction16();

  const iziConfig = {
    transactionId,
    action: "pay",
    merchantCode: process.env.IZIPAY_MERCHANT_CODE,
    order: {
      orderNumber,
      currency: "PEN",
      amount,
      processType: "AT",
      merchantBuyerId: "buyer-demo",
      dateTimeTransaction,
      payMethod: "CARD,QR,YAPE_CODE,PAGO_PUSH",
    },
    // Para carrito demo: puedes enviar billing mínimo fijo (sin UI)
    billing: {
      firstName: "Cliente",
      lastName: "Demo",
      email: "cliente@demo.com",
      phoneNumber: "999999999",
      street: "Av. Demo 123",
      city: "Lima",
      state: "Lima",
      country: "PE",
      postalCode: "15000",
      documentType: "DNI",
      document: "12345678",
    },
    language: {
      init: "ESP",
      showControlMultiLang: true,
    },
    render: {
      typeForm: "pop-up",
    },
    appearance: {
      styleInput: "normal",
      logo:
        cfg.logoUrl ||
        "https://res.cloudinary.com/desaac6ma/image/upload/v1771560658/tech_leads_ejzh4d.png",
      customize: {
        visibility: {
          hideOrderNumber: false,
          hideLogo: false,
          hideResultScreen: false,
          hideGlobalErrors: false,
          hideShakeValidation: false,
          hideMessageActivateOnlinePurchases: false,
          hideTestCards: false,
        },
        elements: [
          {
            paymentMethod: "CARD",
            order: 1,
            fields: [
              {
                name: "cardNumber",
                order: 1,
                visible: true,
                groupName: "",
              },
            ],
            changeButtonText: {
              actionPay: "Pagar",
            },
          },
        ],
      },
      customTheme: {
        name: "customTheme",
        font: "Museo Sans",
        isModeAdvance: true,
        colors: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          primary: {
            background: cfg.primaryColor || "#ba0352",
            color: "#ffffff",
          },
          button: {
            primary: {
              color: "#ffffff",
              background: cfg.primaryColor || "#ba0352",
              mainColor: cfg.primaryColor || "#ba0352",
              activeColor: cfg.primaryColor || "#ba0352",
            },
          },
          select: {
            primary: {
              color: "#000000",
              borderColor: "#000000",
              arrow: {
                down: "#000000",
                up: "#000000",
              },
              boxShadow: "#9f9f9f 0px 0px 0px 2px !important",
            },
          },
          text: {
            color: "#000000",
          },
          input: {
            color: "#000000",
            borderColor: "#000000",
            boxShadow: "#9f9f9f 0px 0px 0px 2px !important",
          },
        },
      },
    },
  };

  res.json({
    iziConfig,
    keyRSA: process.env.IZIPAY_KEY_RSA,
    ui: { primaryColor: cfg.primaryColor, logoUrl: cfg.logoUrl },
  });
}

export async function tokenSession(req, res) {
  const { transactionId, orderNumber, amount } = req.body;

  const r = await fetch(process.env.IZIPAY_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      transactionId: transactionId,
    },
    body: JSON.stringify({
      requestSource: "ECOMMERCE",
      merchantCode: process.env.IZIPAY_MERCHANT_CODE,
      orderNumber,
      publicKey: process.env.IZIPAY_PUBLIC_KEY,
      amount,
    }),
  });

  const data = await r.json();

  if (!r.ok || data?.code !== "00") {
    return res.status(400).json({
      message: "No se pudo generar token session",
      izipay: data,
    });
  }

  res.json({ token: data.response.token });
}
