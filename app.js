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
  // chaining (mengubungkan suatu operasi dengan operasi lain)
  // argument kedua diberi nilai true agar hasil return nya berupa object
  // req.url --> /todos/?id=1
  // query --> {id: 1}
  const query = url.parse(req.url, true).query;

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
      req
        .on("data", (body) => {
          // body : <Buffer 45 67 85 ...
          // bodyParsed : { isDone : true }
          const bodyParsed = JSON.parse(body);
          // id pada query bertipe data string, sehingga perlu diubah ke number untuk dibandingkan dengan id pada todos yang juga bertipe data number
          // selectedIndex = 0
          const selectedIndex = todos.findIndex(
            (todo) => todo.id === parseInt(query.id)
          );

          // todos[0] --> { "id": 1, "action": "Exercise", "isDone": true }
          todos[selectedIndex].isDone = bodyParsed.isDone;

          // todos --> [ {}, {} ]
          // todoString -- >"[{\"id\":1,\"action\":\"Exercise\", \"isDone\":\"true\"},{\"id\":2,\"action\":\"Study\", \"isDone\":\"false\"}]"
          const todosString = JSON.stringify(todos);
          fs.writeFileSync("./data/todos.json", todosString);
        })
        .on("end", () => {
          res.writeHead(200, header);
          res.end("Todo berhasil diubah");
        });

    case "DELETE":
      // id --> 3
      const id = parseInt(query.id);
      // todos --> [ {id: 1}, {id: 2}, {id: 3}, {id: 4} ]
      // filteredTodos --> [ {id: 1}, {id: 2}, {id: 4} ]
      const filteredTodos = todos.filter((todo) => todo.id !== id);
      fs.writeFileSync("./data/todos.json", JSON.stringify(filteredTodos));

      res.writeHead(200, header);
      res.end("Todo berhasil dihapus");
  }
});

// Menajalankan server pada port 2022
server.listen(port, (err) => {
  // Jika terjadi masalah saat menjalankan server
  if (err) return console.log({ error });
  // Jika berhasil menajalankan server
  console.log(`Server is running at port ${port}`);
});
