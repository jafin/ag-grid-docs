
var columnDefs = [
    {headerName: "Athlete", field: "athlete", filter: 'text', suppressFilter: true},
    {headerName: "Gold", field: "gold", filter: 'number', suppressMenu:true,
        floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            suppressFilterButton:true,
            color:'red'
        }
    },
    {headerName: "Silver", field: "silver", filter: 'number', suppressMenu:true,
        floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            suppressFilterButton:true,
            color:'blue'
        }
    },
    {headerName: "Bronze", field: "bronze", filter: 'number', suppressMenu:true,
        floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            suppressFilterButton:true,
            color:'green'
        }
    },
    {headerName: "Total", field: "total", filter: 'number', suppressMenu:true,
        floatingFilterComponent: NumberFloatingFilter,
        floatingFilterComponentParams:{
            suppressFilterButton:true,
            color:'orange'
        }
    }
];

var gridOptions = {
    floatingFilter:true,
    columnDefs: columnDefs,
    rowData: null,
    enableFilter: true
};

function NumberFloatingFilter() {
}

NumberFloatingFilter.prototype.init = function (params) {
    this.onFloatingFilterChanged = params.onFloatingFilterChanged;
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '&gt; <input style="width:20px" type="text"/>'
    this.currentValue = null;
    this.eFilterInput = this.eGui.querySelector('input');
    this.eFilterInput.style.color = params.color;
    var that = this;
    function onInputBoxChanged(){
        if (that.eFilterInput.value === ''){
            //If the input box is empty we clear the filter
            that.onFloatingFilterChanged(null);
            return;
        }

        that.currentValue = Number(that.eFilterInput.value);
        that.onFloatingFilterChanged({model:{
            //In this example we are only interested in filtering by greaterThan
            type:'greaterThan',
            filter:that.currentValue
        }});
    }
    this.eFilterInput.addEventListener('input', onInputBoxChanged);
};

NumberFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
    // When the filter is empty we will receive a null message her
    if (!parentModel) {
        this.eFilterInput.value = '';
        this.currentValue = null;
    } else {
        this.eFilterInput.value = parentModel.filter + '';
        this.currentValue = parentModel.filter;
    }
};

NumberFloatingFilter.prototype.getGui = function () {
    return this.eGui;
};


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', '../olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});

