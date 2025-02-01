import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({limit: "25mb"}));
app.use(express.urlencoded({limit: "25mb"}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*" );
  next();
});

var myemail = process.env.REACT_APP_EMAIL_ACTIVO;
var mypassword = process.env.REACT_APP_NODEMAILER_ID;

function enviarCorreo ({nombres, correo, codigo}) {

  return new Promise((resolve, reject) => {

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: myemail,
        pass: mypassword,
      },

    });

    const mail_config = {
      from: myemail,
      to: correo,
      subject: "Codigo de Autenticacion en PlanifiKlub",
      html: `

      <div style="
        font-family: Arial, sans-serif; 
        color: #333; 
        background-color: #f9f9f9; 
        padding: 20px; 
        border-radius: 8px; 
        max-width: 500px; 
        margin: auto; 
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      ">

          <h2 style="color: #7C0A01; text-align: center;">Bienvenido a PlanifiKlub</h2>
          <p>Hola <strong>${nombres}</strong>,</p>

          <p>Has recibido un correo de <strong>PlanifiKlub</strong>:</p>

          <div style="
              background-color: #f1f1f1; 
              padding: 12px; 
              border-left: 4px solid #CC9901; 
              font-size: 18px; 
              text-align: justify;
              font-weight: bold;
          ">
              Tu código de autenticación es: <span style="color: #CC9901;">${codigo}</span>.
          </div>

          <p style="margin-top: 20px;">Si no has solicitado la cotización de un evento, ignora este mensaje.</p>

          <p style="font-size: 10px; color: #777; text-align: center;">
              * Este es un mensaje automático. Por favor, no respondas a este correo.
          </p>

      </div>`,

    };

    transporter.sendMail(mail_config, function (error, info){
      if (error) {
        console.log(error);
        return reject({message: 'Ocurrió un error'});
      }
      return resolve({message: "Email enviado"});
    });
  });
}

app.get("/", (req, res) => {
  enviarCorreo()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/send_auth_code", (req, res) => {
  console.log("Somebody just hit me");
  enviarCorreo(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
  console.log(myemail);
  console.log(mypassword);
});
