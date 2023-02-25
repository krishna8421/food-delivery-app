import express, { type Express } from "express";
import cors from "cors";
import router from "./routers";

const PORT = process.env.PORT || 8000;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at https://localhost:${PORT}`);
});
