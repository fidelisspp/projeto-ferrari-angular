const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for Angular app (running on localhost:4200)
app.use(cors());
app.use(express.json());

// Path to SQLite database file
const dbPath = path.join(__dirname, 'pilots.db');

// Connect to SQLite database (creates 'pilots.db' file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite com sucesso.");
    
    // Create the pilots table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS pilots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      nationality TEXT NOT NULL,
      weight TEXT NOT NULL,
      height TEXT NOT NULL,
      number INTEGER NOT NULL
    )`, (err) => {
      if (err) {
        console.error("Erro ao criar tabela:", err.message);
      } else {
        console.log("Tabela 'pilots' criada ou já existente.");
        
        // Seed initial data if the database is empty
        db.get("SELECT COUNT(*) as count FROM pilots", [], (err, row) => {
          if (err) {
            console.error("Erro ao verificar registros:", err.message);
          } else if (row && row.count === 0) {
            const seedQuery = `INSERT INTO pilots (name, age, nationality, weight, height, number) VALUES 
              ('Charles Leclerc', 25, 'Monaco', '69', '1.80', 16),
              ('Carlos Sainz', 28, 'Spain', '72', '1.78', 55)`;
            db.run(seedQuery, (err) => {
              if (err) {
                console.error("Erro ao inserir dados iniciais:", err.message);
              } else {
                console.log("Dados iniciais inseridos com sucesso.");
              }
            });
          }
        });
      }
    });
  }
});

// GET: List all pilots
app.get('/api/Pilots', (req, res) => {
  db.all("SELECT * FROM pilots", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar pilotos:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// POST: Add a new pilot
app.post('/api/Pilots', (req, res) => {
  const { name, age, nationality, weight, height, number } = req.body;
  
  if (!name || !age || !nationality || !weight || !height || !number) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const query = `INSERT INTO pilots (name, age, nationality, weight, height, number) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [name, age, nationality, weight, height, number], function (err) {
    if (err) {
      console.error("Erro ao criar piloto:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, name, age, nationality, weight, height, number });
    }
  });
});

// PUT: Update an existing pilot
app.put('/api/Pilots', (req, res) => {
  const { id, name, age, nationality, weight, height, number } = req.body;
  
  if (!id || !name || !age || !nationality || !weight || !height || !number) {
    return res.status(400).json({ error: "Todos os campos, incluindo ID, são obrigatórios." });
  }

  const query = `UPDATE pilots SET name = ?, age = ?, nationality = ?, weight = ?, height = ?, number = ? WHERE id = ?`;
  db.run(query, [name, age, nationality, weight, height, number, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar piloto:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id, name, age, nationality, weight, height, number });
    }
  });
});

// DELETE: Delete a pilot by ID from query string (e.g., /api/Pilots?id=3)
app.delete('/api/Pilots', (req, res) => {
  const id = req.query.id;
  
  if (!id) {
    return res.status(400).json({ error: "O parâmetro id é obrigatório." });
  }

  const query = `DELETE FROM pilots WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error("Erro ao deletar piloto:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, deletedId: id });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});
