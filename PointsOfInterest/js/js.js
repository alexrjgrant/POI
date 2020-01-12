var map;
var beerICON;
var restICON;
var townICON;
var cityICON;
var miscICON;
var AUTO = false;
var GPS = false;

/////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////INITIALISE/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function init()
{
    /////////////MAP INIT///////////////
    ////////////////////////////////////
    
    map = L.map ("map1");

    var attrib   = "Map data copyright OpenStreetMap contributors, Open Database Licence";
    var layerURL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"; 
    L.tileLayer(layerURL,{attribution: attrib}).addTo(map);
    
    map.setView([50.9137026,-1.4124373], 14); //Set Default XYZ 
    
    
    ///////////////////ICON SETTINGS/////////////////////
    /////////////////////////////////////////////////////
    var S = 30;
    beerICON = L.icon
    ({
        iconUrl: 'img/Beer.png',

        iconSize:     [S,S],
        iconAnchor:   [(S/2),(S/2)], 
        popupAnchor:  [-3, -20]
    });
    restICON = L.icon
    ({
        iconUrl: 'img/Rest.png',

        iconSize:     [S,S],
        iconAnchor:   [(S/2),(S/2)], 
        popupAnchor:  [-3, -20]
    });
    townICON = L.icon
    ({
        iconUrl: 'img/Town.png',

        iconSize:     [S,S],
        iconAnchor:   [(S/2),(S/2)], 
        popupAnchor:  [-3, -20]
    });
    cityICON = L.icon
    ({
        iconUrl: 'img/City.png',

        iconSize:     [S,S],
        iconAnchor:   [(S/2),(S/2)], 
        popupAnchor:  [-3, -20]
    });
    miscICON = L.icon
    ({
        iconUrl: 'img/miscICON.png',

        iconSize:     [S,S],
        iconAnchor:   [(S/2),0], 
        popupAnchor:  [-3, -20]
    });
    
    ////////////////////////Event Listeners///////////////////////////
    //////////////////////////////////////////////////////////////////
    
    
    /////////////Search database///////////////
    document.getElementById("submit").addEventListener("click",() =>
    {
        var region = document.getElementById('r').value;
        var type   = "";
        var URLlookup = "lookup.php?r="+region+"&t="+type;
        
        HTTP_GET(URLlookup).then(JSON.parse).then(displayPOIs).catch(handleError); //Promise String   
    });
    
    ///////////////Key Press/////////////////
    var input = document.getElementById('r');

   input.addEventListener ("keyup", (e) => {
    if (!e) { var e = window.event; }
    e.preventDefault();

    if (e.keyCode == 13) 
    { 
        var region = document.getElementById('r').value;
            var type   = "";
            var URLlookup = "lookup.php?r="+region+"&t="+type;
            HTTP_GET(URLlookup).then(JSON.parse).then(displayPOIs).catch(handleError); //Promise String   
    }
}, false);
    
    ////////////////ADD POI CLICK MAP//////////////////
    map.on("click", (e) => 
    {
        var name =prompt("Please Enter POI Name");
        if(name !== null)
        { 
            var region =prompt("Please Enter POI Region");
            if(region !== null)
            { 
                var country =prompt("Please Enter POI Country");
                if(country !== null)
                { 
                    var type =prompt("Please Enter POI Type");
                    if(type !== null)
                    { 
                        var desc =prompt("Please Enter POI Description");
                        if(desc !== null)
                        { 
                            var lat = e.latlng.lat;
                            var lon = e.latlng.lng;
                            var URLaddPOI = "addPOI.php";
                            HTTP_POST_AddPOI(URLaddPOI,name,region,country,type,desc,lat,lon).catch(handleError);
                            
                        }else{return;}
                    }else{return;}
                }else{return;}
            }else{return;}
        }else{return;}                    
	});
    
    /////////////Auto Add POIs To Map////////////////// 
    document.getElementById("Auto").addEventListener("click",() =>
    {
        if(AUTO)
        {
            AUTO = false;
            document.getElementById("Auto").value = "Turn ON";
            document.getElementById("Auto").style.backgroundColor = "indianred"; 
        }
        else
        {
            AUTO = true;
            document.getElementById("Auto").value = "Turn OFF";
            document.getElementById("Auto").style.backgroundColor = "mediumseagreen";
            
            var west= map.getBounds().getSouthWest().lng;
            var south= map.getBounds().getSouthWest().lat;
            var east = map.getBounds().getNorthEast().lng;
            var north= map.getBounds().getNorthEast().lat;


            var URLlookup = "dispInArea.php?n="+north+"&e="+east+"&s="+south+"&w="+west;

            HTTP_GET(URLlookup).then(JSON.parse).then(displayPOIs).catch(handleError); //Promise String
        }
    });
    
    /////////////////GPS Settings//////////////////
    document.getElementById("GPS").addEventListener("click",() =>
    {
        if(GPS)
        {
            GPS = false;
            document.getElementById("GPS").value = "Turn ON";
            document.getElementById("GPS").style.backgroundColor = "indianred"; 
            
        }
        else
        {
            GPS = true;
            document.getElementById("GPS").value = "Turn OFF";
            document.getElementById("GPS").style.backgroundColor = "mediumseagreen";
        }
    });
    
    /////////////////Add POIs on Map Move///////////////////////
    map.addEventListener("moveend",() =>
    {
        var west= map.getBounds().getSouthWest().lng;
        var south= map.getBounds().getSouthWest().lat;
        var east = map.getBounds().getNorthEast().lng;
        var north= map.getBounds().getNorthEast().lat;
        
        
        var URLlookup = "dispInArea.php?n="+north+"&e="+east+"&s="+south+"&w="+west;
        
        if(AUTO)
        {
            HTTP_GET(URLlookup).then(JSON.parse).then(displayPOIs).catch(handleError); //Promise String
        }
    });
    
    /////////////Get GPS POS///////////////
   if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition (SetMap, handleError);
        
        navigator.geolocation.watchPosition (processPosition, handleError,
                    {enableHighAccuracy:true, maximumAge: 5000 }); //Watch GPS / 5s
    }
    else
    {
        alert("Sorry, geolocation not supported in this browser"); 
    }
}
//////////////////////////////////////////////////////////////////////
///////////////////////Use GPS To Adjust Map//////////////////////////
//////////////////////////////////////////////////////////////////////

