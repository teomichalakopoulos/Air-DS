<?php
include 'air_ds.php';
// Ελέγχουμε αν η σύνδεση στη βάση δεδομένων είναι επιτυχής
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$username || !$password) {
        echo json_encode(['status' => 'error', 'message' => 'Όλα τα πεδία είναι υποχρεωτικά.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, name, surname, password FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $name, $surname, $hashed_password);
        $stmt->fetch();
        if (password_verify($password, $hashed_password)) {
            echo json_encode(['status' => 'OK', 'name' => $name, 'surname' => $surname]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Λάθος κωδικός.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Ο χρήστης δεν βρέθηκε.']);
    }
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Μη έγκυρη μέθοδος.']);
}
?>