<html lang="en"><!--Index Page--> 

 <head>
     <link rel="stylesheet" type="text/css" href="css/main.css">
 </head> 
    
    <body><!--.-->
 
        <div id = "wrapper"><!--Body Wrapper-->
        
<header><!--Header Page Top-->
    
    <h1 id = "title">VisitHampshire</h1> <!--Website Title-->
    
</header><!--Header Page Top-->   
            
            <main> 
                 
                <div id = "mh">
                    <h4 id = "main_heading">Search By Type</h4> <!--Main heading-->
                </div>
                
                <div id = "d1">
                <form action="index.php" method="GET"> 
                        <input name="t" id = "rIN">
                        <input id = "submit" type="submit">    
                </form>
                 </div>  
                    
                <div id = "returndiv">
                
                    
                    <?php

$ID     = $_POST["id"];
$review = $_POST["review"];

                    
$connection = curl_init();

curl_setopt($connection, CURLOPT_URL, "https://edward2.solent.ac.uk/~wad1816/Project/PointsOfInterest/addReview.php");

$data = 
    ["id"     => $ID ,
	 "review" => $review];

curl_setopt($connection,CURLOPT_RETURNTRANSFER,1);
curl_setopt($connection,CURLOPT_POSTFIELDS,$data);

$response = curl_exec($connection);

$httpCode = curl_getinfo($connection,CURLINFO_HTTP_CODE);

curl_close($connection);

//http code reactions

if($httpCode == 200)
{
    echo "<p id = 'res'>Review Successful</p>";
}
elseif($httpCode == 400)
{
    echo "<p id = 'res'>Please Add Text Before Submitting</p>";
}
elseif($httpCode == 414)
{
    echo "<p id = 'res'>Input Too Long - Please Revise</p>";
}
elseif($httpCode == 404)
{
    echo "<p id = 'res'>Invalid Point of Interest ID - Please Try Again</p>";
}
elseif($httpCode == 405)
{
    echo "<p id = 'res'>Wrong Method Used - POST ONLY</p>";
}
else
{
    echo "<p id = 'res'>ERROR $httpCode</p>";
}

?>
                    
                
                </div> 
               
                <br/><br/><!--Image-->
            </main>  
        </div><!--Body Wrapper-->
    </body><!--body-->
</html><!--Index Page-->
