
var $container = $("#treeNutrients");
var $console = $("#example1console");
var $parent = $container.parent();


var selectedPlot;
var selectedVersion;
var selectedSearchDate;
var plotValue;
var searchDateValue;


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
var allPers = [];

var treesDataFromTable = [];
var treesTempDataFromTable = [];

$.ajax({             type: 'GET',
                     url: "/allPersons",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                     console.log(data);
                     allPers = data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        allPers = [];
                     });

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
              colHeaders: [ 'clnr','banreti','species','anker','beo_umfang','bgc_last_bhu','new_bhu','probsekt','beo_hoehe','bgc_old_entnhoehe','entnhoehe','leiter' ,'stangenschere','probzust','feld_bem','ank_datum','entnart','valbhu','valbhubem','x','y'],
              manualColumnResize: true,
              manualRowResize: true,
              columns: [
                   {data: 'clnr',
                    readOnly: true},
                   {data: 'banreti',
                    readOnly: true
                    },
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
                   {data: 'probsekt',
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
                   {data: 'probzust'},
                   {data: 'feld_bem'},
                   {data: 'ank_datum',
                   type: 'date',
                           dateFormat: 'DD/MM/YYYY',
                           correctFormat: true,
                           defaultDate: '01/01/2018',
                           allowEmpty: true,
                          },
                            {data: 'entnart',
                            type: 'autocomplete',
                            filter: false
                   },
                   {data: 'valbhu',
                   type: 'autocomplete',
                    filter: false},
                   {data: 'valbhubem'},
                   {data: 'x'},
                   {data: 'y'}
                   ],

                   cells : function (row, col, prop) {
                         if(col === 13) {
                            this.type = 'dropdown';
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
                         },
                         licenseKey: "non-commercial-and-evaluation"

              };

var hotTree = new Handsontable($('#hotTrees')[0], hotTreeSettings);


$(document).ready(function () {
 selectedPlot = parseInt($('#lwfPlot option:selected').val());
       $("#update").prop("disabled",true);
       refreshAllData();

})



$(function () {
    $('#lwfPlot').change(function() {
            var newVal = $(this).val();
              if (!confirm("Are you sure you have no unsaved changes?")) {
                $(this).val(plotValue); //set back
                return;                  //abort!
              }
              //destroy branches
              plotValue = newVal;
               selectedSearchDate = $('#searchDate option:selected').val();
            if(selectedSearchDate === "Choose One") {
              $("#update").prop("disabled",true);
               refreshAllData();
              } else {
                refreshAllDataWithDate();
              }
    });
});

$(function () {
    $('#searchDate').change(function() {
           $("#update").prop("disabled",false);
           $("#save").prop("disabled",true);
            var newVal = $(this).val();
              if (!confirm(searchDateValue)) {
                return;                  //abort!
              }
              searchDateValue = newVal;
              //destroy branches
              if(newVal === "Choose One") {
               $("#update").prop("disabled",true);
               $("#save").prop("disabled",false);
               refreshAllData();
              } else {
                $("#save").prop("disabled",true);
                refreshAllDataWithDate();
              }
    });
});


function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function refreshAllDataWithDate() {
 selectedPlot = parseInt($('#lwfPlot option:selected').val());
 selectedSearchDate = formatDate($('#searchDate option:selected').val());
 if(selectedSearchDate != null && selectedSearchDate != "") {

$.ajax({
  type: 'GET',
  url: "/allPlotsDataForDate/" + selectedPlot + "/" + selectedSearchDate,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  mergedData = [];
 if(data[0].bgcPlot.length == 0) {
 alert("No data found on this date");
                 refreshAllData();

 } else {

  $('#probedatum').attr('value',setProbeDatum(selectedSearchDate));
  $('#witterung').attr('value', ( setWitterung(data[0].bgcPlot) != undefined) ? (setWitterung(data[0].bgcPlot)) : '');
    setProtokol1(setprotokollNr1(data[0].bgcPlot), data[0].bgcPlot);
    setProtokol2(setprotokollNr2(data[0].bgcPlot), data[0].bgcPlot);
    setBesteiger2(setBesteigerNr2(data[0].bgcPlot), data[0].bgcPlot);
    setBesteiger1(setBesteigerNr1(data[0].bgcPlot),data[0].bgcPlot);

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

          var c2 = Object.create(mergedData);
          var c3 = c2.map(function(d,i) { return {
                                                clnr: d.clnr,
                                                banreti: d.banreti,
                                                anker: getAnkerVal(d.anker),
                                                bahoehe: d.bahoehe,
                                                species: d.species,
                                                new_bhu: d.bhu,
                                                bhu: undefined,
                                                entnhoehe: undefined,
                                                probsekt: getProbsektText(d.probsekt),
                                                leiter: d.leiter,
                                                stangenschere: getStangenschereVal(d.stangenschere),
                                                new_entnhoehe: d.entnhoehe,
                                                probzust: getProbzustText(d.probzust),
                                                feld_bem: d.feld_bem,
                                                ank_datum: setAnkDatum(d.ank_datum),
                                                entnart: getEntartText(d.entnart),
                                                valbhu: getValidDefText(d.valbhu),
                                                valbhubem: d.valbhubem,
                                                umfang: getBeoLastYearVal(d.umfang, d.invnr),
                                                x: d.x,
                                                y: d.y
                                            };
                                            });
          console.log(c3);

   console.log(mergedData);

  hotTree.destroy();
  hotTreedata = c3;
  hotTreeSettings.data = c3;
  hotTree = new Handsontable($('#hotTrees')[0], hotTreeSettings);
  hotTree.render();
  }
  }

}).fail(function() {
  console.log('Request failed, inspect arguments for details')
})
} else {
$("#update").prop("disabled",true);
$("#save").prop("disabled",false);
refreshAllData();
}

}

