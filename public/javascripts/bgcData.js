
var $container = $("#treeNutrients");
var $console = $("#example1console");
var $parent = $container.parent();


var selectedPlot;
var selectedVersion;

var hotTreeData = [];
var hotProbzustdata = [];
var hotEntartdata = [];
var hotProbSektData = [];
var mergedData = [];
var hotValidDefData = [];

var allProbzustdata = [];
var allEntartdata = [];
var allProbSektData = [];
var allValidDefData = [];

var treesDataFromTable = [];
var treesTempDataFromTable = [];



$.ajax({             type: 'GET',
                     url: "/allProbzustData",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                     console.log(data);
                     hotProbzustdata = data.map(x => x.text);
                     allProbzustdata = data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        hotProbzustdata = [];
                     });

$.ajax({             type: 'GET',
                     url: "/allEntartData",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                     console.log(data)
                     hotEntartdata = data.map(x => x.text)
                     allEntartdata = data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        hotEntartdata = [];
                     });

$.ajax({             type: 'GET',
                     url: "/allProbeSektData",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                     console.log(data);
                     hotProbSektData = data.map(x => x.text);
                     allProbSektData = data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        hotProbSektData = [];
                     });

$.ajax({             type: 'GET',
                     url: "/allValidDefData",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                     console.log(data);
                     hotValidDefData = data.map(x => x.text);
                     allValidDefData = data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        hotValidDefData = [];
                     });

var hotTreeSettings = {
              data: hotTreeData,
              startRows: 1,
              startCols: 10,
              stretchH: 'all',
              autoWrapRow: true,
              maxRows: 22,
              rowHeaders: true,
              colHeaders: true,
              colHeaders: [ 'clnr','banreti','species','anker','beo_umfang','bgc_last_bhu','new_bhu','probsekt','beo_hoehe','bgc_old_entnhoehe','entnhoehe','leiter' ,'stangenschere','probzust','feld_bem','ank_datum','entnart','valbhu','valbhubem'],
              manualColumnResize: true,
              manualRowResize: true,
              columns: [
                   {data: 'clnr',
                    readOnly: true},
                   {data: 'banreti',
                    readOnly: true},
                   {data: 'species',
                    readOnly: true},
                    {data: 'anker',
                    type: 'checkbox'},
                   {data: 'umfang',
                    readOnly: true},
                   {data: 'bhu',
                    readOnly: true},
                   {data: 'new_bhu',
                   type: 'numeric'},
                   {data: 'probsekt_code',
                   type: 'autocomplete',
                    filter: false},
                   {data: 'bahoehe',
                    readOnly: true},
                   {data: 'entnhoehe',
                    readOnly: true},
                    {data: 'new_entnhoehe',
                    type: 'numeric'},
                   {data: 'leiter'},
                   {data: 'stangenschere',
                    type: 'checkbox'},
                   {data: 'new_probzust'},
                   {data: 'feld_bem'},
                   {data: 'ank_datum',
                   type: 'date',
                           dateFormat: 'DD.MM.YYYY',
                           correctFormat: true,
                           defaultDate: '01.01.2018',
                           allowEmpty: true,
                          },
                            {data: 'new_entnart',
                            type: 'autocomplete',
                            filter: false
                   },
                   {data: 'new_valbhu',
                   type: 'autocomplete',
                    filter: false},
                   {data: 'valbhubem'}
                   ],
                   cells : function (row, col, prop) {
                         if(col === 13) {
                            this.type = 'dropdown';
                            var val = this.instance.getValue();

                            this.source =  hotProbzustdata;
                            }

                         if(col === 16) {
                            this.type = 'dropdown';
                            this.source =  hotEntartdata;
                            }

                         if(col === 17) {
                           this.type = 'dropdown';
                           this.source =  hotValidDefData;
                         }

                         if(col === 7) {
                            this.type = 'dropdown';
                            this.source =  hotProbSektData;
                            }
                         }

              };

var hotTree = new Handsontable($('#hotTrees')[0], hotTreeSettings);


$(document).ready(function () {
 selectedPlot = parseInt($('#lwfPlot option:selected').val());
       refreshAllData();
       saveTempStateOfData();

})


