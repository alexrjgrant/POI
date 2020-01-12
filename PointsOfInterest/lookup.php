<?php

header("Content-type: application/json"); //Set to type JSON 

if ($_SERVER['REQUEST_METHOD'] !== 'GET') //Check for correct method
{
    header("HTTP/1.1 405 Method Not Allowed"); //Return 405
    exit('Invalid Request'); //Exit
}

$R = htmlentities($_GET["r"]); //GET Inputs As HTML Ents (XSS Protection)
$T = htmlentities($_GET["t"]);


if(strlen($R . $T) > 100) //Limit Length of input
{
    header("HTTP/1.1 414 URI Too Long"); //Return 414
    exit("Input Too Long");
}


if($R or $T) //If one or both inputs contain data
{
     include 'snippets/conn.php'; //Connect to database
    
    
    if($R and $T) //If one or both inputs contain data
    {
        $select = $conn->query("SELECT * FROM pointsofinterest WHERE type = '$T' AND region = '$R'"); //Run select
    }
    elseif($R) //If only Region contains data
    {
        $select = $conn->query("SELECT * FROM pointsofinterest WHERE region = '$R'");
    }
    elseif($T) //If only Type contains data
    {
        $select = $conn->query("SELECT * FROM pointsofinterest WHERE type = '$T'");
    }
    
    
    $results = $select -> fetchAll(PDO::FETCH_ASSOC); //Convert Returned Results To Associative Array
    
    if($results) //If Search Finds Data
    {
        echo json_encode($results); //Return Data To Requesting Page As JSON
    }
    else //No Data Found
    {
        header("HTTP/1.1 404 Not Found"); //Return 404 Not Found
    }
}
else //No data in variables
{
    header("HTTP/1.1 400 Bad Request"); //Return 400 Bad Request 
}

?>