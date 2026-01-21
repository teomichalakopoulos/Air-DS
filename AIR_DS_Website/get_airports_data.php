<?php
include 'air_ds.php';

$result = $conn->query("SELECT code, tax, latitude, longitude FROM airports");
$airports = [];
while ($row = $result->fetch_assoc()) {
    $airports[$row['code']] = [
        'tax' => (float)$row['tax'],
        'lat' => (float)$row['latitude'],
        'lon' => (float)$row['longitude']
    ];
}
header('Content-Type: application/json');
echo json_encode($airports);
$conn->close();
?>