const http = require("http");
const port = 2022;
const fs = require("fs");

const server = http.createServer((req, res) => {
  // Membuat informasi tambahan response untuk client
  const header = {
    // Jenis data yang akan dikirim bertipe json
    "Content-Type": "application/json",
    // Menentukan siapa saja yang boleh mengakses
    "Access-Control-Allow-Origin": "*",
    // Menentukan methos apa saja yang dapat mengakses api
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  // Membaca file
  const todosBuffer = fs.readFileSync("./data/todos.json");
  // Mengubah tipe data buffer menjadi array
  const todos = JSON.parse(todosBuffer);

  switch (req.method) {
    case "GET":
      // Setup informasi tambahan untuk dikirimkan dalam response bersamaan dengan data yang hendak dikirim (todos)
      res.writeHead(200, header);
      // Menadakan proses request berakhir dengan mengirim data (todos)
      res.end(JSON.stringify(todos));
      break;

    case "POST":
      // Akses value dari request body
      req.on("data", (chunk) => {
        // chunk masih bertipe data buffer, sehingga perlu diubah menjadi object
        const newTodo = JSON.parse(chunk);
        // Push data ke array todos
        todos.push(newTodo);
        // Simpan todos yang sudah ditambahkan satu data baru ke file todos.json
        fs.writeFileSync("./data/todos.json", JSON.stringify(todos));
      });

      // Memberikan response
      res.writeHead(201, header);
      res.end("Todo berhasil di tambahkan");

    default:
      break;
  }
});

// Menajalankan server pada port 2022
server.listen(port, (err) => {
  // Jika terjadi masalah saat menjalankan server
  if (err) return console.log({ error });
  // Jika berhasil menajalankan server
  console.log(`Server is running at port ${port}`);
});
