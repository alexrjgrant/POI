<?php
header("Content-type: application/json"); //Set to type JSON 

$N = $_GET["n"];
$E = $_GET["e"];
$S = $_GET["s"];
$W = $_GET["w"];

 include 'snippets/conn.php';//Connect to database

$select = $conn->query("SELECT * FROM pointsofinterest WHERE lat < $N and lat > $S and lon < $E and lon > $W "); //Run select

$results = $select -> fetchAll(PDO::FETCH_ASSOC); //Convert Returned Results To Associative Array

if($results) //If Search Finds Data
{
    echo json_encode($results); //Return Data To Requesting Page As JSON
}


?>