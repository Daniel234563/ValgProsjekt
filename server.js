const express = require("express");
const app = express();
const sql = require("mssql");
module.exports = { insertValue, getBruker, getParti };

const sqlConfig = {
  user: "skole",
  password: "skole2023",
  server: "glemmen.bergersen.dk",
  database: "Daniel_Skyrud",
  port: 4729,
  options: {
    trustServerCertificate: true,
  },
};

app.get("/insertValue/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await insertValue(id);
    res.send(`Oppdater parti for partiid: ${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "feil med oppdatering." });
  }
});

app.get("/getparti", async (req, res) => {
  const id = req.params.id;
  try {
    await getParti();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "feil med henting." });
  }
});

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/src"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html"); // Riktig bane til HTML-filen
});

app.get("/charts", function (req, res) {
  res.sendFile(__dirname + "/public/html/charts.html"); // Corrected the path
});

app.get("/chartJs", function (req, res) {
  res.sendFile(__dirname + "/src/charts.js");
});

app.listen(4000, async function () {
  console.log("Daniserver startet på 3000!");
  try {
    await getParti();
    await getBruker();
    await insertValue();
  } catch (err) {
    console.error(err);
  }
});

async function insertValue(id) {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("Inserting value for partiId:", id);

    const result = await pool
      .request()
      .input("id", sql.NVarChar, id)
      .query(`UPDATE parti SET stemmer = stemmer + 1 WHERE id = ${id}`);

    console.log("SQL Query Result:", result);

    console.log("Value updated successfully.");
  } catch (err) {
    console.error("Error inserting value:", err);
  }
}

app.listen(process.env.port || 3000);

async function getParti(req, res) {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query("select * from parti");
    const data = result.recordset;
    console.log(data);
    res.json(data); // Sending data back in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "feil med henting." });
  }
}

async function getBruker() {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query("select * from bruker");
    console.log(result.recordset);
  } catch (err) {
    console.error(err);
  }
}
