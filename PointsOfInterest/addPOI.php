<?php

////////////// ONLY ALLOW POST REQUESTS ////////////// 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') 
{
    header("HTTP/1.1 405 Method Not Allowed");
    exit('Invalid Request');
}

////////////// READ INPUTS / SET VARIABLES ////////////// 
$lon     = htmlentities($_POST["lon"]);
$lat     = htmlentities($_POST["lat"]);
$name    = htmlentities($_POST["name"]);
$type    = htmlentities($_POST["type"]);
$region  = htmlentities($_POST["region"]);
$country = htmlentities($_POST["country"]);
$desc    = htmlentities($_POST["description"]);

$infoArray = array($name,$type,$region,$country,$desc);
$l = 0;

for($i = 0 ; $i < count($infoArray) ; $i++)
{
    $l = $l + strlen($infoArray[$i]);
    
    if($l > 2000) //limit total input length
    {
         header("HTTP/1.1 414 URI Too Long"); //Return 414 
        exit();
    }
}

////////////// CHECK COORDERNATES INPUT //////////////

if(is_numeric($lat) && is_numeric($lon)) //Is data numeric
{
    if($lat <  -90 and $lat > 90 and
       $lon < -180 and $lon > 180) //Are coords in range
    {
        header("HTTP/1.1 400 Bad Request");
        exit();
    }
}
else
{
    header("HTTP/1.1 400 Bad Request");
    exit();
}


////////////// CHECK INFORMATION INPUT //////////////

for ($i = 0; $i < count($infoArray); $i++) //Loop Text Inputs
{    
    if($infoArray[$i] == null || empty($infoArray[$i]) || is_null($infoArray[$i])  ) //Contains data
    {
        header("HTTP/1.1 400 Bad Request");
        exit();
    }
    if(strlen($infoArray[$i]) > 255 && $i <= 3) //string length < 255 (ex. Description)
    {
         header("HTTP/1.1 414 URI Too Long"); //Return 414 
        exit();
    }
}
if(strlen($infoArray[4]) > 500) //Limits Description length
{
  header("HTTP/1.1 414 URI Too Long"); //Return 414
    exit();
}

////////////// IF ALL CONDITIONS MET //////////////

    include 'snippets/conn.php';
        

$statement = $conn->prepare("INSERT INTO pointsofinterest 
                    (  name,  type,  country,  region,  lon,  lat,  description)
             VALUES ( :name, :type, :country, :region, :lon, :lat, :desc)");

$statement->bindParam(":name", $name);
$statement->bindParam(":type", $type);
$statement->bindParam(":region", $region);
$statement->bindParam(":country", $country);
$statement->bindParam(":desc", $desc);
$statement->bindParam(":lon", $lon);
$statement->bindParam(":lat", $lat);

$statement->execute();
 

?>