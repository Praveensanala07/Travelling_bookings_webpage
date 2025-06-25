document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api'; 
    const searchForm = document.getElementById('search-form');
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const departureDateInput = document.getElementById('departure-date');
    const flightResultsDiv = document.getElementById('flight-results');
    const bookingDetailsSection = document.getElementById('booking-details-section');
    const selectedFlightInfoDiv = document.getElementById('selected-flight-info');
    const numPassengersInput = document.getElementById('num-passengers');
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    const cancelBookingBtn = document.getElementById('cancel-booking-btn');
    const bookingConfirmationMessageDiv = document.getElementById('booking-confirmation-message');
    const confirmationSection = document.getElementById('confirmation-section');
    const searchLoader = document.getElementById('search-loader');
    const bookingLoader = document.getElementById('booking-loader');
    const searchBtn = document.getElementById('search-btn');

    let currentSelectedFlight = null; 
    let currentFlightList = [];
    function displayFlights(flights) {
        currentFlightList = flights; // Store for later updates
        flightResultsDiv.innerHTML = '';
        bookingConfirmationMessageDiv.innerHTML = '';
        confirmationSection.style.display = 'none';
        bookingDetailsSection.style.display = 'none';

        if (flights.length === 0) {
            flightResultsDiv.innerHTML = '<p>No flights found matching your criteria.</p>';
            return;
        }

        flights.forEach(flight => {
            const flightElement = document.createElement('div');
            flightElement.classList.add('flight-item');
            flightElement.setAttribute('id', `flight-item-${flight.id}`); // For easy update
            flightElement.innerHTML = `
                <p><strong>Flight ID:</strong> ${flight.id}</p>
                <p><strong>Airline:</strong> ${flight.airline}</p>
                <p><strong>Origin:</strong> ${flight.origin}</p>
                <p><strong>Destination:</strong> ${flight.destination}</p>
                <p><strong>Departure:</strong> ${flight.departure_time} | <strong>Arrival:</strong> ${flight.arrival_time}</p>
                <p><strong>Price:</strong> $${flight.price}</p>
                <p><strong>Seats Available:</strong> <span id="seats-${flight.id}">${flight.seats_available}</span></p>
                <button class="book-now-btn" data-flight-id="${flight.id}" ${flight.seats_available === 0 ? 'disabled' : ''}>
                    ${flight.seats_available === 0 ? 'Sold Out' : 'Book Now'}
                </button>
            `;
            flightResultsDiv.appendChild(flightElement);
        });

        document.querySelectorAll('.book-now-btn').forEach(button => {
            button.addEventListener('click', handleSelectFlightForBooking);
        });
    }

    async function handleSearch(event) {
        event.preventDefault();
        const origin = originInput.value.trim();
        const destination = destinationInput.value.trim();
        const departureDate = departureDateInput.value;

        if (!origin || !destination || !departureDate) {
            alert('Please fill in all search fields.');
            return;
        }

        flightResultsDiv.innerHTML = '<p>Searching for flights...</p>';
        searchLoader.style.display = 'block';
        searchBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${departureDate}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayFlights(data.flights);
        } catch (error) {
            console.error("Search error:", error);
            flightResultsDiv.innerHTML = `<p class="error">Error fetching flights: ${error.message}</p>`;
        } finally {
            searchLoader.style.display = 'none';
            searchBtn.disabled = false;
        }
    }

    function handleSelectFlightForBooking(event) {
        const flightId = event.target.dataset.flightId;
        currentSelectedFlight = currentFlightList.find(f => f.id === flightId);

        if (currentSelectedFlight) {
            selectedFlightInfoDiv.innerHTML = `
                <p><strong>Flight:</strong> ${currentSelectedFlight.id} (${currentSelectedFlight.airline})</p>
                <p><strong>Route:</strong> ${currentSelectedFlight.origin} to ${currentSelectedFlight.destination}</p>
                <p><strong>Price per seat:</strong> $${currentSelectedFlight.price}</p>
            `;
            numPassengersInput.value = 1;
            numPassengersInput.max = currentSelectedFlight.seats_available;
            bookingDetailsSection.style.display = 'block';
            flightResultsDiv.style.display = 'none';
            confirmationSection.style.display = 'none';
        }
    }

    async function handleConfirmBooking() {
        if (!currentSelectedFlight) return;

        const numSeatsToBook = parseInt(numPassengersInput.value);
        if (numSeatsToBook <= 0 || numSeatsToBook > currentSelectedFlight.seats_available) {
            displayBookingMessage(`Invalid number of passengers. Available: ${currentSelectedFlight.seats_available}`, 'error');
            return;
        }

        bookingLoader.style.display = 'block';
        confirmBookingBtn.disabled = true;
        cancelBookingBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flightId: currentSelectedFlight.id, numPassengers: numSeatsToBook })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            }

            // Booking successful
            displayBookingMessage(
                `<strong>${result.message}</strong><br>
                 Flight ID: ${result.flight.id}<br>
                 Passengers: ${result.numPassengers}<br>
                 Total Price: $${result.totalPrice}<br>
                 Thank you for booking with SkyHigh!`,
                'success'
            );

            // Update the UI for the specific flight in the list
            const seatCountSpan = document.getElementById(`seats-${result.flight.id}`);
            const bookButton = document.querySelector(`.book-now-btn[data-flight-id="${result.flight.id}"]`);
            
            if (seatCountSpan) seatCountSpan.textContent = result.flight.seats_available;
            if (bookButton) {
                if (result.flight.seats_available === 0) {
                    bookButton.textContent = 'Sold Out';
                    bookButton.disabled = true;
                } else {
                    bookButton.disabled = false;
                }
            }
            // Update currentFlightList
            const flightIndex = currentFlightList.findIndex(f => f.id === result.flight.id);
            if (flightIndex > -1) {
                currentFlightList[flightIndex].seats_available = result.flight.seats_available;
            }


        } catch (error) {
            console.error("Booking error:", error);
            displayBookingMessage(`Booking Failed: ${error.message}`, 'error');
        } finally {
            bookingLoader.style.display = 'none';
            confirmBookingBtn.disabled = false;
            cancelBookingBtn.disabled = false;
            bookingDetailsSection.style.display = 'none';
            flightResultsDiv.style.display = 'block';
            currentSelectedFlight = null;
        }
    }

    function displayBookingMessage(message, type) {
        bookingConfirmationMessageDiv.innerHTML = `<p class="${type}">${message}</p>`;
        bookingConfirmationMessageDiv.className = type; 
        confirmationSection.style.display = 'block';
    }

    function handleCancelBooking() {
        bookingDetailsSection.style.display = 'none';
        flightResultsDiv.style.display = 'block';
        currentSelectedFlight = null;
        confirmationSection.style.display = 'none';
    }

    // --- Event Listeners ---
    searchForm.addEventListener('submit', handleSearch);
    confirmBookingBtn.addEventListener('click', handleConfirmBooking);
    cancelBookingBtn.addEventListener('click', handleCancelBooking);

    // Set min date for date picker to today
    const today = new Date().toISOString().split('T')[0];
    departureDateInput.setAttribute('min', today);
    departureDateInput.value = today; // Pre-fill today's date
});
