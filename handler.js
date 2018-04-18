var m_width = $("#map").width(),
        width = 938,
        height = 500,
        country,
        state;

    var projection = d3.geo.mercator()
        .translate([width / 2.5, height*3.05 ])
        .scale(900);
        
    var path = d3.geo.path()
        .projection(projection);
    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", width)
        .attr("height", width * height / width);
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);
    var g = svg.append("g");

    d3.json("sweden.topo.json", function(error, us) {
      g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("d", path)
        .on("click", clicked);
    });
function clicked(d){
    console.log(d.properties.name);
}
    $(window).resize(function() {
      var w = $("#map").width();
      svg.attr("width", w);
      svg.attr("height", w * height / width);
    });