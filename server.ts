import express from 'express';
import cors from 'cors';
import router from './routes'; // 👈 IMPORTANTE

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 👇 AQUÍ ESTÁ LA CLAVE
app.use('/api', router);

app.get('/', (req, res) => {
  res.send('OK ROOT');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVER OK on port ${PORT}`);
});