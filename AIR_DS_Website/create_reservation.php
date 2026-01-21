<?php
include 'air_ds.php';

$data = json_decode(file_get_contents('php://input'), true);

$user_id = intval($data['user_id']);
$user_name = $conn->real_escape_string($data['user_name']);
$user_surname = $conn->real_escape_string($data['user_surname']);
$flight_departure = $conn->real_escape_string($data['flight_departure']);
$flight_arrival = $conn->real_escape_string($data['flight_arrival']);
$flight_date = $conn->real_escape_string($data['flight_date']);
$seats = $conn->real_escape_string($data['seats']);
$passenger_names = $conn->real_escape_string($data['passenger_names']);
$airport_taxes = floatval($data['airport_taxes']);
$seat_cost = floatval($data['seat_cost']);
$total_cost = floatval($data['total_cost']);

$sql = "INSERT INTO reservations 
    (user_id, user_name, user_surname, flight_departure, flight_arrival, flight_date, seats, passenger_names, airport_taxes, seat_cost, total_cost)
    VALUES ($user_id, '$user_name', '$user_surname', '$flight_departure', '$flight_arrival', '$flight_date', '$seats', '$passenger_names', $airport_taxes, $seat_cost, $total_cost)";

if ($conn->query($sql) === TRUE) {
    echo "OK";
} else {
    echo "ERROR: " . $conn->error;
}
$conn->close();
?>