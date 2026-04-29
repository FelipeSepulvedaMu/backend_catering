import express from 'express';
import cors from 'cors';
import router from './routes'; // 👈 ahora sí funciona porque existe index.ts

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 👇 CLAVE
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('OK ROOT');
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVER OK on port ${PORT}`);
});