function SetMap(gpspos){map.setView([gpspos.coords.latitude,gpspos.coords.longitude],17);}

function processPosition(gpspos)
{
    if(GPS)
    {
        map.setView([gpspos.coords.latitude,gpspos.coords.longitude],map.getZoom());
    }
}


///////////////////////////////////////////////////////////////////////
/////////////////////////////Handle Errors/////////////////////////////
///////////////////////////////////////////////////////////////////////

function handleError(error)
{    
    removeItem("ErrorMsg");
    
    var Err = document.getElementById("error");

    var message = "";
    
    var p = document.createElement("P");
    p.setAttribute("id", "ErrorMsg");
   
    if(error == 400)
    {
        message = "Error (Bad Input Format) - Please Check Input And Try Again";
    }
    if(error == 404)
    { 
        message = "Error (No Results Found) - Edit Input And Try Again";
    }
     if(error == 414)
    {
        message = "Error (Length Exceeded) - Edit Input And Try Again";
    }
    if(error == 405)
    {
        message = "Error (Wrong Method) - Search Using GET Method Only";
    }
    
    var m = document.createTextNode(message);
    p.appendChild(m);
    Err.appendChild(p);
    
    document.getElementById('mh').scrollIntoView();
}

//////////////////////////////////////////////////////////////////
/////////////////////////////PROMISES/////////////////////////////
//////////////////////////////////////////////////////////////////

