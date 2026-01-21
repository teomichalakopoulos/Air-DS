<?php
//Cancels a reservation by ID
include 'air_ds.php';

$id = intval($_POST['id']);
$sql = "DELETE FROM reservations WHERE id=$id";
if ($conn->query($sql) === TRUE) {
    echo "OK";
} else {
    echo "ERROR: " . $conn->error;
}
$conn->close();
?>