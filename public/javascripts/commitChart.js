const data = {
  labels: date_labels,
  datasets: [{
    label: size,
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: price_data,
  }]
};
const config = {
  type: 'line',
  data,
  options: {} 
};
