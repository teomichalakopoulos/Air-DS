document.addEventListener('DOMContentLoaded', function() {
    // Έλεγχος κατάστασης σύνδεσης (π.χ. από localStorage/sessionStorage)
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // ή false αν δεν υπάρχει

    const loginLogoutLink = document.getElementById('login-logout-link');
    if (loginLogoutLink) {
        if (isLoggedIn) {
            loginLogoutLink.textContent = 'Logout';
            loginLogoutLink.href = '#';
            loginLogoutLink.onclick = function(e) {
                e.preventDefault();
                // Κάνε logout 
                sessionStorage.setItem('isLoggedIn', 'false');
                window.location.href = 'login.html';
            };
        } else {
            loginLogoutLink.textContent = 'Login';
            loginLogoutLink.href = 'login.html';
            loginLogoutLink.onclick = null;
        }
    }

    // Show/hide booking form and login message
    const bookingForm = document.getElementById('bookingForm');
    const loginMsg = document.getElementById('loginMsg');
    const bookBtn = document.getElementById('bookBtn');

    if (bookingForm && loginMsg && bookBtn) {
        if (isLoggedIn) {
            bookingForm.style.display = '';
            loginMsg.style.display = 'none';
            bookBtn.disabled = false;
        } else {
            bookingForm.style.display = '';
            loginMsg.style.display = '';
            bookBtn.disabled = true;
        }
    }

    // Hide "Σύνδεση / Εγγραφή" link if logged in
    const loginRegisterLink = document.getElementById('login-register-link');
    if (loginRegisterLink) {
        loginRegisterLink.style.display = isLoggedIn ? 'none' : '';
    }

    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1); // tomorrow
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
    // Burger menu functionality
    const burgerBtn = document.getElementById('burger-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    if (burgerBtn && navbarMenu && menuOverlay) {
        burgerBtn.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
        // Hide menu if overlay is clicked
        menuOverlay.addEventListener('click', function() {
            navbarMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    //Load airports into the select elements
    function loadAirports() {
        const departureSelect = document.getElementById('departure');
        const arrivalSelect = document.getElementById('arrival');
        if (departureSelect && arrivalSelect) {
            fetch('get_airports.php')
                .then(response => response.text())
                .then(options => {
                    departureSelect.innerHTML = '<option value="">Επιλέξτε...</option>' + options;
                    arrivalSelect.innerHTML = '<option value="">Επιλέξτε...</option>' + options;

                    // Add event listener for departure change
                    departureSelect.addEventListener('change', function() {
                        const selectedValue = this.value;
                        // Reset arrival selection and enable all options first
                        arrivalSelect.selectedIndex = 0;
                        Array.from(arrivalSelect.options).forEach(opt => opt.disabled = false);
                        // Disable the selected departure airport in arrival
                        if (selectedValue) {
                            Array.from(arrivalSelect.options).forEach(opt => {
                                if (opt.value === selectedValue) {
                                    opt.disabled = true;
                                }
                            });
                        }
                    });
                });
        }
    }
    loadAirports();

    // Restrict access to book_flight.html if not logged in
    if (window.location.pathname.endsWith('book_flight.html')) {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }

    // Pass Flight Data from Home to Book Flight
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (sessionStorage.getItem('isLoggedIn') !== 'true') return;
            const departure = document.getElementById('departure').value;
            const arrival = document.getElementById('arrival').value;
            const date = document.getElementById('date').value;
            const passengers = document.getElementById('passengers').value;
            window.location.href = `book_flight.html?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}&passengers=${encodeURIComponent(passengers)}`;
        });
    }

    // Only run on book_flight.html
    if (window.location.pathname.endsWith('book_flight.html')){

        // Restrict access to logged-in users
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        // Get flight data from URL
        const params = new URLSearchParams(window.location.search);
        const departure = params.get('departure');
        const arrival = params.get('arrival');
        const date = params.get('date');
        const passengers = parseInt(params.get('passengers'), 10) || 1;

        // Get user info from sessionStorage (set these on login)
        const userName = sessionStorage.getItem('userName') || 'Όνομα';
        const userSurname = sessionStorage.getItem('userSurname') || 'Επώνυμο';

        // Fill in flight summary (optional)
        const summaryDiv = document.getElementById('flightSummary');
        if (summaryDiv) {
            summaryDiv.innerHTML = `
                <b>Αναχώρηση:</b> ${departure} <br>
                <b>Άφιξη:</b> ${arrival} <br>
                <b>Ημερομηνία:</b> ${date} <br>
                <b>Επιβάτες:</b> ${passengers}
            `;
        }

        // Render passenger fields
        const passengerFields = document.getElementById('passengerFields');
        if (passengerFields) {
            passengerFields.innerHTML = '';
            for (let i = 0; i < passengers; i++) {
                if (i === 0) {
                    passengerFields.innerHTML += `
                    <div>
                        <label>Όνομα (κύριου χρήστη)</label>
                        <input type="text" value="${userName}" readonly>
                        <label>Επώνυμο (κύριου χρήστη)</label>
                        <input type="text" value="${userSurname}" readonly>
                    </div>`;
                } else {
                    passengerFields.innerHTML += `
                    <div>
                        <label>Όνομα (${i+1}ος επιβάτης)</label>
                        <input type="text" name="name${i}" minlength="3" maxlength="20" pattern="^[A-Za-zΑ-Ωα-ωάέήίόύώϊϋΐΰ]{3,20}$" required>
                        <label>Επώνυμο (${i+1}ος επιβάτης)</label>
                        <input type="text" name="surname${i}" minlength="3" maxlength="20" pattern="^[A-Za-zΑ-Ωα-ωάέήίόύώϊϋΐΰ]{3,20}$" required>
                    </div>`;
                }
            }
        }

        // Handle passenger form submission

        // Show seat map when button is clicked
        const showSeatsBtn = document.getElementById('showSeatsBtn');
        if (showSeatsBtn && passengerForm) {
            showSeatsBtn.addEventListener('click', function() {
                // Validate all passenger fields
                let valid = true;
                const inputs = passengerForm.querySelectorAll('input[required]');
                inputs.forEach(input => {
                    if (!input.value.match(/^[A-Za-zΑ-Ωα-ωάέήίόύώϊϋΐΰ]{3,20}$/)) {
                        input.style.border = '2px solid red';
                        valid = false;
                    } else {
                        input.style.border = '';
                    }
                });
                if (!valid) {
                    alert('Συμπληρώστε σωστά όλα τα ονόματα και επώνυμα (μόνο γράμματα, 3-20 χαρακτήρες).');
                    return;
                }
                // Show seat map, seat costs and disable button
                document.getElementById('seat-legend').style.display = '';
                renderSeatMap(passengers);
                showSeatsBtn.disabled = true;
            });
        }
        
        function isSmallScreen() {
            return window.innerWidth <= 1100;
        }
        
        function fetchReservedSeats(departure, arrival, date, callback) {
            fetch(`get_reserved_seats.php?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${encodeURIComponent(date)}`)
                .then(res => res.json())
                .then(seats => callback(seats));
        }
        
        // Seat Map Rendering and Selection
        function renderSeatMap(passengerCount) {
            // Fetch reserved seats for this flight/date
            fetchReservedSeats(departure, arrival, date, function(reservedSeats) {
                const seatMapDiv = document.getElementById('seatMap');
                const seatSection = document.getElementById('seat-section');
                if (!seatMapDiv) return;
                seatMapDiv.innerHTML = '';
                seatMapDiv.style.display = '';

                // Background activation
                if (seatSection) seatSection.classList.add('active');

                const rows = 31;
                // Order: F, E, D, [number], C, B, A
                const seatLetters = ['F', 'E', 'D','', 'C', 'B', 'A'];

                let selectedSeats = [];

                // Create table for seat map
                const table = document.createElement('table');
                table.className = 'seat-map-table seat-map-centered';
                
                // Table body: 7 rows (F, E, D, [number], C, B, A)
                const tbody = document.createElement('tbody');


                for (let seatIdx = 0; seatIdx < 7; seatIdx++) {
                    const tr = document.createElement('tr');
                    // First column: seat letter or empty for row number
                    let label = '';
                    if (seatIdx < 3) label = seatLetters[seatIdx];
                    else if (seatIdx === 3) label = ''; // Row number will be in this row
                    else label = seatLetters[seatIdx];

                    const th = document.createElement('th');
                    th.textContent = label;
                    tr.appendChild(th);

                    for (let row = 1; row <= rows; row++) {
                        const td = document.createElement('td');
                        if (seatIdx === 3) {
                            // Middle row: show row number
                            td.textContent = row;
                            td.className = 'seat-row-number';
                        } else {
                            // Seat rows: show seat button (without showing the letter)
                            let seatLetter = seatLetters[seatIdx];
                            const seatId = `${row}${seatLetter}`;
                            const seatBtn = document.createElement('button');
                            seatBtn.type = 'button';
                            seatBtn.className = 'seat-btn';
                            seatBtn.dataset.seat = seatId;

                            // Seat Pricing
                            let price = 0;
                            if ([1, 11, 12].includes(row)) price = 20;
                            else if (row >= 2 && row <= 10) price = 10;

                            seatBtn.title = `Θέση ${seatId} (${price > 0 ? price + '€' : 'Δωρεάν'})`;

                            // Unavailable seat
                            if (reservedSeats.includes(seatId)) {
                                seatBtn.disabled = true;
                                seatBtn.style.background = '#d32f2f';
                            } else if ([1, 11, 12].includes(row)) {
                                seatBtn.style.background = '#e3f2fd'; // Light blue for rows 1, 11, 12
                            } else if (row >= 2 && row <= 10) {
                                seatBtn.style.background = '#90caf9'; // Darker blue for rows 2-10
                            } else {
                                seatBtn.style.background = '#fff'; // White for all other rows
                            }

                            // Seat selection logic
                            seatBtn.addEventListener('click', function() {
                                if (selectedSeats.includes(seatId)) {
                                    selectedSeats = selectedSeats.filter(s => s !== seatId);
                                    if ([1, 11, 12].includes(row)) {
                                        seatBtn.style.background = '#e3f2fd'; // Light blue
                                    } else if (row >= 2 && row <= 10) {
                                        seatBtn.style.background = '#90caf9'; // Darker blue
                                    } else {
                                        seatBtn.style.background = '#fff'; // White
                                    }
                                } else if (selectedSeats.length < passengerCount) {
                                    selectedSeats.push(seatId);
                                    seatBtn.style.background = '#0078d4';
                                }
                                // Deselect if over limit (it doesn't normally occur due to the button being disabled)
                                if (selectedSeats.length > passengerCount) {
                                    selectedSeats.shift();
                                    // Reset all buttons
                                    seatMapDiv.querySelectorAll('.seat-btn').forEach(btn => {
                                        if (!selectedSeats.includes(btn.dataset.seat) && !btn.disabled) {
                                            // Get the row number from the seat id (e.g., "5A" -> 5)
                                            const btnSeatId = btn.dataset.seat;                  //Gets the value of the data-seat attribute from the button element 
                                            const btnRow = parseInt(btnSeatId.match(/^\d+/)[0], 10); //converts seat ID to integer row number
                                            if ([1, 11, 12].includes(btnRow)) {
                                                btn.style.background = '#e3f2fd';
                                            } else if (btnRow >= 2 && btnRow <= 10) {
                                                btn.style.background = '#90caf9';
                                            } else {
                                                btn.style.background = '#fff';
                                            }
                                        }
                                    });
                                    // Highlight selected
                                    selectedSeats.forEach(sel => {
                                        const btn = seatMapDiv.querySelector(`button[data-seat="${sel}"]`);
                                        if (btn) btn.style.background = '#0078d4';
                                    });
                                }
                                // Always update summary
                                showSummary(selectedSeats);
                            });

                            td.appendChild(seatBtn);
                        }
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
                const scrollDiv = document.createElement('div');
                scrollDiv.className = 'table-scroll';
                scrollDiv.appendChild(table);
                seatMapDiv.appendChild(scrollDiv);

                // Show summary initially (in case of 0 selected)
                showSummary(selectedSeats);
            });
        }

        let airportsData = {};

        function fetchAirportsData(callback) {
        fetch('get_airports_data.php')
            .then(res => res.json())
            .then(data => {
                airportsData = data;
                if (callback) callback();
            });
        }

        function haversine(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const toRad = deg => deg * Math.PI / 180;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.asin(Math.sqrt(a));
            return R * c;
        }


        // Show summary and cost
        function showSummary(seats) {
            fetchAirportsData(function(){});
            const summaryDiv = document.getElementById('summary');
            if (!summaryDiv) return;
            summaryDiv.style.display = '';

            // Get airport data from loaded airportsData
            const dep = airportsData[departure];
            const arr = airportsData[arrival];

            let taxes = 0, distance = 0, flightCost = 0;
            if (dep && arr) {
                taxes = (dep.tax || 0) + (arr.tax || 0);
                distance = haversine(dep.lat, dep.lon, arr.lat, arr.lon);
                flightCost = distance / 10;
            }

            // Υπολογισμός συνολικού κόστους θέσεων
            let seatCost = 0;
            seats.forEach(seat => {
                const row = parseInt(seat.match(/^\d+/)[0], 10);
                if ([1, 11, 12].includes(row)) seatCost += 20;
                else if (row >= 2 && row <= 10) seatCost += 10;
            });

            // Κόστος εισιτηρίου για έναν επιβάτη
            const ticketCost = taxes + flightCost + (seatCost / (seats.length || 1));
            // Τελικό κόστος για όλους τους επιβάτες
            const totalCost = passengers * ticketCost;

            // Update summary μόνο όταν εχουν επιλεχθεί όλες οι θέσεις
            summaryDiv.innerHTML = `
                ${seats.length === passengers ? '<h3>Σύνοψη Κράτησης</h3>' : ''}
                ${seats.length === passengers ? '<b>Επιλεγμένες θέσεις:</b> ' + (seats.length > 0 ? seats.join(', ') : 'Καμία') + '<br>' : ''}
                ${seats.length === passengers ? '<b>Πτήση:</b> ' + departure + ' → ' + arrival + ' (' + date + ')<br>' : ''}
                ${seats.length === passengers ? '<b>Επιβάτες:</b> ' + passengers + '<br>' : ''}
                ${seats.length === passengers ? '<b>Τελικό Κόστος:</b>' + totalCost.toFixed(2) + '€' : ''}
                <br><br>
                ${seats.length === passengers ? '<button id="finalBookBtn">Κράτηση</button>' : '<span style="color:#888;">Επιλέξτε όλες τις θέσεις για να συνεχίσετε</span>'}
            `;
            if (seats.length === passengers) {
                document.getElementById('finalBookBtn').onclick = function() {
                    // Collect passenger names
                    const passengerInputs = document.querySelectorAll('#passengerFields input[name^="name"], #passengerFields input[name^="surname"]');
                    let passengerNamesArr = [];

                    // Always add the main user as the first passenger
                    passengerNamesArr.push({
                        name: userName,
                        surname: userSurname
                    });
                    

                    // Add additional passengers (if any)
                    for (let i = 0; i < passengerInputs.length; i += 2) {
                        passengerNamesArr.push({
                            name: passengerInputs[i].value,
                            surname: passengerInputs[i+1].value
                        });
                    }

                    // Prepare reservation data
                    const reservationData = {
                        user_id: 1, // Replace with actual user_id from session if available
                        user_name: userName,
                        user_surname: userSurname,
                        flight_departure: departure,
                        flight_arrival: arrival,
                        flight_date: date,
                        seats: seats.join(','),
                        passenger_names: JSON.stringify(passengerNamesArr),
                        airport_taxes: taxes,
                        seat_cost: seatCost,
                        total_cost: totalCost
                    };

                    fetch('create_reservation.php', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(reservationData)
                    })
                    .then(res => res.text())
                    .then(response => {
                        if (response.trim() === "OK") {
                            alert('Η κράτηση ολοκληρώθηκε!');
                            window.location.href = 'mytrips.html';
                        } else {
                            alert('Σφάλμα κράτησης: ' + response);
                        }
                    });
                };
            }
        }
    }

    // Only run on mytrips.html
    if (window.location.pathname.endsWith('mytrips.html')){

        // Check if user is logged in
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        userName = sessionStorage.getItem('userName') || '';
        userSurname = sessionStorage.getItem('userSurname') || '';

        // Fetch reservations for this user
        fetch('get_user_reservations.php?user_name=' + encodeURIComponent(userName) + '&user_surname=' + encodeURIComponent(userSurname))
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('mytrips-tbody');
                const noTrips = document.getElementById('no-trips');
                tbody.innerHTML = '';
                if (!data || data.length === 0) {
                    noTrips.style.display = '';
                    return;
                }
                noTrips.style.display = 'none';
                const today = new Date();
                data.forEach(res => {
                    // Parse passenger names
                    let passengers = '';
                    try {
                        const arr = JSON.parse(res.passenger_names);
                        passengers = arr.map(p => `${p.name} ${p.surname}`).join('<br>');
                    } catch {
                        passengers = res.passenger_names;
                    }
                    // Check if cancellation is allowed (flight at least 30 days in the future)
                    const flightDate = new Date(res.flight_date);
                    const diffDays = Math.floor((flightDate - today) / (1000 * 60 * 60 * 24));
                    const canCancel = diffDays >= 30;
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${res.flight_departure}</td>
                        <td>${res.flight_arrival}</td>
                        <td>${res.flight_date}</td>
                        <td>${res.seats}</td>
                        <td>${passengers}</td>
                        <td>${Number(res.airport_taxes).toFixed(2)}€</td>
                        <td>${Number(res.seat_cost).toFixed(2)}€</td>
                        <td>${Number(res.total_cost).toFixed(2)}€</td>
                        <td>
                            <button class="cancel-btn" data-id="${res.id}" ${canCancel ? '' : 'disabled'}>${canCancel ? 'Ακύρωση' : 'Δεν ακυρώνεται'}</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                // Add event listeners for cancel buttons
                document.querySelectorAll('.cancel-btn:not([disabled])').forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (!confirm('Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτή την κράτηση;')) return;
                        const id = this.getAttribute('data-id');
                        fetch('cancel_reservation.php', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            body: 'id=' + encodeURIComponent(id)
                        })
                        .then(res => res.text())
                        .then(response => {
                            if (response.trim() === "OK") {
                                alert('Η κράτηση ακυρώθηκε.');
                                location.reload();
                            } else {
                                alert('Σφάλμα ακύρωσης: ' + response);
                            }
                        });
                    });
                });
            })
        .catch(err => {
            console.error('Fetch error:', err);
            document.getElementById('no-trips').style.display = '';
        });
    }
});



