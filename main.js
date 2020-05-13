// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/aiddata-countries-only - aiddata-countries-only.csv', d3.autoType),
  d3.csv('data/mini3_vis2_data.csv', d3.autoType),
]).then(([data, mini3_vis2_data]) => {
  vis1(data, d3.select('#vis1'));
  vis2(data, mini3_vis2_data, d3.select('#vis2'));
});
