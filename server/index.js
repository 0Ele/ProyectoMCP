import express from "express";
import cors from "cors";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-6585017473936720-092221-0c079a059f2a464f0743515f8c6728ac-2003805548",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server");
});

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          id: 66667,  // ID personalizado de cliente
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "MX",
        },
      ],
      back_urls: {
        success: "http://localhost:5173.",
        failure: "http://localhost:5173.",
        pending: "http://localhost:5173.",
      },
      auto_return: "approved",
      notification_url:"https://cc38-2806-370-7254-c07f-c901-c329-a0c-4767.ngrok-free.app/webhook",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :(",
    });
  }
});

app.post("/webhook", async function (req, res) {
  const paymentId = req.query.id;

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Verificar el estado y el detalle del estado
      if (data.status === 'approved' && data.status_detail === 'accredited') {
        // Acceder al ID personalizado desde los items
        const customClientId = data.additional_info.items?.[0]?.id || "ID no encontrado";
        
        // Mostrar mensaje con el ID personalizado del cliente
        console.log(`El mono está en la base. ID personalizado del cliente: ${customClientId}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});



// Aquí cerramos correctamente el listen fuera de app.post
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
