<?php
ob_start();

include("database.php");

$target_dir = "uploads/";

$parent_uniq_id = uniqid(mt_rand(), true);
$child_uniq_id = uniqid(mt_rand(), true);


$error = false;
// Using self Join concept here

foreach ($_FILES as $file) {
	$file_name = $file["name"];
	if($file_name == "original"){
		$target_file = $target_dir . basename($file_name) .'_'. $parent_uniq_id . '.png';
		if (move_uploaded_file($file["tmp_name"], $target_file)) {
			$sql = "insert into images(uniq_id, parent_id, type) values('".$parent_uniq_id."',null, '".$file_name."')";
		}
		
	} else {
	    $target_file = $target_dir . basename($file_name) .'_'. $parent_uniq_id . '.png';
		if (move_uploaded_file($file["tmp_name"], $target_file)) {
			$sql = "insert into images(uniq_id, parent_id, type) values('".$child_uniq_id."','".$parent_uniq_id."', '".$file_name."')";
		}
	}

	if ($conn->query($sql) === TRUE) {
		// different possibilities can be handled here
	}
	else{
		$error = true;	
	}
}

$response = array("error"=>$error);
echo json_encode($response);