import address from "address";

export const printToConsole = (port: number | string) => {
  console.log("Server is running");
  console.log(`Local:            http://localhost:${port}`);
  console.log(`On Your Network:  http://${address.ip()}:${port}`);
};
