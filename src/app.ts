import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import postsRouter from "./routes/posts";

const app = express();
app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as Request & { user: { id: number } }).user = { id: 1 };
  next();
});

app.use("/posts", postsRouter);

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(3000, () => {
  console.log("Threadbase API running at http://localhost:3000");
});
