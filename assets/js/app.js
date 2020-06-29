
var svgHeight = 600;
var svgWidth = 1200;

var margin = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 50
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
    
    var xScale = d3.scaleLinear().domain([d3.min(censusData, d=>d.poverty)-3, d3.max(censusData, d=>d.poverty)]).range([0,width]);

    var yScale = d3.scaleLinear().domain([d3.min(censusData,d=>d.healthcare)-3, d3.max(censusData,d=>d.healthcare)]).range([height,0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    
    chartGroup.append("g").call(leftAxis).attr("stroke","green");

    chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis).attr("stroke","red");

    var textGroup = chartGroup.selectAll("circle").data(censusData).enter().append("text").attr("x",d=>xScale(d.poverty)-8).attr("y",d=>yScale(d.healthcare)+6).attr("font-size","16px").attr("fill","black")
    .html(d=>d.abbr);

    var circleGroup = chartGroup.selectAll("circle").data(censusData).enter().append("circle").attr("cx",d=>xScale(d.poverty)).attr("cy",d=>yScale(d.healthcare))
    .attr("r","15").attr("fill","blue").attr("opacity","0.5");

    var toolTip = d3.select("body").append("div").attr("class","d3-tip");

    circleGroup.on("mouseover", function(d){
        toolTip.style("display","block").style("position","absolute").style("left",d3.event.pageX+"px").style("background","orange").style("top",d3.event.pageY+"px").html(`State:${d.state}<br>Poverty ratio: ${d.poverty} <br> Healthcare ratio: ${d.healthcare}`)
    })
    .on("mouseout", function(){
        toolTip.style("display","none")
    });
    

   chartGroup.append("text").attr("transform",`translate(${width/2},${height+margin.top-10})`).attr("text-anchor","middle").attr("font-size","16px").attr("fill","black").text("Poverty Ratio (%)");

   chartGroup.append("text").attr("transform","rotate(-90)").attr("x",0 - (height /2)).attr("y",0-margin.left).attr("dy","1em").attr("class","axisText").text("Healthcover ratio(%)");
    
}).catch(function(error){
    console.log(error);
});
    