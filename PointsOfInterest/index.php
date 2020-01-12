<html lang="en"><!--Index Page--> 

    <head>
        <link rel='stylesheet' type='text/css' href='css/leaflet.css' />
        <link rel="stylesheet" type="text/css" href="css/main.css"><!--Includes CSS File-->
        <script type='text/javascript' src='js/js.js'></script>

        <script type='text/javascript' src='js/leaflet.js'></script>

    </head> 

    <body onload="init()"><!--.-->

        <div id = "wrapper"><!--Body Wrapper-->

            <header><!--Header Page Top-->

                <h1 id = "title">PointsOfInterest</h1> <!--Website Title-->

            </header><!--Header Page Top-->   

            <main> 

                <div id = "mh">
                    <h4 id = "main_heading">Search By Region</h4> <!--Main heading-->
                </div>
                
                <br/>

                <div id = "search">
                    <input id = "r" name="r">  <div id = "q"> </div>  
                    <input id = "submit" name = "submit" type="submit">
                </div>
                
                <br/>
                
                <div id ="error"></div>

                <div id="map1" style="width:800px; height:600px"> </div>
               
                <br/>

                <table id ="op">
                    <tr>
                        <td>Show all POIs in frame</td>
                        <td><input id = "Auto" type="submit" value="Turn ON"> </td>
                    </tr>
                    <tr>
                        <td>Track GPS Location</td>
                        <td><input id = "GPS" type="submit" value="Turn ON"></td>
                    </tr>
                </table>

                <br/>
                
                <div id = "returndiv"></div> 

                <br/><br/>
            </main>  
        </div><!--Body Wrapper-->
    </body><!--body-->
</html><!--Index Page-->