///////////////////////Lookup POIs//////////////////////
function HTTP_GET(url) 
{
    var p = new Promise((resolve,reject)=>
            { 
                var XHR = new XMLHttpRequest();
                XHR.open('GET', url);
        
                XHR.addEventListener("load", (e)=> 
                {              
                    if(e.target.status>=400 && e.target.status<=599)
                    {
                        reject(e.target.status); 
                    } 
                    else 
                    {
                        resolve(e.target.responseText);
                        if(e.target.status == 200)
                        {
                            removeItem("ErrorMsg");
                    
                        }
                    }
                });
                XHR.send();
            });
    return p;
}
///////////////////////Add Review//////////////////////
function HTTP_POST_AddRev(URL,ID,Review) 
{
    var p = new Promise((resolve,reject)=>
            { 
                var XHR = new XMLHttpRequest();
       
                XHR.open('POST', URL, true);
                XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                XHR.addEventListener("load", (e)=> 
                {              
                    if(e.target.status>=400 && e.target.status<=599)
                    {
                        reject(e.target.status); 
                    } 
                    else 
                    {
                        resolve(e.target.responseText);
                         
                        if(e.target.status == 200)
                            {
                                alert("Review Successful")
                                removeItem("in");
                                removeItem("btn");
                                removeItem("Rhed");
                                removeItem("limTXT");
                            }
                    }
                });
                XHR.send("id="+ID+"&review="+Review);
            });
    return p;
}
///////////////////////Add POIs/////////////////////
function HTTP_POST_AddPOI(URL,N,R,C,T,D,LAT,LON) 
{
    var p = new Promise((resolve,reject)=>
            { 
                var XHR = new XMLHttpRequest();
       
                XHR.open('POST', URL, true);
                XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                XHR.addEventListener("load", (e)=> 
                {              
                    if(e.target.status>=400 && e.target.status<=599)
                    {
                        reject(e.target.status); 
                    } 
                    else 
                    {
                        if(e.target.status == 200)
                        {
                            removeItem("ErrorMsg");
                            
                             var POP = N+" ("+T+")<br>"+
                                       R+", "+C+"<br>"+
                                       LAT+","+LON+"<br>"+
                                       D;
                            
                            if(T == "pub")
                            {
                                L.marker([LAT,LON], {icon:beerICON}).addTo(map).bindPopup(POP);
                            }
                            else if(T == "restaurant")
                            {
                                L.marker([LAT,LON], {icon:restICON }).addTo(map).bindPopup(POP);
                            }
                            else if(T == "town")
                            {
                                L.marker([LAT,LON], {icon:townICON}).addTo(map).bindPopup(POP);
                            }
                            else if(T == "city")
                            {
                                L.marker([LAT,LON], {icon:cityICON}).addTo(map).bindPopup(POP);
                            }
                            else
                            {
                                L.marker([LAT,LON], {icon:miscICON}).addTo(map).bindPopup(POP);
                            }
                        }
                        resolve(e.target.responseText);  
                    }
                });
                XHR.send("name="+N+"&region="+R+"&type="+T+"&country="+C+"&description="+D+"&lat="+LAT+"&lon="+LON);
            });
    return p;
}

//////////////////////////////////////////////////////////////////
//////////////////////////DISPLAY RESULTS/////////////////////////
//////////////////////////////////////////////////////////////////

