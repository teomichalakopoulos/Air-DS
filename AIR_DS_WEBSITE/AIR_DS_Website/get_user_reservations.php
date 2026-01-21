<?php
include 'air_ds.php';
// Gets user reservations based on user name and surname

$user_name = $conn->real_escape_string($_GET['user_name']);
$user_surname = $conn->real_escape_string($_GET['user_surname']);

$result = $conn->query("SELECT * FROM reservations WHERE user_name='$user_name' AND user_surname='$user_surname' ORDER BY flight_date DESC");
$reservations = [];
while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}
header('Content-Type: application/json');
echo json_encode($reservations);
$conn->close();
?>