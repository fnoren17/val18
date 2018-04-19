var width = 360,
  height = 600;

var projection = d3.geoMercator().scale(1000).translate([-160,1700]);
var path = d3.geoPath().projection(projection);
var svg = d3.select("#map").append("svg");

var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .styles({"opacity": 0,"height": "auto"});

d3.json("sweden.topo.json", function(error, data) {
    if (error) throw error;
 svg.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.states).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("d", path)
        .on("click", stateClicked)
        .on("mouseover", stateMouseover);
});


function stateMouseover(state){
    div.html(state.properties.name);
}

function stateClicked(state){
    d3.selectAll("g#kommuner").remove();
    console.log(state.properties.name);
    d3.json("kommun.json", function(error, data) {
    if (error) throw error;
 svg.append("g")
        .attr("id", "kommuner")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.kommuner).features)
        .enter()
        .append("path")
        .filter(function(d){return d.properties.state == state.properties.name;})
        .attr("id", function(d) { return d.id; })
        .attr("class", function(d){return d.properties.state;})
        .attr("d", path)
        .on("click", function(d){d3.selectAll("g#kommuner").remove();});
});
}