// Login or Registration visible
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('register-error').textContent = '';
}
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('login-error').textContent = '';
}

// Functions to validate form inputs
function validateName(name) {
    return /^[A-Za-zΑ-Ωα-ωάέήίόύώϊϋΐΰ]+$/.test(name);
}
function validateUsername(username) {
    return username.length > 0;
}
function validatePassword(password) {
    return password.length >= 4 && password.length <= 10 && /\d/.test(password);
}
function validateEmail(email) {
    return email.includes('@');
}

// Registration function
function register() {
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value.trim();

    let error = '';
    if (!validateName(name)) error += 'Το όνομα πρέπει να περιέχει μόνο χαρακτήρες.<br>';
    if (!validateName(surname)) error += 'Το επώνυμο πρέπει να περιέχει μόνο χαρακτήρες.<br>';
    if (!validateUsername(username)) error += 'Το όνομα χρήστη δεν μπορεί να είναι κενό.<br>';
    if (!validatePassword(password)) error += 'Ο κωδικός πρέπει να έχει 4-10 χαρακτήρες και τουλάχιστον έναν αριθμό.<br>';
    if (!validateEmail(email)) error += 'Το e-mail δεν είναι έγκυρο.<br>';

    document.getElementById('register-error').innerHTML = error;
    if (error) return;

    // AJAX αίτημα προς το register.php
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "register.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if (xhr.responseText.trim() === "OK") {
            alert('Η εγγραφή ολοκληρώθηκε! Μπορείτε να συνδεθείτε.');
            showLogin();
        } else {
            document.getElementById('register-error').innerHTML = xhr.responseText;
        }
    };
    xhr.send(
        "name=" + encodeURIComponent(name) +
        "&surname=" + encodeURIComponent(surname) +
        "&username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password) +
        "&email=" + encodeURIComponent(email)
    );
}

// Login function
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        document.getElementById('login-error').textContent = 'Συμπληρώστε όλα τα πεδία.';
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "login.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        let response;
        try {
            response = JSON.parse(xhr.responseText);
        } catch {
            document.getElementById('login-error').textContent = 'Σφάλμα διακομιστή.';
            return;
        }
        if (response.status === "OK") {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userName', response.name);
            sessionStorage.setItem('userSurname', response.surname);
            window.location.href = "index.html";
        } else {
            document.getElementById('login-error').textContent = response.message;
        }
    };
    xhr.send(
        "username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password)
    );
}
