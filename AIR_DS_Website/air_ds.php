<?php
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "air_ds";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Σφάλμα σύνδεσης: " . $conn->connect_error);
}
?>