<?php
include 'air_ds.php';

$departure = $conn->real_escape_string($_GET['departure']);
$arrival = $conn->real_escape_string($_GET['arrival']);
$date = $conn->real_escape_string($_GET['date']);

$sql = "SELECT seats FROM reservations WHERE flight_departure='$departure' AND flight_arrival='$arrival' AND flight_date='$date'";
$result = $conn->query($sql);

$reserved = [];
while ($row = $result->fetch_assoc()) {
    $seats = explode(',', $row['seats']);
    foreach ($seats as $seat) {
        $reserved[] = trim($seat);
    }
}
echo json_encode($reserved);
?>