console.log('7.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:200,b:50,l:200};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

var scaleX, scaleY;

//Step 1: importing multiple datasets
d3.queue()
    .defer(d3.csv,"../data/olympic_medal_count_1900.csv")
    .defer(d3.csv,"../data/olympic_medal_count_1960.csv")
    .defer(d3.csv,"../data/olympic_medal_count_2012.csv")
    .await(function(err,rows1900,rows1960,rows2012){


        //Draw axis
        scaleY = d3.scaleLinear()
        .domain([0,120])
        .range([h,0]);

        var axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-w-200);

        plot.append('g')
        .attr('class','axis axis-y')
        .attr('transform','translate(-100,0)')
        .call(axisY);

        scaleX = d3.scaleOrdinal() 


//Step 2: implement the code to switch between three datasets
        d3.select('#year-1900').on('click', function(){
            draw(rows1900);
        });

        d3.select('#year-1960').on('click', function(){
            draw(rows1960);
        });

        d3.select('#year-2012').on('click', function(){
            draw(rows2012);
        });

    });

//Step 3: implement the enter / exit / update pattern
function draw(rows){
    var top5 = rows.sort(function(a,b){
        return b.count - a.count;
    }).slice(0,5);

    console.log(top5);


    // Place country names in the X axis

        scaleX.domain(top5.map(function(d) {return d["Country"];})) // .map creates a new array from an existing array
        .range (d3.range(30,w,w/5)); 


        d3.select(".axis-x").remove();

        var axisX = d3.axisBottom()
        .scale(scaleX);
        var axisNode2 = plot.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(' + 0 + ',' + h + ')')
        .call(axisX); // remove axis X before calling the updated version

    //Represent: nodes
    var nodes = plot.selectAll('.bar')
        .data(top5,function(d){return d["Country"];}); //UPDATE

    //Enter
    var nodesEnter = nodes.enter() //ENTER
        .append("rect").attr("class","bar")
        //.attr("x",function(d) {return scaleX(d.Country);})
        // .attr("y", 0) // set the height only in the transition
        .attr("width",30);
        // .attr("height", function(d){ return scaleY(d["count"]); })
        // .style("fill","blue");

    //Exit
    nodes.exit().remove();

    //Update
    var nodesTransition = nodes
        .merge(nodesEnter) //UPDATE + ENTER
        .transition().duration(1000) // old ones will move to new positions to reflect the new data . 
        .attr("x",function(d) {return scaleX(d["Country"]);}) // COUNTRY IS NOT UPDATING! WHY? 
        .attr("y", function(d){return scaleY(d["count"]);}) 
        .attr("width",30)
        .attr("height", function(d,i) { return h-scaleY(d["count"]);})
        .style("fill","blue");
    

}

function parse(d){
    return {
        country: d.Country,
        count: +d.count
    }
}