function SortByID(x,y) {
      return x.banreti - y.banreti;
    }


function refreshAllData() {
$("#save").prop("disabled",false);

 selectedPlot = parseInt($('#lwfPlot option:selected').val());

$.ajax({
  type: 'GET',
  url: "/allPlotsData/" + selectedPlot,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  mergedData = [];

  $('#witterung').attr('value','');
  $('#probedatum').attr('value',isoToSimpleDate(new Date().toISOString()));
  $('#protokoll1').val('').prop('selected', true);
  $('#protokol2').val('').prop('selected', true);
  $('#besteiger1').val('').prop('selected', true);
  $('#besteiger2').val('').prop('selected', true);

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

          var c2 = Object.create(mergedData);
          var c3 = c2.map(function(d,i) { return {
                                                clnr: d.clnr,
                                                banreti: d.banreti,
                                                anker: getAnkerVal(d.anker),
                                                bahoehe: getBeoLastYearVal(d.bahoehe, d.invnr),
                                                species: d.species,
                                                bhu: getBgcLastValue(d.bhu),
                                                entnhoehe:  getBgcLastValue(d.entnhoehe),
                                                probsekt: getProbsektText(d.probsekt),
                                                leiter: d.leiter,
                                                stangenschere: getStangenschereVal(d.stangenschere),
                                                probzust: getProbzustText(d.probzust),
                                                feld_bem: d.feld_bem,
                                                ank_datum: jsToJodaDate(d.ank_datum),
                                                entnart: getEntartText(d.entnart),
                                                valbhu: getValidDefText(d.valbhu),
                                                valbhubem: d.valbhubem,
                                                umfang: getBeoLastYearVal(d.umfang, d.invnr),
                                                x: d.x,
                                                y: d.y
                                            };
                                            });
          console.log(c3);

   console.log(mergedData);

  hotTree.destroy();
  hotTreedata = c3.sort(SortByID);
  hotTreeSettings.data = c3.sort(SortByID);
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



$('#update').click(function () {
    //cleanTempJsonObject();
    //hotGenf.alter("insert_row", 1,2);
        // save all cell's data
        var a = hotTree.validateCells(function (valid) {
            console.log('trees data is valid');
        });
        nutrientUpdateData.plotData.clnr =  parseInt($('#lwfPlot option:selected').val());
        nutrientUpdateData.plotData.probdat = $('#probedatum').val();
        nutrientUpdateData.oldProbDatumToUpdate = jsToJodaDate($('#searchDate option:selected').val());
        nutrientUpdateData.plotData.witterung =( $('#witterung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientUpdateData.plotData.besteiger_nr = parseInt($('#besteiger1 option:selected').val());
        nutrientUpdateData.plotData.protokoll_nr =  parseInt($('#protokoll1 option:selected').val());
        nutrientUpdateData.plotData.bemerkung = ( $('#bemerkung').val() != "") ? ($('#witterung').val()) : undefined;
        nutrientUpdateData.plotData.besteiger_nr2 =  parseInt($('#besteiger2 option:selected').val());
        nutrientUpdateData.plotData.protokoll_nr2 =  parseInt($('#protokol2 option:selected').val());

        treesDataFromTable = hotTree.getSourceData();

       nutrientUpdateData.plotData.trees = treesDataFromTable.map(function(d,i) {

       return {
                clnr: d.clnr,
                banreti: d.banreti,
                anker: getAnkerCode(d.anker),
                probsekt: getProbsektCode(d.probsekt),
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

        var nutrientInput = JSON.stringify(nutrientUpdateData);
        $.ajax({
                crossDomain: true,
                        url: '/updateNutrient',
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


$('#save').click(function () {
    //cleanTempJsonObject();
    //hotGenf.alter("insert_row", 1,2);
        // save all cell's data
        var a = hotTree.validateCells(function (valid) {
            console.log('trees data is valid');
        });
        nutrientComplexData.plotData.clnr =  parseInt($('#lwfPlot option:selected').val());
        nutrientComplexData.plotData.probdat = $('#probedatum').val();
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
                anker: getAnkerCode(d.anker),
                probsekt: getProbsektCode(d.probsekt),
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

function getProbsektText(probsekt) {
    if(probsekt != 'undefined') {
        var filteredValues = allProbSektData.filter(function (el) {
            return el.art === probsekt;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].text;
            }
        }
    }

function getEntartCode(entart) {
    if(entart != 'undefined') {
        var filteredValues = allEntartdata.filter(function (el) {
            return el.text === entart;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].art;
            }
        }
    }

function getEntartText(entart) {
    if(entart != 'undefined') {
        var filteredValues = allEntartdata.filter(function (el) {
            return el.art === entart;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].text;
            }
        }
    }

function getProbzustCode(probzust) {
    if(probzust != 'undefined') {
        var filteredValues = allProbzustdata.filter(function (el) {
            return el.text === probzust;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].art;
            }
        }
    }

function getProbzustText(probzust) {
    if(probzust != 'undefined') {
        var filteredValues = allProbzustdata.filter(function (el) {
            return el.art === probzust;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].text;
            }
        }
    }

function getValidDefCode(validef) {
    if(validef != 'undefined') {
        var filteredValues = allValidDefData.filter(function (el) {
            return el.text === validef;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].art;
            }
        }
    }

function getValidDefText(validef) {
    if(validef != 'undefined') {
        var filteredValues = allValidDefData.filter(function (el) {
            return el.art === validef;
            });
        if (filteredValues[0] != null) {
            return filteredValues[0].text;
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

 function getStangenschereVal(stangenschere) {
    if(stangenschere != 'undefined') {
        if (stangenschere === 'j') {
            return true;
            } else {
            return false;
            }
        }
    }

function getAnkerCode(anker) {
    if(anker != 'undefined') {
        if (anker === true) {
            return 1;
            } else {
            return 0;
            }
        }
    }

 function getAnkerVal(anker) {
    if(anker != 'undefined') {
        if (anker === 1) {
            return true;
            } else {
            return false;
            }
        }
    }
 function jsToJodaDate(datum) {
    if(datum != null) {
        var res = datum.split("/");
        var yearDef = parseInt(res[2]);
        var monthDef = parseInt(res[1]);
        var dayDef = parseInt(res[0]);
        //var monthMinusOne = (monthDef === 0 ) ? (0) : (monthDef - 1);
        var padMonth = (monthDef < 10 ) ? ("0" + monthDef) : (monthDef);
        var padDay = (dayDef < 10 ) ? ("0" + dayDef) : (dayDef);
        return yearDef + "-" + padMonth + "-" + dayDef;
    }
  }


  function formatDate(datum) {
      if(datum != null && datum != "") {
          var res = datum.split("/");
          var yearDef = parseInt(res[2]);
          var monthDef = parseInt(res[1]);
          var dayDef = parseInt(res[0]);
          //var monthMinusOne = (monthDef === 0 ) ? (0) : (monthDef - 1);
          var padMonth = (monthDef < 10 ) ? ("0" + monthDef) : (monthDef);
          var padDay = (dayDef < 10 ) ? ("0" + dayDef) : (dayDef);
          return padDay + "." + padMonth + "." + yearDef;
      }
    }

    function isoToSimpleDate(datum) {
    if(datum != null && datum != "") {
              var onlyDate = datum.split("T");
              return onlyDate[0];
          }
    }


    function  setAnkDatum(ank_datum) {
        if(ank_datum != 'undefined') {
            var ankDate = new Date(ank_datum)
            return ankDate.getDate() + "/" + (ankDate.getMonth() + 1) + "/"  + ankDate.getFullYear()
        }
    }

    function  setProbeDatum(datum) {
        if(datum != 'undefined') {
            var res = datum.split(".");
            var yearDef = parseInt(res[2]);
            var monthDef = parseInt(res[1]);
            var dayDef = parseInt(res[0]);
            //var monthMinusOne = (monthDef === 0 ) ? (0) : (monthDef - 1);
            var padMonth = (monthDef < 10 ) ? ("0" + monthDef) : (monthDef);
            var padDay = (dayDef < 10 ) ? ("0" + dayDef) : (dayDef);
            return yearDef + "-" + padMonth + "-" + padDay;
       }
     }


   function setWitterung(bgcPlots) {
      if(bgcPlots != 'undefined') {
        if(bgcPlots[0] != 'undefined') {
         if(bgcPlots[0].witterung != 'undefined')
             return bgcPlots[0].witterung;
      }
      }
   }

  function setBesteigerNr1(bgcPlots) {
        if(bgcPlots != 'undefined') {
            if(bgcPlots[0].besteiger_nr != 'undefined') {
                    var filteredValues = allPers.filter(function (el) {
                    return el.persnr === bgcPlots[0].besteiger_nr;
                });
                if (filteredValues[0] != null) {
                    return  (filteredValues[0].persnr);
                } else {
                    return "Choose One";
                }
            }
        }
  }

  function setprotokollNr1(bgcPlots) {
     if(bgcPlots != 'undefined') {
        if(bgcPlots[0].protokoll_nr != 'undefined') {
            var filteredValues = allPers.filter(function (el) {
            return el.persnr === bgcPlots[0].protokoll_nr;
           });
           if (filteredValues[0] != null) {
             return  (filteredValues[0].persnr);
           } else {
             return "Choose One";
           }
        }
     }
  }


function setBesteiger2 (BesteigerNr2, bgcPlot) {
    if (BesteigerNr2 != 'undefined') {
        $('#besteiger2').val(BesteigerNr2).prop('selected', true);
    } else {
        $('#besteiger2').val("Choose One").prop('selected', true);
    }
  }

function setBesteigerNr2(bgcPlots) {
        if(bgcPlots != 'undefined') {
            if(bgcPlots[0].besteiger_nr2 != 'undefined') {
                    var filteredValues = allPers.filter(function (el) {
                    return el.persnr === bgcPlots[0].besteiger_nr2;
                });
                if (filteredValues[0] != null) {
                    return  (filteredValues[0].persnr);
                } else {
                    return "Choose One";
                }
            }
        }
  }

  function setProtokol2 (protokollNr2, bgcPlot) {
    if (setprotokollNr2 != 'undefined') {
        $('#protokol2').val(protokollNr2).prop('selected', true);
    } else {
        $('#protokol2').val("Choose One").prop('selected', true);
    }
  }

  function setprotokollNr2(bgcPlots) {
     if(bgcPlots != 'undefined') {
        if(bgcPlots[0].protokoll_nr2 != 'undefined') {
            var filteredValues = allPers.filter(function (el) {
            return el.persnr === bgcPlots[0].protokoll_nr2;
           });
           if (filteredValues[0] != null) {
             return  (filteredValues[0].persnr);
           }
        }
     }
  }


 function setProtokol1 (protokollNr1, bgcPlot) {
    if (setprotokollNr1 != 'undefined') {
        $('#protokoll1').val(protokollNr1).prop('selected', true);
    } else {
        $('#protokoll1').val("Choose One").prop('selected', true);
    }
  }

  function setBesteiger1 (BesteigerNr1, bgcPlot) {
      if (BesteigerNr1 != 'undefined') {
          $('#besteiger1').val(BesteigerNr1).prop('selected', true);
      } else {
          $('#besteiger1').val("Choose One").prop('selected', true);
      }
    }

 function getBgcLastValue(value) {
       if (value != 'undefined') {
         var year = (new Date().getFullYear()) -2 ;
         return value + '(' +  year + ')';
         }
 }

 function getBeoLastYearVal(value, invnr) {
          if(value != 'undefined') {
            return value  + "(" + invnr + ")";
          }
 }


 $(document).ready(function($) {
     $( '#foliagePrint' ).click(function() {
     var plotName = $('#lwfPlot option:selected').text();
     if(plotName === 'Jussy') {
            print_treeDataJussy();
        } else {
            print_treeData();
        }
     });
 });

 function append_json(data){
             var table = document.getElementById('treeDataPrintTable');
             data.forEach(function(object) {
                 var tr = document.createElement('tr');
                 tr.innerHTML = '<td>' + object.clnr + '</td>' +
                 '<td>' + object.banreti + '</td>' +
                 '<td>' + object.species + '</td>' +
                 '<td>' + object.umfang + '</td>';
                 table.appendChild(tr);
             });
         }

function print_treeData() {
             var treesData = hotTree.getSourceData();
             var number_of_rows = treesData.length;
             if(number_of_rows <=6 ) {
               var k = 0;
               var table_body = '<table style="border:2px solid black;width:100%" id="example">' +
                    '<thead><tr>' +
                    '<th style="border: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Banreti</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Species</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Ankerhöhe [m]</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU alt [mm]</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Umfang</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU neu [mm]</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor alt</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor neu</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Beo_Hoehe</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">AlteEntn- hoehe[m]</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Entn- hoehe[m]</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Leiter</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Stangen schere</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probe zustand</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Entart</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">ValBHU</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;width:25%;word-wrap:break-word">Bemerkungen zum Probebaum</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Val_bhu_Bem</th>' +
                    '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">x / y</th>' +
                    //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">y</th>' +
                    '</tr></thead><tbody>';
                    treesData.forEach(function(object) {
                    table_body += '<tr>';
                    table_body += '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.banreti + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.species + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.bhu === 'undefined(2018)' ? ' ' : object.bhu) + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.umfang + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.probsekt + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.bahoehe + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.entnhoehe === 'undefined(2018)' ? ' ' : object.entnhoehe) + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.leiter === "undefined" ? ' ' : object.leiter) + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.stangenschere + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.entnart === "undefined" ? ' ' : object.entnart) + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.valbhu === "undefined" ? ' ' : object.valbhu)  + '</td>' +
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + ' ' + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px;width:25%">' + ' ' + '</td>' +
                                   '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.x + ' / ' + object.y + '</td>'
                                   //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.y + '</td>'
                                   ;

                    table_body+='</tr>';
               })

         table_body+='</tbody></table>';
     var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
     winPrint.document.write('<title>LWF BGC Form</title><br /><br /><h1> Protokoll Blattentnahme</h1><br />');
     winPrint.document.body.setAttribute('style', 'font-size: 1vh');

     winPrint.document.write('</head><body>' +
        '<table style="border:2px solid black;width:100%">' +
             '<tr>' +
                 '<td> LWF Fläche &emsp;&emsp;&emsp; : &ensp;&ensp; ' + $('#lwfPlot option:selected').text() + '</td>' +
                 '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                 '<td> Entnahmeart &emsp;&emsp;: <input type="checkbox" name="seil" value="Seil"> Seil <input type="checkbox" name="leiter" value="Leiter"> Leiter  <input type="checkbox" name="stangenschere" value="Stangenschere"> Stangenschere </td>' +
                 '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
             '</tr>' +
             '<tr>' +
                  '<td> Probedatum &emsp;&emsp;&emsp; : ______/_______/_______________</td>' +
                  '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                  '<td> Entnahmehöhe mit Messband gemessen (ankreuzen)       : <input type="checkbox" name="antnahmehohe">  </td>' +
                  '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
              '</tr>' +
              '<tr>' +
                   '<td>Witterung &emsp;&emsp;&emsp;&emsp; : ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '<td> Zeitaufwand &emsp;&emsp;&emsp;: ______________________________ </td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
              '</tr>' +
              '<tr>' +
                   '<td> Besteiger Nr 1 &emsp;&emsp; : ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '<td> Besteiger Nr 2 &emsp;&emsp;: ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
               '</tr>' +
               '<tr>' +
                   '<td> Protokoll Nr 1 &emsp;&emsp; : ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '<td> Protokoll Nr 2 &emsp;&emsp;: ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
               '</tr>' +
               '<tr>' +
                   '<td> Ankeralter  &emsp;&emsp;&emsp; : ______________________________</td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '<td> Anker ersetzt &emsp;&emsp; : <input type="checkbox" name="ankerersetztYes"> yes <input type="checkbox" name="ankerersetztNo"> no </td>' +
                   '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
               '</tr>' +
             '</table>' +
             '<br/>' +
             '<h2> Probebäume</h2>' +
             table_body +
             '</table>' +
             '<br />' +
             '<table style="border:2px solid black;width:100%">' +
                      '<tr>' +
                          '<td> <h4> allgemeine Bemerkungen: </h4><br /></td>' +
                      '</tr>' +
                      '<tr>'  +
                          '<td style="height:60px;"><br /></td>' +
                      '</tr>' +
          '</table>' +
          '<br/><br/>' +
           '</table>' +
           '<p>In den Kühlraum (2°C) gebracht am _____/________/________um _____:______Uhr </p><br />' +
         '</body></html>');
     winPrint.document.close();
     //append_json(treesData);
     winPrint.focus();
     winPrint.print();
     winPrint.close();
     } else {
     print_treeDataJussy();
     }
     }


     function print_treeDataJussy() {
                  var treesData = hotTree.getSourceData();
                  var mid = Math.round((treesData.length - 1) / 2);
                  var secondSetArray = treesData.slice(0, mid);
                  var firstSetArray = treesData.slice(mid, treesData.length);


                  var number_of_rows = treesData.length;
                    var k = 0;
                    var table_body = '<table style="border:2px solid black;width:100%" id="example">' +
                         '<thead><tr>' +
                         '<th style="border: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Banreti</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Species</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Ankerhöhe [m]</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU alt [mm]</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Umfang</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU neu [mm]</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor alt</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor neu</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Beo_Hoehe</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">AlteEntn- hoehe[m]</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Entn- hoehe[m]</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Leiter</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Stangen schere</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probe zustand</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Entart</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">ValBHU</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;width:25%;word-wrap:break-word">Bemerkungen zum Probebaum</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Val_bhu_Bem</th>' +
                         '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">x / y</th>' +
                         //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">y</th>' +
                         '</tr></thead><tbody>';
                         secondSetArray.forEach(function(object) {
                         table_body += '<tr>';
                         table_body += '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.banreti + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.species + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.bhu === 'undefined(2018)' ? ' ' : object.bhu) + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.umfang + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.probsekt + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.bahoehe + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.entnhoehe === 'undefined(2018)' ? ' ' : object.entnhoehe) + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.leiter === "undefined" ? ' ' : object.leiter) + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.stangenschere + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.entnart === "undefined" ? ' ' : object.entnart) + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.valbhu === "undefined" ? ' ' : object.valbhu)  + '</td>' +
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + ' ' + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px;width:25%">' + ' ' + '</td>' +
                                        '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.x + ' / ' + object.y + '</td>'
                                        //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.y + '</td>'
                                        ;

                         table_body+='</tr>';
                    })

              table_body+='</tbody></table>';


                                  var table_body2 = '<table style="border:2px solid black;width:100%" id="example">' +
                                       '<thead><tr>' +
                                       '<th style="border: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Banreti</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Species</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Ankerhöhe [m]</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU alt [mm]</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Umfang</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">BHU neu [mm]</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor alt</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probesektor neu</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Beo_Hoehe</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">AlteEntn- hoehe[m]</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Entn- hoehe[m]</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Leiter</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Stangen schere</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">Probe zustand</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Entart</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">ValBHU</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;width:25%;word-wrap:break-word">Bemerkungen zum Probebaum</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black">Val_bhu_Bem</th>' +
                                       '<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">x / y</th>' +
                                       //'<th style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px;word-wrap:break-word">y</th>' +
                                       '</tr></thead><tbody>';
                                       firstSetArray.forEach(function(object) {
                                       table_body2 += '<tr>';
                                       table_body2 += '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.banreti + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.species + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.bhu === 'undefined(2018)' ? ' ' : object.bhu) + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.umfang + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + object.probsekt + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + object.bahoehe + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px; background-color: #d9d9d9">' + (object.entnhoehe === 'undefined(2018)' ? ' ' : object.entnhoehe) + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' ' + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.leiter === "undefined" ? ' ' : object.leiter) + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.stangenschere + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + ' '  + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.entnart === "undefined" ? ' ' : object.entnart) + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + (object.valbhu === "undefined" ? ' ' : object.valbhu)  + '</td>' +
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black">' + ' ' + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px;width:25%">' + ' ' + '</td>' +
                                                      '<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:90px">' + object.x + ' / ' + object.y + '</td>'
                                                      //'<td style="border-bottom: 1px solid black;border-right: 1px solid black;height:50px">' + object.y + '</td>'
                                                      ;

                                       table_body2+='</tr>';
                                  })

                            table_body2+='</tbody></table>';
          var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
          winPrint.document.write('<title>LWF BGC Form</title><br /><br /><h1> Protokoll Blattentnahme</h1><br />');
          winPrint.document.body.setAttribute('style', 'font-size: 1vh');

          winPrint.document.write('</head><body>' +
             '<table style="border:2px solid black;width:100%">' +
                  '<tr>' +
                      '<td> LWF Fläche &emsp;&emsp;&emsp; : &ensp;&ensp; ' + $('#lwfPlot option:selected').text() + '</td>' +
                      '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                      '<td> Entnahmeart &emsp;&emsp;: <input type="checkbox" name="seil" value="Seil"> Seil <input type="checkbox" name="leiter" value="Leiter"> Leiter  <input type="checkbox" name="stangenschere" value="Stangenschere"> Stangenschere </td>' +
                      '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                  '</tr>' +
                  '<tr>' +
                       '<td> Probedatum &emsp;&emsp;&emsp; : ______/_______/_______________</td>' +
                       '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                       '<td> Entnahmehöhe mit Messband gemessen (ankreuzen)       : <input type="checkbox" name="antnahmehohe">  </td>' +
                       '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '</tr>' +
                   '<tr>' +
                        '<td>Witterung &emsp;&emsp;&emsp;&emsp; : ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                        '<td> Zeitaufwand &emsp;&emsp;&emsp;: ______________________________ </td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                   '</tr>' +
                   '<tr>' +
                        '<td> Besteiger Nr 1 &emsp;&emsp; : ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                        '<td> Besteiger Nr 2 &emsp;&emsp;: ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td> Protokoll Nr 1 &emsp;&emsp; : ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                        '<td> Protokoll Nr 2 &emsp;&emsp;: ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td> Ankeralter  &emsp;&emsp;&emsp; : ______________________________</td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                         '<td> Anker ersetzt &emsp;&emsp; : <input type="checkbox" name="ankerersetztYes"> yes <input type="checkbox" name="ankerersetztNo"> no </td>' +
                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                    '</tr>' +
                  '</table>' +
                  '<br/>' +
                  '<h2> Probebäume</h2>' +
                  table_body +
                  '</table>' +
                  '<br />' +
                  '<table style="border:2px solid black;width:100%">' +
                           '<tr>' +
                               '<td> <h4> allgemeine Bemerkungen: </h4><br /></td>' +
                           '</tr>' +
                           '<tr>'  +
                               '<td style="height:60px;"><br /></td>' +
                           '</tr>' +
               '</table>' +
               '<br/><br/>' +
                '</table>' +
                '<p>In den Kühlraum (2°C) gebracht am _____/________/________um _____:______Uhr </p><br />' +
                 '<br/><br/><br/><br/> <br/><br/><br/><br/><br/><br/><br/><br/>' +
                 '<br/><br/><br/><br/> <br/><br/><br/><br/><br/><br/><br/><br/>' +

                 '<table style="border:2px solid black;width:100%">' +
                                  '<tr>' +
                                      '<td> LWF Fläche &emsp;&emsp;&emsp; : &ensp;&ensp; ' + $('#lwfPlot option:selected').text() + '</td>' +
                                      '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                      '<td> Entnahmeart &emsp;&emsp;: <input type="checkbox" name="seil" value="Seil"> Seil <input type="checkbox" name="leiter" value="Leiter"> Leiter  <input type="checkbox" name="stangenschere" value="Stangenschere"> Stangenschere </td>' +
                                      '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                  '</tr>' +
                                  '<tr>' +
                                       '<td> Probedatum &emsp;&emsp;&emsp; : ______/_______/_______________</td>' +
                                       '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                       '<td> Entnahmehöhe mit Messband gemessen (ankreuzen)       : <input type="checkbox" name="antnahmehohe">  </td>' +
                                       '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                   '</tr>' +
                                   '<tr>' +
                                        '<td>Witterung &emsp;&emsp;&emsp;&emsp; : ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                        '<td> Zeitaufwand &emsp;&emsp;&emsp;: ______________________________ </td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                   '</tr>' +
                                   '<tr>' +
                                        '<td> Besteiger Nr 1 &emsp;&emsp; : ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                        '<td> Besteiger Nr 2 &emsp;&emsp;: ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td> Protokoll Nr 1 &emsp;&emsp; : ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                        '<td> Protokoll Nr 2 &emsp;&emsp;: ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td> Ankeralter  &emsp;&emsp;&emsp; : ______________________________</td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                        '<td> Anker ersetzt &emsp;&emsp; : <input type="checkbox" name="ankerersetztYes"> yes <input type="checkbox" name="ankerersetztNo"> no </td>' +
                                        '<td> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; </td>' +
                                    '</tr>' +
                                  '</table>' +
                                  '<br/>' +
                                  '<h2> Probebäume</h2>' +
                                  table_body2 +
                                  '</table>' +
                                  '<br />' +
                                  '<table style="border:2px solid black;width:100%">' +
                                           '<tr>' +
                                               '<td> <h4> allgemeine Bemerkungen: </h4><br /></td>' +
                                           '</tr>' +
                                           '<tr>'  +
                                               '<td style="height:60px;"><br /></td>' +
                                           '</tr>' +
                               '</table>' +
                               '<br/><br/>' +
                                '</table>' +
                                '<p>In den Kühlraum (2°C) gebracht am _____/________/________um _____:______Uhr </p><br />' +

              '</body></html>');
          winPrint.document.close();
          //append_json(treesData);
          winPrint.focus();
          winPrint.print();
          winPrint.close();
          }