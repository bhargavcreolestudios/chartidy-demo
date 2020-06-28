var buttonVisibleWrapper = $("<button>", {
  class: "btn-visible yahoo-btn",
}).text("VISUALIZE");
var mainContainer = $("#YDC-Col1");
var tabluarData = $("#mrt-node-Col1-1-HistoricalDataTable");
var chartContainer = $("<div>", {
  id: "chartcontainer",
  class: "charts-wrapper d-none",
});
var closeChart = $("<button>", {
  class: "close-chart",
}).text("Close");

var modal = $("<div>", { id: "open-modal", class: "modal-window" }).append(`
<div>
  <h1>Enter Column indexes to intercept in the visualization</h1>
  <form id="chart-form-handler">
      <div class="row">
        <div class="input-grp">
          <label>X-Axis Column</label>
          <input type="number" name="x-axis" class="x-axis-input" />
        </div>
        <div class="input-grp">
          <label>Y-Axis Column</label>
          <input type="number" name="y-axis" class="y-axis-input" />
        </div>
      </div>
    <div class="modal-footer">
      <button class="btn-modal modal-footer-close">CANCEL</button>
      <button class="btn-modal modal-footer-confirm" type="submit">DONE</button>
    </div>
  </form>
</div>
`);

$("body").append(modal);
mainContainer.append(buttonVisibleWrapper);
tabluarData.addClass("tabular-formart");
tabluarData.after(chartContainer);

buttonVisibleWrapper.on("click", function (e) {
  $(modal).addClass("modal-show");
});

$("#chart-form-handler").submit(function (event) {
  event.preventDefault();
  handleTableData();
});

$(".modal-footer-close").on("click", function (e) {
  $(modal).removeClass("modal-show");
});

function handleTableData() {
  var xInput = parseInt($("input.x-axis-input").val());
  var yInput = parseInt($("input.y-axis-input").val());

  var colname = [];
  var xAxis = [];
  var yAxis = [];

  $("#Col1-1-HistoricalDataTable-Proxy table tr th").each(function (row, tr) {
    colname.push($(tr).children().text());
  });

  if (xInput === '' || yInput === '') return;
  if (xInput >= colname.length || yInput >= colname.length) return;

  // X Axis mapping
  $("#Col1-1-HistoricalDataTable-Proxy table tr").each(function (row, tr) {

    var data = $(tr).find(`td:eq(${xInput})`);
    var formatedData = data.children().text();
    if (xInput === 0) {
      xAxis.push(formatedData);
    } else {
      var xString = formatedData.replace(/\,/g, "");
      var filteredDate = parseFloat(xString);
      xAxis.push(filteredDate);
    }
  });
  xAxis.shift();
  xAxis.pop();
  $("#Col1-1-HistoricalDataTable-Proxy table tr").each(function (row, tr) {
    var data = $(tr).find(`td:eq(${yInput})`);
    var formatedData = data.children().text();
    if (yInput === 0) {
      yAxis.push(formatedData);
    } else {
      var xString = formatedData.replace(/\,/g, "");
      var filteredDate = parseFloat(xString);
      yAxis.push(filteredDate);
    }
  });
  yAxis.shift();
  yAxis.pop();

  chartContainer.removeClass("d-none");
  var chart = new CanvasJS.Chart("chartcontainer", {
    title: {
      text: `${colname[xInput]} vs ${colname[yInput]}`,
    },
    data: [
      {
        type: "line",

        dataPoints: xAxis.map(function (element, index) {
          return {
            x: xInput === 0 ? new Date(element) : element,
            y: yAxis[index],
          };
        }),
      },
    ],
  });

  chart.render();

  chartContainer.append(closeChart);
  $(modal).removeClass("modal-show");
}

closeChart.on("click", function () {
  chartContainer.addClass("d-none");
});
