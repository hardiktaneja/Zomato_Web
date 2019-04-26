var express = require("express"),
    app = express(),
    bodyparser= require("body-parser"),
    request = require("request");
app.use(bodyparser.urlencoded({extended : true}));

app.use(express.static("public"));

var options = {
     
    url : "https://developers.zomato.com/api/v2.1/",
    headers : {
         "user-key"	: "efbd3de5a051ee1f02931aa581493f5f"
     }
};

app.get("/",function(req, res) {
    res.render("search.ejs");
})

app.get("/restaurants",function(req,res){
    var options = {
     
    url : "https://developers.zomato.com/api/v2.1/",
    headers : {
         "user-key"	: "efbd3de5a051ee1f02931aa581493f5f"
     }
};
    console.log(req.query.search);
    var cityName = req.query.search;
    
    var cityArray = cityName.split(" ");
    var cityAdd = cityArray[0];
    if(cityArray.length>1){
        for(var i =1;i<cityArray.length;i++){
            cityAdd = cityAdd+"%20"+cityArray[i]
        }
    }
    
    var ans= new Array();
    options.url = options.url + "locations?query="+cityAdd;
    
    request(options,function(error, response, body) {
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            
            ans.push(data["location_suggestions"][0]["entity_id"])
            ans.push(data["location_suggestions"][0]["entity_type"])
            
            // res.send(ans);
            options.url = "https://developers.zomato.com/api/v2.1/search?entity_id="+ ans[0]+ "&entity_type="+ans[1]+"&sort=rating&order=desc";
            request(options,function(error2,response2,mainBody){
                if(!error2 && response2.statusCode==200){
                    var newdata = JSON.parse(mainBody);
                    res.render("results.ejs",{data:newdata});
                }
                else{
                    console.log(error2);
                    res.send("Error Occured");
                }
            });
            
        }
        else{
            ans.push(0)
            ans.push(0)
            console.log(error)
            console.log("EERRRRRRRRRRRR")
            return ans

        }
    })
});



 

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Blog app has started!") ;
});