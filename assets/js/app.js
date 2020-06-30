// svg height and width
var svgHeight = 600;
var svgWidth = 900;
// define margin for chartGroup
var margin = {
    top: 20,
    left: 100,
    right: 40,
    bottom: 80
};

//calculate of actual figure width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Append an SVG group
var svg = d3.select("#scatter").append("svg").attr("height",svgHeight).attr("width",svgWidth);

//Append an chartGroup
var chartGroup = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

//define default parameter for xAxis and yAxis
var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

//function used for updating xScale when a data set for xAxis is changed.
function xScale(censusData,chosenXAxis){
    var xLinearScale = d3.scaleLinear().domain( [d3.min(censusData, d=>d[chosenXAxis])*0.9,d3.max(censusData, d=>d[chosenXAxis]*1.1)
    ]).range([0,width]);

    return xLinearScale;
};

//function used for updating yScale when a data set for yAxis is changed.
function yScale(censusData,chosenYAxis){
    var yLinearScale = d3.scaleLinear().domain( [d3.min(censusData, d=>d[chosenYAxis])*0.9, d3.max(censusData, d=>d[chosenYAxis]*1.1)
    ]).range([height,0]);

    return yLinearScale;
};

//function used for updating xAxis based on updated xScale 
function renderXAxis(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
};
//function used for updating yAxis based on updated yScale 
function renderYAxis(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
};

// function used for updating circlesGroup based on updated x/y Axis and Scale
function renderCircles(axistype, circlesGroup, newScale, chosenAxis){
    if(axistype ==="x"){
        circlesGroup.transition()
        .duration(1000)
        .attr("cx",d=>newScale(d[chosenAxis]));
    } else if (axistype === "y"){
        circlesGroup.transition()
        .duration(1000)
        .attr("cy",d=>newScale(d[chosenAxis]));
    };

    return circlesGroup;
};

// function used for updating textGroup based on updated x/y Axis and Scale
function renderTexts(axistype, textGroup, newScale, chosenAxis){
    if(axistype ==="x"){
        textGroup.transition()
        .duration(1000)
        .attr("x",d=>newScale(d[chosenAxis]));
    } else if(axistype === "y"){
        textGroup.transition()
        .duration(1000)
        .attr("y",d=>newScale(d[chosenAxis])+6);
    };

    return textGroup;
};

//Retrieve data from CSV file
d3.csv("./assets/data/data.csv").then(function(censusData){

    //convert strind to correct data type
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
    
    //create group for xAxis labels (Poverty, Age, Income)
    var xlabelsGroup = chartGroup.append("g").attr("transform",`translate(${width/2},${height+20})`);
    
    var Povertylabel = xlabelsGroup.append("text").attr("x",0).attr("y",20).attr("value", "poverty").classed("active",true).text("In Poverty(%)");
    
    var Agelabel = xlabelsGroup.append("text").attr("x",0).attr("y",40).attr("value", "age").classed("inactive",true).text("Age(Median)");

    var Incomelabel = xlabelsGroup.append("text").attr("x",0).attr("y",60).attr("value", "income").classed("inactive",true).text("Household Income(Median) $");

    //create group for yAxis labels (Health, Smokes, Obese)
    var ylabelsGroup = chartGroup.append("g").attr("transform","rotate(-90)").attr("dy","1em").attr("class","axisText");
    
    var Healthlabel = ylabelsGroup.append("text").attr("y",0-margin.left+60).attr("x",0 - (height /2)).attr("value","healthcare").classed("active",true).text("Lacks Healthcare(%)");
    
    var Smokeslabel = ylabelsGroup.append("text").attr("y",0-margin.left+40).attr("x",0 - (height /2)).attr("value","smokes").classed("inactive",true).text("Smokes(%)");
    
    var Obeselabel = ylabelsGroup.append("text").attr("y",0-margin.left+20).attr("x",0 - (height /2)).attr("value","obesity").classed("inactive",true).text("Obese(%)");

    //initialize xScale and xAxis
    var xLinearScale = xScale(censusData, chosenXAxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var xAxis = chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis);

    //initialize yScale and yAxis
    var yLinearScale = yScale(censusData, chosenYAxis);
    var leftAxis = d3.axisLeft(yLinearScale);
    var yAxis = chartGroup.append("g").call(leftAxis);
    
    //append initial text group
    var textGroup = chartGroup.selectAll("circle").data(censusData).enter().append("text").attr("x",d=>xLinearScale(d[chosenXAxis])).attr("y",d=>yLinearScale(d[chosenYAxis])+6).attr("text-anchor","middle").attr("font-size","16px").attr("fill","black").html(d=>d.abbr);

    //append initial circles group
    var circlesGroup = chartGroup.selectAll("circle").data(censusData).enter().append("circle").attr("cx",d=>xLinearScale(d[chosenXAxis])).attr("cy",d=>yLinearScale(d[chosenYAxis])).attr("r","15").attr("fill","pink").attr("opacity","0.5");

    //x axis labels event listener
    xlabelsGroup.selectAll("text").on("click",function(){    
        //get value of selection
        var xAxisvalue = d3.select(this).attr("value");

        if (xAxisvalue != chosenXAxis){
            //replace chosen xAxis with value       
            chosenXAxis = xAxisvalue;
            console.log(chosenXAxis);
            //update xscale for new data
            xLinearScale = xScale(censusData, chosenXAxis);
            //update xAxis with transition
            xAxis = renderXAxis(xLinearScale, xAxis);
            //update texts with new x values
            textGroup = renderTexts("x", textGroup, xLinearScale, chosenXAxis);
            //update circle with new x values
            circlesGroup = renderCircles("x", circlesGroup, xLinearScale, chosenXAxis);
            //change classes to change bold text
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

    //y axis labels event listener
    ylabelsGroup.selectAll("text").on("click",function(){
        //get values of selection
        var yAxisvalue = d3.select(this).attr("value");

        if (yAxisvalue != chosenYAxis){
            //replace chosen yAxis with value
            chosenYAxis = yAxisvalue;
            console.log(chosenYAxis);
            //update yscale for new data
            yLinearScale = yScale(censusData, chosenYAxis);
            //update yAxis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);
            //update texts with new y values
            textGroup = renderTexts("y", textGroup, yLinearScale, chosenYAxis);
            //update circle with new y values
            circlesGroup = renderCircles("y", circlesGroup, yLinearScale, chosenYAxis);
            //change classes to change bold text
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
    //define toolTip with d3-tip class
    var toolTip = d3.select("body").append("div").classed("d3-tip",true);
    //updates tooltips with new info
    circlesGroup.on("mouseover", function(d){
        d3.select(this).transition().duration(200).attr("r","25").attr("fill","purple");
        toolTip.style("display","block").style("position","absolute").style("left",`${d3.event.pageX+20}px`).style("top",`${d3.event.pageY+20}px`).html(`${d.state}<hr>${chosenXAxis}: ${d[chosenXAxis]} <br> ${chosenYAxis}: ${d[chosenYAxis]}`)
    })
    .on("mouseout", function(){
        d3.select(this).transition().duration(100).attr("r","15").attr("fill","pink");
        toolTip.style("display","none")
    });   
}).catch(function(error){
    console.log(error);
});
    