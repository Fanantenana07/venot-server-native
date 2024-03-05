// app.mjs

// Import required modules
import express from "express";
import sqlite3 from "sqlite3";

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database("./database");

// Middleware for parsing JSON bodies
app.use(express.json());

// Create a professor
app.post("/profs", (req, res) => {
    const { matricule, nom, tauxHoraire, nbHeure } = req.body;
    db.run(
        "INSERT INTO profs (matricule, nom, tauxHoraire, nbHeure) VALUES (?, ?, ?, ?)", [matricule, nom, tauxHoraire, nbHeure],
        (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.send("Professor added successfully.");
        }
    );
});

// Read all professors
// Read all professors
app.get("/profs", (req, res) => {
    db.all("SELECT *, (nbHeure * tauxHoraire) AS prestations FROM profs", (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        // Calculate minimum and maximum prestations
        let minPrestation = Infinity;
        let maxPrestation = -Infinity;
        let totalPrestation = 0;
        
        for (const row of rows) {
            const prestation = row.prestations;
            if (prestation < minPrestation) {
                minPrestation = prestation;
            }
            if (prestation > maxPrestation) {
                maxPrestation = prestation;
            }
            totalPrestation += prestation;
        }
        
        // Send the response
        res.json({
            professors: rows,
            minPrestation,
            maxPrestation,
            totalPrestation
        });
    });
});


// Update a professor
app.put("/profs/:id", (req, res) => {
    const { matricule, nom, tauxHoraire, nbHeure } = req.body;
    const id = req.params.id;
    console.log(id)
    db.run(
        "UPDATE profs SET matricule = ?, nom = ?, tauxHoraire = ?, nbHeure = ? WHERE id = ?", [matricule, nom, tauxHoraire, nbHeure, id],
        (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.send("Professor updated successfully.");
        }
    );
});

// Delete a professor
app.delete("/profs/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM profs WHERE id = ?", id, (err) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.send("Professor deleted successfully.");
    });
});

// Create the profs table if it doesn't exist


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});