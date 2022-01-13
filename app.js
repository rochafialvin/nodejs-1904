const http = require("http");
const port = 2022;
const fs = require("fs");

const server = http.createServer((req, res) => {
  const header = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  const todosFile = fs.readFileSync("./data/todos.json");
  const todos = JSON.parse(todosFile);
  console.log(todos);

  res.writeHead(200, header);
  res.end(JSON.stringify(todos));
});

// Menajalankan server pada port 2022
server.listen(port, (err) => {
  // Jika terjadi masalah saat menjalankan server
  if (err) return console.log({ error });
  // Jika berhasil menajalankan server
  console.log(`Server is running at port ${port}`);
});