function saveTempStateOfData() {
        nutrientTemporaryData.plotData.clnr =  parseInt($('#lwfPlot option:selected').val());
        nutrientTemporaryData.plotData.probdat = $('#probdaturm').val()
        nutrientTemporaryData.plotData.witterung =( $('#witterung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientTemporaryData.plotData.besteiger_nr = parseInt($('#besteiger1 option:selected').val());
        nutrientTemporaryData.plotData.protokoll_nr =  parseInt($('#protokoll1 option:selected').val());
        nutrientTemporaryData.plotData.bemerkung = ( $('#bemerkung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientTemporaryData.plotData.besteiger_nr2 =  parseInt($('#besteiger2 option:selected').val());
        nutrientTemporaryData.plotData.protokoll_nr2 =  parseInt($('#protokol2 option:selected').val());

        treesTempDataFromTable = hotTree.getSourceData();

        nutrientTemporaryData.plotData.trees = treesTempDataFromTable.map(function(d,i) {

        return {
                clnr: d.clnr,
                banreti: d.banreti,
                probsekt: getProbsektCode(d.probsekt_code),
                leiter: d.leiter,
                stangenschere: getStangenschereCode(d.stangenschere),
                entnhoehe: d.new_entnhoehe,
                probzust: getProbzustCode(d.new_probzust),
                feld_bem: d.feld_bem,
                ank_datum: jsToJodaDate(d.ank_datum),
                bhu: d.new_bhu,
                entnart: getEntartCode(d.new_entnart),
                valbhu: getValidDefCode(d.new_valbhu),
                valbhubem: d.valbhubem
            };
         });

}

var plotValue;

$(function () {
    $('#lwfPlot').change(function() {
          saveTempStateOfData();
            var newVal = $(this).val();
              if (!confirm("Are you sure you have no unsaved changes?")) {
                $(this).val(plotValue); //set back
                return;                  //abort!
              }
              //destroy branches
              plotValue = newVal;
              refreshAllData();
    });
});

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}


function refreshAllData() {
 selectedPlot = parseInt($('#lwfPlot option:selected').val());

$.ajax({
  type: 'GET',
  url: "/allPlotsData/" + selectedPlot,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  mergedData = [];

  data[0].trees.map( x => {

  if(jQuery.isEmptyObject(data[0].bgcTrees)) {
    mergedData.push(x) } else {
  data[0].bgcTrees.filter(function (n){
  return (n.banreti === x.banreti);
      }).map( y => {
   mergedData.push({...x, ...y});
             })}
  }
             );
           console.log(mergedData);

  hotTree.destroy();
  hotTreedata = mergedData;
  hotTreeSettings.data = mergedData;
  hotTree = new Handsontable($('#hotTrees')[0], hotTreeSettings);
  hotTree.render();
  }
}).fail(function() {
  console.log('Request failed, inspect arguments for details')
})

}

/*function cleanTempJsonObject() {
 Iterator keys = nutrientTemporaryData.keys();
    while(keys.hasNext())
    nutrientTemporaryData.remove(keys.next().toString());

}*/

$('#save').click(function () {
    //cleanTempJsonObject();
    //hotGenf.alter("insert_row", 1,2);
        // save all cell's data
        var a = hotTree.validateCells(function (valid) {
            console.log('trees data is valid');
        });
        nutrientComplexData.plotData.clnr =  parseInt($('#lwfPlot option:selected').val());
        nutrientComplexData.plotData.probdat = $('#probdaturm').val()
        nutrientComplexData.plotData.witterung =( $('#witterung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientComplexData.plotData.besteiger_nr = parseInt($('#besteiger1 option:selected').val());
        nutrientComplexData.plotData.protokoll_nr =  parseInt($('#protokoll1 option:selected').val());
        nutrientComplexData.plotData.bemerkung = ( $('#bemerkung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientComplexData.plotData.besteiger_nr2 =  parseInt($('#besteiger2 option:selected').val());
        nutrientComplexData.plotData.protokoll_nr2 =  parseInt($('#protokol2 option:selected').val());

        treesDataFromTable = hotTree.getSourceData();

       nutrientComplexData.plotData.trees = treesDataFromTable.map(function(d,i) {

       return {
                clnr: d.clnr,
                banreti: d.banreti,
                probsekt: getProbsektCode(d.probsekt_code),
                leiter: d.leiter,
                stangenschere: getStangenschereCode(d.stangenschere),
                entnhoehe: d.new_entnhoehe,
                probzust: getProbzustCode(d.new_probzust),
                feld_bem: d.feld_bem,
                ank_datum: jsToJodaDate(d.ank_datum),
                bhu: d.new_bhu,
                entnart: getEntartCode(d.new_entnart),
                valbhu: getValidDefCode(d.new_valbhu),
                valbhubem: d.valbhubem
            };
        });

        var nutrientInput = JSON.stringify(nutrientComplexData);
        $.ajax({
                crossDomain: true,
                        url: '/saveNutrient',
                        type: 'POST',
                        //dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data: nutrientInput,
                        //headers: {'Content-Type': 'application/json'}
                        success: function (data, status, headers, config) {
                            alert("validated Successfully" + data)
                        }
                        }).fail(function (data, status, headers, config) {
                            alert(status + data.responseText)
                    });
        console.log(nutrientInput);
    });


function getProbsektCode(probsekt) {
    if(probsekt != 'undefined') {
        var filteredValues = allProbSektData.filter(function (el) {
            return el.text === probsekt;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].art;
            }
        }
    }

function getEntartCode(entart) {
    if(entart != 'undefined') {
        var filteredValues = allEntartdata.filter(function (el) {
            return el.text === entart;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].code;
            }
        }
    }

function getProbzustCode(probzust) {
    if(probzust != 'undefined') {
        var filteredValues = allProbzustdata.filter(function (el) {
            return el.text === probzust;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].code;
            }
        }
    }


function getValidDefCode(validef) {
    if(validef != 'undefined') {
        var filteredValues = allValidDefData.filter(function (el) {
            return el.text === validef;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].code;
            }
        }
    }

function getStangenschereCode(stangenschere) {
    if(stangenschere != 'undefined') {

        if (stangenschere === true) {
            return 'j';
            } else {
            return 'N';
            }
        }
    }

function jsToJodaDate(datum) {
    if(datum != null) {
    var res = datum.split(".");
    var yearDef = parseInt(res[2]);
    var monthDef = parseInt(res[1]);
    var dayDef = parseInt(res[0]);
    //var monthMinusOne = (monthDef === 0 ) ? (0) : (monthDef - 1);
    var padMonth = (monthDef < 10 ) ? ("0" + monthDef) : (monthDef);
    var padDay = (dayDef < 10 ) ? ("0" + dayDef) : (dayDef);
    return yearDef + "-" + padMonth + "-" + dayDef;
    }
  }