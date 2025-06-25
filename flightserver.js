// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database.js'); // Our database module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// API Routes

// GET /api/flights - Search for flights
app.get('/api/flights', (req, res) => {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
        return res.status(400).json({ error: "Origin, destination, and date are required query parameters." });
    }

    const sql = `SELECT * FROM flights WHERE lower(origin) LIKE ? AND lower(destination) LIKE ? AND date = ? AND seats_available > 0`;
    const params = [`%${origin.toLowerCase()}%`, `%${destination.toLowerCase()}%`, date];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ flights: rows });
    });
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', (req, res) => {
    const { flightId, numPassengers } = req.body;

    if (!flightId || !numPassengers || numPassengers <= 0) {
        return res.status(400).json({ error: "Flight ID and a valid number of passengers are required." });
    }

    db.get("SELECT * FROM flights WHERE id = ?", [flightId], (err, flight) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!flight) {
            return res.status(404).json({ error: "Flight not found." });
        }
        if (flight.seats_available < numPassengers) {
            return res.status(400).json({ error: `Not enough seats available. Only ${flight.seats_available} left.` });
        }

        // Proceed with booking (using a transaction for atomicity)
        db.serialize(() => {
            db.run("BEGIN TRANSACTION;");

            const updateSql = "UPDATE flights SET seats_available = seats_available - ? WHERE id = ?";
            db.run(updateSql, [numPassengers, flightId], function (err) {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).json({ error: `Failed to update flight seats: ${err.message}` });
                }

                const totalPrice = flight.price * numPassengers;
                const insertSql = "INSERT INTO bookings (flight_id, num_passengers, total_price) VALUES (?, ?, ?)";
                db.run(insertSql, [flightId, numPassengers, totalPrice], function (err) {
                    if (err) {
                        db.run("ROLLBACK;");
                        return res.status(500).json({ error: `Failed to create booking: ${err.message}` });
                    }
                    db.run("COMMIT;");
                    res.status(201).json({
                        message: "Booking successful!",
                        bookingId: this.lastID, // SQLite specific way to get last inserted ID
                        flight: { ...flight, seats_available: flight.seats_available - numPassengers }, // Return updated flight
                        numPassengers,
                        totalPrice
                    });
                });
            });
        });
    });
});

// Basic route for root path to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
