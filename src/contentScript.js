var buttonVisibleWrapper = $("<button>", {
  class: "btn-visible",
}).text("VISUALIZE ");
var highLowIndicator = $(".high-low-indicator");
var tabluarData = $(".tabular-data-historic");
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
  <form id="target-form-handler">
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
tabluarData.after(chartContainer);

tabluarData.bind("DOMSubtreeModified", function (e) {
  highLowIndicator.after(buttonVisibleWrapper);
});

buttonVisibleWrapper.on("click", function (e) {
  $(modal).addClass("modal-show");
});

$("#target-form-handler").submit(function (event) {
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

  $(".tabular-data-historic table tr").each(function (row, tr) {
    if (row === 0) {
      let colData = $(tr).text().trim().split("\n");
      colData.forEach(function (element, index) {
        colname.push(element.trim());
      });
    }
  });

  if (!xInput || !yInput) return;
  if (xInput >= colname.length || yInput >= colname.length) return;

  // X Axis mapping
  $(".tabular-data-historic table tr").each(function (row, tr) {
    if (row !== 0) {
      var data = $(tr).find(`td:eq(${xInput})`).text().trim();
      if (xInput === 2) {
        xAxis.push(data);
      } else {
        var str2 = data.replace(/\,/g, "");
        var filteredDate = parseFloat(str2);
        xAxis.push(filteredDate);
      }
    }
  });

  // Y Axis mapping
  $(".tabular-data-historic table tr").each(function (row, tr) {
    if (row !== 0) {
      var data = $(tr).find(`td:eq(${yInput})`).text().trim();
      var str2 = data.replace(/\,/g, "");
      var filteredDate = parseFloat(str2);
      yAxis.push(filteredDate);
    }
  });

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
            x: xInput === 2 ? new Date(element) : element,
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
