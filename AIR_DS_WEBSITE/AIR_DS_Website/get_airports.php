<?php
include 'air_ds.php';

$result = $conn->query("SELECT code, name FROM airports ORDER BY name ASC");
$options = "";
while ($row = $result->fetch_assoc()) {
    $options .= '<option value="' . htmlspecialchars($row['code']) . '">' . htmlspecialchars($row['name']) . ' (' . htmlspecialchars($row['code']) . ')</option>';
}
echo $options;
$conn->close();
?>