import express from "express";
import path from "path";
import address from "address";

const port = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.post("/form", (req, res) => {
  console.log(req.body);
  return res.sendFile(path.join(__dirname, "./src/index.html"));
});

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") return;
  printToConsole(port);
});

const printToConsole = (port: number) => {
  console.log(`Listening at port ${port}`);
  console.log(address.ip());
};
