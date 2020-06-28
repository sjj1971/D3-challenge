// @TODO: YOUR CODE HERE!
var svgHeight = 600;
var svgWidth = 900;
var margin = {
    top:50,
    left:50,
    right:50,
    bottom:50
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg").attr("height",svgHeight).attr("width",svgWidth);
var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

d3.csv("./assets/data/data.csv").then(function(censusData){
    censusData.forEach(function(data){
        data.age = parseFloat(data.age);
        data.ageMoe = parseFloat(data.ageMoe);
        data.healthcare = parseFloat(data.healthcare);
        data.healthcareHigh = parseFloat(data.healthcareHigh);
        data.healthcareLow = parseFloat(data.healthcareLow);
        data.id = parseInt(data.id);
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = parseFloat(data.obesity);
        data.obesityHigh = parseFloat(data.obesityHigh);
        data.obesityLow = parseFloat(data.obesityLow);
        data.poverty = parseFloat(data.poverty);
        data.povertyMoe = parseFloat(data.povertyMoe);
        data.smokes = parseFloat(data.smokes);
        data.smokesHigh = parseFloat(data.smokesHigh);
        data.smokesLow = parseFloat(data.smokesLow);             
    });
    
    console.log(censusData);
    console.log(d3.max(censusData, d=>d.poverty));
    console.log(d3.max(censusData, d=>d.healthcare));
    
    var xScale = d3.scaleLinear().domain([d3.min(censusData, d=>d.poverty), d3.max(censusData, d=>d.poverty)]).range([0,width]);
    var yScale = d3.scaleLinear().domain([d3.min(censusData,d=>d.healthcare), d3.max(censusData,d=>d.healthcare)]).range([height,0]);
    console.log(xScale);
    console.log(yScale);
    
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    
   chartGroup.append("g").call(leftAxis).attr("stroke","green");
   chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis).attr("stroke","red");
//
//   var line = d3.line().x(d=>xScale(d.poverty)).y(d=>yScale(d.healthcare)); 
//   chartGroup.append("path").attr("d",line(censusData)).attr("fill","none").attr("stroke","none").text("hi");
    
    censusData.forEach(d=>console.log(d.id));
//  
    var textGroup = chartGroup.selectAll("circle").data(censusData).enter().append("text").attr("x",d=>xScale(d.poverty)-8).attr("y",d=>yScale(d.healthcare)+6).attr("font-size","16px").attr("fill","black").html(d=>d.abbr);

    var circleGroup = chartGroup.selectAll("circle").data(censusData).enter().append("circle").attr("cx",d=>xScale(d.poverty)).attr("cy",d=>yScale(d.healthcare)).attr("r","20").attr("fill","blue").attr("opacity","0.5");

 

//    {
//        return (`${d.}`)
//    });
//   
    
});
