function vis2(data, mini3_vis2_data, div) {
  const margin = {top: 30, right: 100, bottom: 50, left: 100};
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 680 - margin.top - margin.bottom;


  const svg = div.append('svg')
      .attr('width', screen.width)
      .attr('height', visHeight + margin.top + margin.bottom);
	  //visWidth + margin.left + margin.right

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
	
  const top_5_purposes = ["Air transport",
                        "Rail transport",
                        "Industrial development",
                        "Power generation/non-renewable sources",
                        "RESCHEDULING AND REFINANCING"];
	
const data2 = data.map(currentElement => ({
  'donor': currentElement.donor,
  'recipient': currentElement.recipient,
  'amount': currentElement.commitment_amount_usd_constant
  // 'year': currentElement.year
}));
  
  const data3 = data2.filter(d => d.amount > 0)
  
 function func_data_top10_receivers(data){ 
  
  const data_ = data.filter(d => d.commitment_amount_usd_constant > 0)
  const cleanedData = data_.map(currentElement => ({
  'country': currentElement.recipient,
  'received': currentElement.commitment_amount_usd_constant
  //'year': currentElement.year
}));

  const numPurpose = d3.rollup(cleanedData, v => d3.sum(v, d => d.received), d => d.country);
  
  const purposeCount = Array.from(numPurpose, ([country, total]) => ({country, total}));

    return purposeCount.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 10) 

}
  const data_top10_receivers = func_data_top10_receivers(data);
  const top10_receivers = data_top10_receivers.map(d => d.country);
  
 function func_data_top20_donors(data){  
  const data_ = data.filter(d => d.commitment_amount_usd_constant > 0)
  const cleanedData = data_.map(currentElement => ({
  'country': currentElement.donor,
  'donated': currentElement.commitment_amount_usd_constant,
  'year': currentElement.year
}));

  const numPurpose = d3.rollup(cleanedData, v => d3.sum(v, d => d.donated), d => d.country);
  
  const purposeCount = Array.from(numPurpose, ([country, total]) => ({country, total}));

    return purposeCount.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 20) 

}
  
  const data_top20_donors = func_data_top20_donors(data);
  const top20_donors = data_top20_donors.map(d => d.country);

 // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Distribution of Purposes");
  
  // create scales

  const x = d3.scalePoint()
      .domain(top10_receivers)
      .range([0, visWidth])
      .padding(0.5);
  
  const y = d3.scalePoint()
      .domain(top20_donors)
      .range([0, visHeight])
      .padding(0.5);
  
  const maxRadius = 15;
  const radius = d3.scaleSqrt()
      .domain([0, d3.max(mini3_vis2_data, d => d.total)])
      .range([5, maxRadius]);
	  
	  
  top10_receivers.forEach(country => {
            g.append("line")
                .style("stroke", "#ebebe0")
                .style("stroke-dasharray", ("3, 3"))
                .attr("y1", visHeight)
                .attr("y2", 0)
                .attr("x1", x(country))
                .attr("x2", x(country))
        })
  
  top20_donors.forEach(country => {
            g.append("line")
                .style("stroke", "#ebebe0")
                .style("stroke-dasharray", ("3,3"))
                .attr("y1", y(country))
                .attr("y2", y(country))
                .attr("x1", visWidth)
                .attr("x2", 0)
        })
  
  // create and add axes
  
  const xAxis = d3.axisBottom(x).tickFormat(d => {
  if (d === 'South Africa')
    return 'S.Africa'
  else if(d === 'Saudi Arabia')
    return 'S.Arabia'
  return d
  });
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Recipients");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("x", -65)
      .attr("y", visHeight / 2)
      .attr("fill", "black")
      .attr("dominant-baseline", "middle")
      .text("Donors");
  
  // draw points
  
 /* var arc = d3.arc()
			.innerRadius(0)
      .outerRadius(10)
			// .outerRadius(d => radius(d.total))
			
  var pie = d3.pie()
			.sort(null)
			.value(d => d);*/
  
  const rows = g.selectAll(".row")
    .data(mini3_vis2_data)
    .join("g")
      .attr("transform", d => `translate(${x(d.recipient)}, ${y(d.donor)})`)
    .append("g").attr("class","pies")

  var color = d3.schemeCategory10;
  
  var pies = rows.selectAll(".pies")
		//.data(function(d) {console.log(d.data2); return pie(d.data2.split(['-'])); }) // I'm unsure why I need the leading 0.
    .data((d) => {
                let a = d3.pie().value((x) => x)([d.Air_transport, d.Rail_transport, d.Industrial_development, d.Power_generation_non_renewable_sources, d.RESCHEDULING_AND_REFINANCING]);
                a.forEach((x, i) => {
                    if(i == 0) x["key"] = "Air_transport";
                    else if(i == 1) x["key"] = "Rail_transport";
                    else if(i == 2) x["key"] = "Industrial_development";
                    else if(i == 3) x["key"] = "Power_generation_non_renewable_sources";
                    else x["key"] = "RESCHEDULING_AND_REFINANCING";
                    x["total"] = d.total;
                })
                return a;
            })
		.enter()
		.append('g')
		.attr('class','arc');
  
 rows.append("title")
      .text(d => `Amount of top 5 purposes donated by ${d.donor} to ${d.recipient}:
Air transport: ${d.Air_transport}
Rail transport: ${d.Rail_transport}
Industrial development: ${d.Industrial_development}
Power generation/non-renewable sources: ${d.Power_generation_non_renewable_sources}
RESCHEDULING AND REFINANCING: ${d.RESCHEDULING_AND_REFINANCING}
Total: ${d.total}`)
  
   pies.append("path")
   .attr('d',(d,i) => {
                 return d3.arc().innerRadius(0).outerRadius(radius(d.total))(d);
             })
     .attr("fill",function(d,i){
            return color[i];      
       })
	
	/*pies.append("path")
	  .attr('d',arc)
	.attr("fill",function(d,i){
	return color[i];      
	})*/
	
const color1 = d3.scaleOrdinal()
      .domain(top_5_purposes)
      .range(d3.schemeCategory10);
  
 function getCategoricalColorLegend(color1) {
   
  const size = 10;
  
  const legend = d3.create("svg:g");
  
  const rows = legend
    .selectAll("g")
    .data(color1.domain())
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * size * 1.5})`);
  
  rows.append("rect")
      .attr("height", size)
      .attr("width", size)
      .attr("fill", d => color1(d));
  
  rows.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("dominant-baseline", "hanging")
      .attr("x", size * 1.5)
      .text(d => d);
  
  return legend.node();
}
  
 g.append(() => getCategoricalColorLegend(color1))
      .attr("transform", `translate(${visWidth + 10}, 0)`)
	  
 const legend1 = g.append("g")
      .attr("transform", `translate(${visWidth + margin.right - 70}, 100)`)
    .selectAll("g")
    .data([7238, 4536843991, 9073680744, 13610517497, 18147354250])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend1.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    // .attr("fill", "#dcdcdc");
    .style("fill", "#d9d9d9")
    .style("opacity", 0.98)

  legend1.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    //.attr("y", maxRadius + 10)
    .text((d) => {
                    let million = 1000000
                    let billion = 1000000000
                    if(d < million){
                        return "$" + Math.ceil(d/1000) + " K"
                    } if(d < billion){
                        return "$" + Math.ceil(d/million) + " M"
                    }
                    return "$" + Math.ceil(d/billion) + " B"
                })
	
}