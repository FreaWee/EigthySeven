import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Charger les variables d'environnement
dotenv.config();
const app = express();
// Configurer CORS de manière dynamique
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "", // URL du frontend en production
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Origine non autorisée par CORS"));
        }
    },
}));
// Route pour récupérer les données depuis Airtable
app.get("/api", async (req, res) => {
    try {
        // Appel à l'API Airtable
        const response = await fetch("https://api.airtable.com/v0/appRbmrbJj8DO4Fmb/tblVX5Suv30stk1P8", {
            headers: {
                Authorization: `Bearer patqGqNfjpUuvUtE1.7da1737532f0026ee2ce83a04d964d73d8b9ec18b6bfe07ca34708976f7039d0`,
            },
        });
        if (!response.ok) {
            throw new Error(`Erreur API Airtable : ${response.statusText}`);
        }
        // Récupère et formate les données
        const data = await response.json();
        const filteredData = data.records.reduce((acc, record) => {
            acc[record.id] = {
                companyName: record.fields.CompanyName || "Nom inconnu",
                logo: record.fields.Logo || [{ url: "/placeholder-logo.png" }], // Format tableau
                category: record.fields.Category || "",
                typeOfMember: record.fields["Type of Member"] || "",
                innovationDriver: Array.isArray(record.fields.InnovationDriver)
                    ? record.fields.InnovationDriver
                    : record.fields.InnovationDriver
                        ? [record.fields.InnovationDriver]
                        : ["Non spécifié"],
                website: record.fields.Website || "",
            };
            return acc;
        }, {});
        // Envoie les données formatées
        res.status(200).json(filteredData);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({
            error: "Erreur serveur",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
// Écoute sur le port
const port = parseInt(process.env.PORT || "5000", 10); // Changé à 5000 pour éviter conflit
app.listen(port, "0.0.0.0", () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
