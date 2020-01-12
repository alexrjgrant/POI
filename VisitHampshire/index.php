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
                    
            if(count($_GET) > 0)
            {
                $T = $_GET["t"];
                
                $R ="#NOINPUTDETECTED#";
                
                if($T)
                {  
                    $R = "hampshire";
                }
                
                
                // Initialise the cURL connection
                $connection = curl_init();

                // Specify the URL
                curl_setopt($connection, CURLOPT_URL, "https://edward2.solent.ac.uk/~wad1816/Project/PointsOfInterest/lookup.php?t=".$T."&r=".$R);

                // This option ensures that the HTTP response is *returned* from curl_exec(),
                // (see below) rather than being output to screen.  
                curl_setopt($connection,CURLOPT_RETURNTRANSFER,1);

                // Do not include the HTTP header in the response.
                curl_setopt($connection,CURLOPT_HEADER, 0);

                // Actually connect to the remote URL. The response is 
                // returned from curl_exec() and placed in $response.
                $response = curl_exec($connection);

                $httpCode = curl_getinfo($connection,CURLINFO_HTTP_CODE); 

                // Close the connection.
                curl_close($connection);

                //decode json
                $data = json_decode($response, true);


                //on error
                //http code reactions
                if($httpCode == 404)
                {
                    echo "No POIs found";
                }
                elseif($httpCode == 200)
                {
                     echo "<p id = 'res'><strong> POI's Avalible To Review </strong></p><br/><br/>";
                }
                elseif($httpCode == 400)
                {
                    echo "Add text before submitting";
                }
                elseif($httpCode == 414)
                {
                    echo "Search Length Exceeded, Try Again";
                }
                else
                {
                    echo "Help! The service sent back $httpCode, which I do not understand!";
                }

                //echo info

               
                for($i=0; $i<count($data); $i++)
                {
                    echo "<b>Name : </b>" . $data[$i]["name"] . " " . "<br/>" .  
                         "<b>Type : </b>" . $data[$i]["type"] . " " . "<br/>" .
                         "<b>Country : </b>" . $data[$i]["country"] . " " . "<br/>" .
                         "<b>Region : </b>" . $data[$i]["region"] . " " . "<br/><br/>" .
                         "<b>LAT/LON : </b>" . $data[$i]["lat"] . "/". $data[$i]['lon']. " " . "<br/><br/>" . 
                         "<b>Desciption : </b>" . $data[$i]["description"] . "<br/><br/>"; 

                         $ID = $data[$i]["ID"];
                    
                  echo "<form method='POST' action='uploadReview.php'>
                        
                <b>Review</b> <input name='review' id = 'rIN'>
                       <input  type = 'hidden' name='id' value = '$ID'>
                
                    <input id = 'submit' type='submit'>       
                    
                     </form>
                     
                     <hr><br>";
                    
                }
            }
            ?>
                
                
                
                
                </div> 
               
                <br/><br/><!--Image-->
            </main>  
        </div><!--Body Wrapper-->
    </body><!--body-->
</html><!--Index Page-->