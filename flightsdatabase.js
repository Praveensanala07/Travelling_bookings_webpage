// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = path.join(__dirname, "data", "flights.db"); // Store DB in data/ subdirectory

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

const initializeDb = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS flights (
            id TEXT PRIMARY KEY,
            airline TEXT,
            origin TEXT,
            destination TEXT,
            departure_time TEXT,
            arrival_time TEXT,
            price REAL,
            seats_available INTEGER,
            date TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating flights table", err.message);
            } else {
                // Seed data only if table is empty (or freshly created)
                db.get("SELECT COUNT(*) as count FROM flights", (err, row) => {
                    if (row && row.count === 0) {
                        seedFlights();
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flight_id TEXT,
            num_passengers INTEGER,
            total_price REAL,
            booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (flight_id) REFERENCES flights(id)
        )`, (err) => {
            if (err) console.error("Error creating bookings table", err.message);
        });
    });
};

const seedFlights = () => {
    const flightsData = [
        { id: 'FL101', airline: 'SkyHigh Airlines', origin: 'New York', destination: 'London', departureTime: '10:00 AM', arrivalTime: '10:00 PM', price: 600, seatsAvailable: 150, date: '2024-09-15' },
        { id: 'FL102', airline: 'SkyHigh Airlines', origin: 'New York', destination: 'London', departureTime: '08:00 PM', arrivalTime: '08:00 AM', price: 650, seatsAvailable: 10, date: '2024-09-15' },
        { id: 'FL203', airline: 'Connect Airways', origin: 'London', destination: 'Paris', departureTime: '02:00 PM', arrivalTime: '03:30 PM', price: 150, seatsAvailable: 5, date: '2024-09-16' },
        { id: 'FL304', airline: 'BudgetFly', origin: 'New York', destination: 'Chicago', departureTime: '07:00 AM', arrivalTime: '09:00 AM', price: 200, seatsAvailable: 75, date: '2024-09-15' },
        { id: 'FL405', airline: 'SkyHigh Airlines', origin: 'Paris', destination: 'New York', departureTime: '11:00 AM', arrivalTime: '02:00 PM', price: 700, seatsAvailable: 20, date: '2024-09-17' },
        { id: 'FL500', airline: 'FutureFly', origin: 'Tokyo', destination: 'Singapore', departureTime: '09:00 AM', arrivalTime: '03:00 PM', price: 450, seatsAvailable: 100, date: '2024-10-01' },
        { id: 'FL501', airline: 'FutureFly', origin: 'Tokyo', destination: 'Singapore', departureTime: '09:00 PM', arrivalTime: '03:00 AM', price: 420, seatsAvailable: 80, date: '2024-10-01' },
    ];

    const stmt = db.prepare("INSERT INTO flights VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    flightsData.forEach(flight => {
        stmt.run(flight.id, flight.airline, flight.origin, flight.destination, flight.departureTime, flight.arrivalTime, flight.price, flight.seatsAvailable, flight.date);
    });
    stmt.finalize((err) => {
        if (err) console.error("Error seeding flights", err.message);
        else console.log("Flights seeded successfully.");
    });
};

module.exports = db;
