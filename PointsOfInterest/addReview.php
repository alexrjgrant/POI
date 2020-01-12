<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') //Check for correct method
{
    header("HTTP/1.1 405 Method Not Allowed"); //return 405
    exit('Invalid Request'); //Exit
}

$ID     = $_POST["id"]; //Retrieve input
$review = $_POST["review"];

if(strlen($review) > 1000) //Linit Length of Review
{
     header("HTTP/1.1 414 URI Too Long"); //Return 414 
     exit('Invalid Request'); //Exit
}

if((is_numeric($ID)) and ($ID > 0) and strlen($review)>0)  //Is ID a number / 1 or more
{
     include 'snippets/conn.php';//Connect to DB

    $Select = $conn->query("SELECT * FROM pointsofinterest WHERE id=$ID"); //Search For matching ID
    $POI  = $Select->fetch(); //Returned Results
    
    if($POI) // Does ID exist
    {
        $Insert = $conn->prepare("INSERT INTO poi_reviews (poi_id,review) VALUES (:id, :r)"); //Prepare Insert
        
        $Insert->bindParam(":id", $ID); //Assign name places
        $Insert->bindParam(":r", $review);

        $Insert->execute(); //Run Insert
    }
    else
    {
        header("HTTP/1.1 404 Not Found"); //Return 404 / no matching ID
         exit('Not Found'); //Exit
    }
}
else
{
    header("HTTP/1.1 400 Bad Request"); //Return 400 Bad input
     exit('Invalid Request'); //Exit
}

?>
