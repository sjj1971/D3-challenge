
var svgHeight = 600;
var svgWidth = 900;

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

function xScale(censusData,chosenXAxis){
    var xLinearScale = d3.scaleLinear().domain( [d3.min(censusData, d=>d[chosenXAxis])*0.9,d3.max(censusData, d=>d[chosenXAxis]*1.1)
    ]).range([0,width]);

    return xLinearScale;
};

function yScale(censusData,chosenYAxis){
    var yLinearScale = d3.scaleLinear().domain( [d3.min(censusData, d=>d[chosenYAxis])*0.9, d3.max(censusData, d=>d[chosenYAxis]*1.1)
    ]).range([height,0]);

    return yLinearScale;
};

function renderXAxis(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition().duration(1000).call(bottomAxis);

    return xAxis;
};

function renderYAxis(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition().duration(1000).call(leftAxis);

    return yAxis;
};

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
    
    var Povertylabel = xlabelsGroup.append("text").attr("x",0).attr("y",20).attr("value", "poverty").classed("active",true).text("In Poverty(%)");
    
    var Agelabel = xlabelsGroup.append("text").attr("x",0).attr("y",40).attr("value", "age").classed("inactive",true).text("Age(Median)");

    var Incomelabel = xlabelsGroup.append("text").attr("x",0).attr("y",60).attr("value", "income").classed("inactive",true).text("Household Income(Median) $");
    
    var ylabelsGroup = chartGroup.append("g").attr("transform","rotate(-90)").attr("dy","1em").attr("class","axisText");
    
    var Healthlabel = ylabelsGroup.append("text").attr("y",0-margin.left+60).attr("x",0 - (height /2)).attr("value","healthcare").classed("active",true).text("Lacks Healthcare(%)");
    
    var Smokeslabel = ylabelsGroup.append("text").attr("y",0-margin.left+40).attr("x",0 - (height /2)).attr("value","smokes").classed("inactive",true).text("Smokes(%)");
    
    var Obeselabel = ylabelsGroup.append("text").attr("y",0-margin.left+20).attr("x",0 - (height /2)).attr("value","obesity").classed("inactive",true).text("Obese(%)");
    
    var xLinearScale = xScale(censusData, chosenXAxis);
    
    var yLinearScale = yScale(censusData, chosenYAxis);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    
    var leftAxis = d3.axisLeft(yLinearScale);
    
    var xAxis = chartGroup.append("g").attr("transform",`translate(0,${height})`).call(bottomAxis);
    
    var yAxis = chartGroup.append("g").call(leftAxis);
    
    var textGroup = chartGroup.selectAll("circle").data(censusData).enter().append("text").attr("x",d=>xLinearScale(d[chosenXAxis])).attr("y",d=>yLinearScale(d[chosenYAxis])+6).attr("text-anchor","middle").attr("font-size","16px").attr("fill","black").html(d=>d.abbr);

    var circlesGroup = chartGroup.selectAll("circle").data(censusData).enter().append("circle").attr("cx",d=>xLinearScale(d[chosenXAxis])).attr("cy",d=>yLinearScale(d[chosenYAxis])).attr("r","15").attr("fill","pink").attr("opacity","0.5");

    xlabelsGroup.selectAll("text").on("click",function(){
        var xAxisvalue = d3.select(this).attr("value");

        if (xAxisvalue != chosenXAxis){
       
            chosenXAxis = xAxisvalue;
            console.log(chosenXAxis);
            
            xLinearScale = xScale(censusData, chosenXAxis);
            
            xAxis = renderXAxis(xLinearScale, xAxis);
            
            textGroup = renderTexts("x", textGroup, xLinearScale, chosenXAxis);

            circlesGroup = renderCircles("x", circlesGroup, xLinearScale, chosenXAxis);
            
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
            
            yLinearScale = yScale(censusData, chosenYAxis);
            // var yAxis = chartGroup.append("g").call(leftAxis);
            yAxis = renderYAxis(yLinearScale, yAxis);

            textGroup = renderTexts("y", textGroup, yLinearScale, chosenYAxis);
            
            circlesGroup = renderCircles("y", circlesGroup, yLinearScale, chosenYAxis);
            
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
    