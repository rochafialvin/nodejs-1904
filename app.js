const http = require("http");
const fs = require("fs");
const url = require("url");

const port = 2022;

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
  // todosBuffer : <Buffer 46 58 57 ...
  const todosBuffer = fs.readFileSync("./data/todos.json");
  // Mengubah tipe data buffer menjadi array
  // todos : [ {}, {}]
  const todos = JSON.parse(todosBuffer);

  switch (req.method) {
    case "GET":
      // Setup informasi tambahan untuk dikirimkan dalam response bersamaan dengan data yang hendak dikirim (todos)
      res.writeHead(200, header);
      // Menadakan proses request berakhir dengan mengirim response data (todos)
      res.end(JSON.stringify(todos));
      break;

    case "POST":
      // Akses value dari request body
      req
        .on("data", (body) => {
          // body : <Buffer 45 67 85 ...
          // body masih bertipe data buffer, sehingga perlu diubah menjadi object
          // newTodo : { id: 5, action: "Breakfast" }
          const newTodo = JSON.parse(body);
          // Push data ke array todos
          // todos : [ {}, {}, {} ]
          todos.push(newTodo);
          // Simpan todos yang sudah ditambahkan satu data baru ke file todos.json
          // newTodoString : "[{\"id\":1,\"action\":\"Exercise\"},{\"id\":2,\"action\":\"Study\"},{\"id\":3,\"action\":\"Breakfast\"}]"
          const newTodosString = JSON.stringify(todos);
          fs.writeFileSync("./data/todos.json", newTodosString);
        })
        .on("end", () => {
          // Memberikan response
          res.writeHead(201, header);
          res.end("Todo berhasil di tambahkan");
        });
      break;

    case "PUT":
      // chaining (mengubungkan suatu operasi dengan operasi lain)
      // argument kedua diberi nilai true agar hasil return nya berupa object
      // req.url --> /todos/?id=1
      // query --> {id: 1}
      const query = url.parse(req.url, true).query;
      console.log(query);
    // findIndex

    case "DELETE":
    //
  }
});

// Menajalankan server pada port 2022
server.listen(port, (err) => {
  // Jika terjadi masalah saat menjalankan server
  if (err) return console.log({ error });
  // Jika berhasil menajalankan server
  console.log(`Server is running at port ${port}`);
});
