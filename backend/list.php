<?php
	include("database.php");
	$sql = "SELECT * FROM images WHERE parent_id IS NULL";
	$result = $conn->query($sql);

	while($row = $result->fetch_array()) {
		$myArray[] = $row;
    }
    echo json_encode($myArray);
?>