function displayPOIs(POIs)
{
    removeItem("E");
    removeItem("table");
    removeItem("hed");
    
    ///////////////Create Review Input Header//////////////////////
    var hed = document.createElement("p");
    hed.setAttribute("id","hed"); 
    var hedTxt = document.createTextNode("Click Row To Make A Review");
    hed.appendChild(hedTxt);
    
    //////////////////Create Results Table////////////////////////
    var t  = document.createElement("TABLE");
    t.setAttribute("id", "table");
    
    
     ///////////////Create Table Row//////////////////////
    var tr = document.createElement("TR");
    
     ///////////////Add Headings To Table//////////////////////
    ["Name", "Type", "Country", "Coordernates","Description"].forEach ( heading => 
    {
        var th = document.createElement("TH");
        var textNode = document.createTextNode(heading);
        th.appendChild(textNode);
        tr.appendChild(th);
    });

     ///////////////Add Row To Table/////////////////
    t.appendChild(tr);

    /////////////////Loop Through Returned POIs/////////////////
    POIs.forEach( curPOI => 
    {
        var tr2 = document.createElement("TR");
        
        tr2.setAttribute("id", "rw");
        tr2.setAttribute("class", curPOI.ID);
        
        var varName = curPOI.name;
        var varType  = curPOI.type;
        var varCountry = curPOI.country;
        var varLATLON = curPOI.lon + " , " + curPOI.lat;
        var varDesc = curPOI.description;
        


        [varName,varType,varCountry,varLATLON,varDesc].forEach ( data => 
        {
            var td = document.createElement("TD");
            var textNode2 = document.createTextNode(data);
            td.appendChild(textNode2);
            tr2.appendChild(td);
        });
        
        ///////////////////Row Event Listener/////////////////////
        //////////////////Creates Review Popup////////////////////
        tr2.addEventListener("click",()=>
        {            
            removeItem("in");
            removeItem("btn");
            removeItem("Rhed");
            removeItem("limTXT");
            
            ////////////////Review Heading////////////////
            var Rhed = document.createElement("p");
            Rhed.setAttribute("id","Rhed"); 
            var RhedTxt = document.createTextNode("Create Review For : " + curPOI.name);
            Rhed.appendChild(RhedTxt);
            
            ///////////////Review Input//////////////////
            var inp = document.createElement("textarea");
            inp.setAttribute("id","in");
            inp.setAttribute("rows","3");
            
            //////////////Submit//////////////
            var btn = document.createElement("INPUT");
            btn.setAttribute("type","button");
            btn.setAttribute("value","Send Review");
            btn.setAttribute("id","btn");
            
            ///////////////Remaining Characters////////////////
            var len = 1000;
            var lim = document.createElement("P");
            lim.setAttribute("id","limTXT");
            var limTxt = document.createTextNode("Max Length : "+len+" Characters");
            lim.appendChild(limTxt);
            
            ///////////////Add To Page///////////////
            document.getElementById("returndiv").appendChild(Rhed);
            document.getElementById("returndiv").appendChild(inp);
            document.getElementById("returndiv").appendChild(btn);
            document.getElementById("returndiv").appendChild(lim);
            
            ///////////////Event Listener Chars Remaining/////////////////
            document.getElementById("in").addEventListener("input",()=>
            {
                var l = document.getElementById("in").value.length;
                document.getElementById("limTXT").innerHTML = "Characters Remaining: " + (len - l);
                
                if(len < 0)
                {
                     document.getElementById("limTXT").style.color = "red";
                }
                else
                {
                    document.getElementById("limTXT").style.color = "black";
                }
            });
            
            /////////////Scroll Input Into View///////////////////
            document.getElementById('in').scrollIntoView();
          
            ////////////////Event Listener Submit  Review////////////////
            btn.addEventListener("click",()=>
            {
                var Review = document.getElementById("in").value;
                
                var ID = curPOI.ID;
                var URLaddRev = "addReview.php" ;
                
                HTTP_POST_AddRev(URLaddRev,ID,Review).then(JSON.parse).catch(handleError);
                
                document.getElementById('mh').scrollIntoView();
            });
            
        });
        
        /////////////Add Row To Table
        t.appendChild(tr2);

    });
        
    /////////////Add To Page/////////////
    document.getElementById("returndiv").appendChild(hed);
    document.getElementById("returndiv").appendChild(t);    

    //////////////Add POIs To Map///////////////
    POIs.forEach( curPOI => 
    {

        var LAT = curPOI.lat;
        var LON = curPOI.lon;
        var name = curPOI.name;
        var type = curPOI.type;
        var country = curPOI.country;
        var region = curPOI.region;
        var desc = curPOI.description;
        var ID = curPOI.ID;
        
        var POP = "<strong>"+name+"</strong>"+" ("+type+")<br>"+
                    region+", "+country+"<br>"+
                    LAT+","+LON+"<br>"+
                    desc;

        if(curPOI.type == "pub")
        {
            L.marker([LAT,LON], {icon:beerICON}).addTo(map).bindPopup(POP);
        }
        else if(curPOI.type == "restaurant")
        {
            L.marker([LAT,LON], {icon:restICON }).addTo(map).bindPopup(POP);
        }
        else if(curPOI.type == "town")
        {
            L.marker([LAT,LON], {icon:townICON}).addTo(map).bindPopup(POP);
        }
        else if(curPOI.type == "city")
        {
            L.marker([LAT,LON], {icon:cityICON}).addTo(map).bindPopup(POP);
        }
        else
        {
            L.marker([LAT,LON], {icon:miscICON}).addTo(map).bindPopup(POP);
        }

    } );
}
////////Remove Element By ID Shortcut///////   
function removeItem(I)
{
    if(document.getElementById(I))
        {
            var element = document.getElementById(I);
            element.parentNode.removeChild(element);
        }
}



