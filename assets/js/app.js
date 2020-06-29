
var svgHeight = 600;
var svgWidth = 1200;

var margin = {
    top: 20,
    left: 100,
    right: 40,
    bottom: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg").attr("height",svgHeight).attr("width",svgWidth);

var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

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
    
    var xlabelsGroup = chartGroup.append("g").attr("transform",`translate(${width/2},${height+20})`);
    
    var Povertylabel = xlabelsGroup.append("text").attr("x",0).attr("y",20).attr("value", "poverty").classed("active",true).text("Poverty Ratio (%)");
    
    var Agelabel = xlabelsGroup.append("text").attr("x",0).attr("y",40).attr("value", "age").classed("inactive",true).text("Age (Median)");

    var Incomelabel = xlabelsGroup.append("text").attr("x",0).attr("y",60).attr("value", "income").classed("inactive",true).text("Household Income (Median)");
    
    var ylabelsGroup = chartGroup.append("g").attr("transform","rotate(-90)").attr("dy","1em").attr("class","axisText");
    
    var Healthlabel = ylabelsGroup.append("text").attr("y",0-margin.left+60).attr("x",0 - (height /2)).attr("value","healthcare").classed("active",true).text("Healthcare Ratio (%)");
    
    var Smokeslabel = ylabelsGroup.append("text").attr("y",0-margin.left+40).attr("x",0 - (height /2)).attr("value","smokes").classed("inactive",true).text("Smokes Ratio (%)");
    
    var Obeselabel = ylabelsGroup.append("text").attr("y",0-margin.left+20).attr("x",0 - (height /2)).attr("value","obesity").classed("inactive",true).text("Obesity Ratio (%)");
    
    var xScale = d3.scaleLinear().domain([d3.min(censusData, d=>d[chosenXAxis])*0.9, d3.max(censusData, d=>d[chosenXAxis]*1.1)]).range([0,width]);
    
    var yScale = d3.scaleLinear().domain([d3.min(censusData,d=>d[chosenYAxis])*0.9, d3.max(censusData,d=>d[chosenYAxis]*1.1)]).range([height,0]);

    var bottomAxis = d3.axisBottom(xScale);
    
    var leftAxis = d3.axisLeft(yScale);
    
    var xAxis = chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis).attr("stroke","red");
    
    var yAxis = chartGroup.append("g").call(leftAxis).attr("stroke","green");
    
    var textGroup = chartGroup.selectAll("circle").data(censusData).enter().append("text").attr("x",d=>xScale(d[chosenXAxis])).attr("y",d=>yScale(d[chosenYAxis])).attr("font-size","16px").attr("fill","black").html(d=>d.abbr);

    var circleGroup = chartGroup.selectAll("circle").data(censusData).enter().append("circle").attr("cx",d=>xScale(d[chosenXAxis])).attr("cy",d=>yScale(d[chosenYAxis])).attr("r","15").attr("fill","blue").attr("opacity","0.5");

    xlabelsGroup.selectAll("text").on("click",function(){
        var xAxisvalue = d3.select(this).attr("value");
        if (xAxisvalue != chosenXAxis){
            chosenXAxis = xAxisvalue;
            console.log(chosenXAxis);
            
            xScale = d3.scaleLinear().domain([d3.min(censusData, d=>d[chosenXAxis])*0.9, d3.max(censusData, d=>d[chosenXAxis]*1.1)]).range([0,width]);
            bottomAxis = d3.axisBottom(xScale);
            
            xAxis = xAxis.call(bottomAxis);
            
            textGroup = textGroup.attr("x",d=>xScale(d[chosenXAxis]));
            
            circleGroup = circleGroup.attr("cx",d=>xScale(d[chosenXAxis]));
            
            if (chosenXAxis === "poverty"){
                Povertylabel.classed("active",true).classed("inactive",false);
                Agelabel.classed("active",false).classed("inactive",true);
                Incomelabel.classed("active",false).classed("inactive",true);
            } else if (chosenXAxis === "age"){
                Agelabel.classed("active",true).classed("inactive",false);
                Povertylabel.classed("inactive",true).classed("active",false);
                Incomelabel.classed("inactive",true).classed("active",false);
            } else if (chosenXAxis === "income") {
                Incomelabel.classed("active",true).classed("inactive",false);
                Povertylabel.classed("active",false).classed("inactive",true);
                Agelabel.classed("active",false).classed("inactive",true);
            };  
        };
    });
    
    ylabelsGroup.selectAll("text").on("click",function(){
        var yAxisvalue = d3.select(this).attr("value");
        if (yAxisvalue != chosenYAxis){
            chosenYAxis = yAxisvalue;
            console.log(chosenYAxis);
            
            yScale = d3.scaleLinear().domain([d3.min(censusData,d=>d[chosenYAxis])*0.9, d3.max(censusData,d=>d[chosenYAxis]*1.1)]).range([height,0]);
            
            leftAxis = d3.axisLeft(yScale);
            
            yAxis = yAxis.call(leftAxis);
            
            textGroup = textGroup.attr("y",d=>yScale(d[chosenYAxis]));
            
            circleGroup = circleGroup.attr("cy",d=>yScale(d[chosenYAxis]));

            
            if (chosenYAxis === "healthcare"){
                Healthlabel.classed("active",true).classed("inactive",false);
                Smokeslabel.classed("inactive",true).classed("active",false);
                Obeselabel.classed("inactive",true).classed("active",false);
            } else if (chosenYAxis === "smokes"){
                Smokeslabel.classed("active",true).classed("inactive",false);
                Healthlabel.classed("inactive",true).classed("active",false);
                Obeselabel.classed("inactive",true).classed("active",false);
                
            } else if (chosenYAxis ==="obesity"){
                Obeselabel.classed("active",true).classed("inactive",false);
                Smokeslabel.classed("inactive",true).classed("active",false);
                Healthlabel.classed("inactive",true).classed("active",false);
            };  
        };
    });
    
    var toolTip = d3.select("body").append("div").classed("d3-tip",true);

    circleGroup.on("mouseover", function(d){
        toolTip.style("display","block").style("position","absolute").style("left",d3.event.pageX+"px").style("background","orange").style("top",d3.event.pageY+"px").html(`State: ${d.state}<hr>${chosenXAxis} value: ${d[chosenXAxis]} <br> ${chosenYAxis} value: ${d[chosenYAxis]}`)
    })
    .on("mouseout", function(){
        toolTip.style("display","none")
    });
    
    
}).catch(function(error){
    console.log(error);
});
    