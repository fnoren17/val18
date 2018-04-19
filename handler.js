var width = 360,
  height = 600;
var projection = d3.geo.mercator().scale(1000).translate([-160,1700]);
var path = d3.geo.path().projection(projection);
var svg = d3.select("#container").append("svg");

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
        .on("click", clicked);
});


function clicked(state){
    d3.json("kommun.json", function(error, data) {
    if (error) throw error;
 svg.append("g")
        .attr("id", "kommuner")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.kommuner).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("class", function(d){return d.properties.state;})
        .attr("d", path)
        .on("click", function(d){console.log(d.properties.name)});

});



}