window.onload = () => {
  var evtSource = new EventSource('/stream');
  evtSource.onmessage = e => {
    let data = JSON.parse(e.data);
    document.getElementById('gas-conc').innerText = data.conc;
    document.getElementById('temperature').innerText = data.temperature;
    document.getElementById('humidity').innerText = data.humidity;
    // document.getElementById('t_stamp').innerText = `djodo`;
    let ts = document.getElementsByClassName('t_stamp');
    [].forEach.call(document.getElementsByClassName('t_stamp'), el => {
      el.innerText = `${new Date(data.time_stamp)}`;
    });
  };
};
FusionCharts.ready(function() {
  var fusioncharts = new FusionCharts({
    type: 'column2d',
    renderAt: 'chart-container',
    width: '100%' /*0 - 20 + window.innerWidth / 2*/,
    height: '400',
    dataFormat: 'jsonurl',
    dataSource: '/chartdata',
    type: 'line'
  });
  fusioncharts.render();
});
