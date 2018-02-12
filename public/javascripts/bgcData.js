
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
                   {data: 'valbhubem'}
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
                         }

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
  $('#witterung').attr('value',setWitterung(data[0].bgcPlot));
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
                                                bahoehe: d.bahoehe,
                                                species: d.species,
                                                new_bhu: d.bhu,
                                                bhu: undefined,
                                                entnhoehe: d.entnhoehe,
                                                probsekt: getProbsektText(d.probsekt),
                                                leiter: d.leiter,
                                                stangenschere: getStangenschereVal(d.stangenschere),
                                                entnhoehe: undefined,
                                                new_entnhoehe: d.entnhoehe,
                                                probzust: getProbzustText(d.probzust),
                                                feld_bem: d.feld_bem,
                                                ank_datum: setAnkDatum(d.ank_datum),
                                                entnart: getEntartText(d.entnart),
                                                valbhu: getValidDefText(d.valbhu),
                                                valbhubem: d.valbhubem,
                                                umfang: d.umfang

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
                                                bahoehe: d.bahoehe,
                                                species: d.species,
                                                bhu: d.bhu,
                                                entnhoehe: d.entnhoehe,
                                                probsekt: getProbsektText(d.probsekt),
                                                leiter: d.leiter,
                                                stangenschere: getStangenschereVal(d.stangenschere),
                                                entnhoehe: d.entnhoehe,
                                                probzust: getProbzustText(d.probzust),
                                                feld_bem: d.feld_bem,
                                                ank_datum: jsToJodaDate(d.ank_datum),
                                                entnart: getEntartText(d.entnart),
                                                valbhu: getValidDefText(d.valbhu),
                                                valbhubem: d.valbhubem,
                                                umfang: d.umfang

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
