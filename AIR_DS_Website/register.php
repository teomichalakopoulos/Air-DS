<?php
include 'air_ds.php'; // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $name = $_POST['name'] ?? '';
    $surname = $_POST['surname'] ?? '';
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';

    // Validate input (add more checks as needed)
    if (!$name || !$surname || !$username || !$password || !$email) {
        echo "Όλα τα πεδία είναι υποχρεωτικά.";
        exit;
    }

    // Check if username or email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo "Το username ή το email χρησιμοποιείται ήδη.";
        exit;
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, surname, username, password, email) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $surname, $username, $hashed_password, $email);
    if ($stmt->execute()) {
        echo "OK";
    } else {
        echo "Σφάλμα κατά την εγγραφή.";
    }
    $stmt->close();
    $conn->close();
} else {
    echo "Μη έγκυρη μέθοδος.";
}
?>