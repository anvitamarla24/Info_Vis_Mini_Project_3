function vis1(data, div) {
	
  const margin = {top: 30, right: 100, bottom: 50, left: 100};
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 680 - margin.top - margin.bottom;


  const svg = div.append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
  
  const filteredData = data3.filter(d => top10_receivers.includes(d.recipient));
  const filteredData2 = filteredData.filter(d => top20_donors.includes(d.donor));
  
  function func_numRequestsByAgencyAndBorough(filteredData2){
  const agencyToBoroughToCount = d3.rollup(filteredData2.filter(d => d.amount > 0),
                                     v => d3.sum(v, d => d.amount),
                                     d => d.donor, d => d.recipient);
  
  return Array.from(agencyToBoroughToCount, ([donor, boroughToCount]) => ({
    donor: donor,
    recipients: Array.from(boroughToCount, ([recipient, amount]) => ({recipient, amount}))
  }));
}
  
  const numRequestsByAgencyAndBorough = func_numRequestsByAgencyAndBorough(filteredData2);
  
    const cScale = d3.scalePow()
                    .exponent(0.5)
                    .domain([d3.min(numRequestsByAgencyAndBorough, d => d3.min(d.recipients, b => b.amount)), d3.max(numRequestsByAgencyAndBorough, d => d3.max(d.recipients, b => b.amount))])
                    .range(["#F1B8FA","#56249F"])
					//.range(["#73b2d7", "#08306b"])
                    .interpolate(d3.interpolateHcl)
  
  // const cScale = d3.scaleSequentialSqrt([0, d3.max(numRequestsByAgencyAndBorough, d => d3.max(d.recipients, b => b.amount))], d3.interpolatePuRd)
  
  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Relationship b/w Countries");
  
  // create scales

  const x = d3.scalePoint()
      .domain(top10_receivers)
      .range([0, visWidth])
      .padding(0.5);
  
  const y = d3.scalePoint()
      .domain(top20_donors)
      .range([0, visHeight])
      .padding(0.5);
  
  const maxRadius = 10;
  const radius = d3.scaleSqrt()
      .domain([0, d3.max(numRequestsByAgencyAndBorough, d => d3.max(d.recipients, b => b.amount))])
      .range([2, maxRadius]);
	  
	  
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
  
  // add legend
  
  const legend = g.append("g")
      .attr("transform", `translate(${visWidth + margin.right - 70}, 0)`)
    .selectAll("g")
    .data([1568, 12207518000, 24415034432, 36622550863, 48830067295])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", d => cScale(d));

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
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
    // .text(d => `${Math.round(d*0.000001)}M`);
  
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
  
  const rows = g.selectAll(".row")
    .data(numRequestsByAgencyAndBorough)
    .join("g")
      .attr("transform", d => `translate(0, ${y(d.donor)})`);
  
  rows.selectAll("circle")
    .data(d => d.recipients)
    .join("circle")
      .attr("cx", d => x(d.recipient))
      .attr("cy", d => 0)
      .attr("fill", d => cScale(d.amount))
      .attr("r", d => radius(d.amount));
  
   rows.selectAll("circle")
     .data(d => d.recipients)
     .join("circle")
     .append("title")
      .text(d => `Amount Donated: ${Math.round(d.amount*0.000001)}Million`)
}
