
var $container = $("#example2");
var $console = $("#example1console");
var $parent = $container.parent();


var selectedLiart;
var selectedVersion;

var hotSynonymdata = [];
var hotAuthorsData = [];
var hotGenfData = [];
var hotLiartdata = $.ajax({
                     type: 'GET',
                     url: "/listLiartsJson",
                     dataType: 'json',
                     crossDomain: true,
                     success: function(data) {
                         return data;
                     }})
                     .fail(function() {
                        console.log('Request failed, inspect arguments for details')
                        return [];
                     });




var hotSynonymSettings = {
              data: hotSynonymdata,
              startRows: 1,
              startCols: 2,
              stretchH: 'all',
              width: 800,
              autoWrapRow: true,
              maxRows: 22,
              rowHeaders: true,
              colHeaders: true,
              colHeaders: ['NoNom', 'NoNomComplete'],
              columns: [
                   {data: 'noNom',
                    readOnly: true},
                   {data: 'nomComplet',
                    readOnly: true}
                   ]
              };

var hotGenfDataSettings = {
            data: hotGenfData,
            startRows: 1,
            startCols: 8,
            stretchH: 'all',
            width: 800,
            autoWrapRow: true,
            maxRows: 22,
            rowHeaders: true,
            colHeaders: true,
            colHeaders: ['NoNom', 'noFiche', 'coFamille', 'nomComplet', 'nomFamille', 'nomGenre', 'nom_espece', 'tax_version'],
            columns: [
                       {data: 'noNom',
                        readOnly: true},
                       {data: 'noFiche',
                        readOnly: true},
                       {data: 'coFamille',
                        readOnly: true},
                       {data: 'nomComplet',
                        readOnly: true},
                       {data: 'nomFamille',
                        readOnly: true},
                       {data: 'nomGenre',
                        readOnly: true},
                       {data: 'nomEspece',
                        readOnly: true},
                       {data: 'taxVersion',
                        readOnly: true}
                      ]
            };

var hotAuthorsSettings = {
            data: hotAuthorsData,
            startRows: 1,
            startCols: 5,
            stretchH: 'all',
            width: 800,
            autoWrapRow: true,
            rowHeaders: true,
            colHeaders: true,
            colHeaders: ['Type', 'Code', 'VorName', 'NachName', 'JahrZahlen', 'Kuerzel'],
            columns: [
                       {data: 'typeAuthor',
                        readOnly: true},
                       {data: 'code'},
                       {data: 'vorName'},
                       {data: 'nachName'},
                       {data: 'jahrZahlen'},
                       {data: 'kuerzel'}
                      ]
            };

var hotLiartSettings = {
              data: hotLiartdata,
              startRows: 1,
              startCols: 7,
              stretchH: 'all',
              width: 800,
              autoWrapRow: true,
              maxRows: 22,
              rowHeaders: true,
              colHeaders: true,
              colHeaders: ['CODE', 'TEXT', 'LIGRU','LIUGRU','LI_GATTUNG','LIART_VERSION'],
              columns: [
                         {data: 'code',
                          readOnly: true},
                         {data: 'text'},
                         {data: 'ligru'},
                         {data: 'liugru'},
                         {data: 'ligattung'},
                         {data: 'liart_version',
                          readOnly: true}
                        ]
              };
var hotSynonyms = new Handsontable($('#hotSynonyms')[0], hotSynonymSettings);
var hotLiart = new Handsontable($('#hotLiart')[0], hotLiartSettings);
var hotLiartAuthors = new Handsontable($('#hotAuthors')[0], hotAuthorsSettings);
var hotGenf = new Handsontable($('#hotGenf')[0], hotGenfDataSettings);



$(function () {
    $('#selectLiartVersion').change(function() {
       refreshAllData();
    });
});

$(function () {
    $('#selectLiartId').change(function() {
       refreshAllData();
    });
});



function refreshAllData() {
 selectedLiart = parseInt($('#selectLiartId option:selected').val());
            selectedVersion = parseInt($('#selectLiartVersion option:selected').val());



$.ajax({
  type: 'GET',
  url: "/listSynonymJson/" + selectedLiart + "/" + selectedVersion,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  hotSynonyms.destroy();
  hotSynonymdata = data;
  hotSynonymSettings.data = data;
  hotSynonyms = new Handsontable($('#hotSynonyms')[0], hotSynonymSettings);
  hotSynonyms.render();

    hotLiart.destroy();
  //hotLiartdata = ;
  hotLiartSettings.data = hotLiartdata.responseJSON.filter(function (n){
                                                           return (parseInt(n.code)===selectedLiart && parseInt(n.liart_version)===selectedVersion);
                                                       });;
  hotLiart = new Handsontable($('#hotLiart')[0], hotLiartSettings);
  hotLiart.render();
    /*new Handsontable($('#example2')[0], {
      data: data,
      startRows: 8,
      startCols: 7,
      minSpareRows: 1,
      colHeaders: ['CODE', 'TEXT', 'LIGRU','LIUGRU','LI_GATTUNG','LIART_VERSION'],
      cells : function (row, col, prop) {
      if(col === 3 || col ===4 ) {
                  this.type = 'dropdown';
                  var val = this.instance.getValue();
                  if(typeof val != 'undefined') {
                    this.source =  ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']; // to add to the beginning do this.source.unshift(val) instead
                  }
               }
            }
    });*/
  }
}).fail(function() {
  console.log('Request failed, inspect arguments for details')
})

$.ajax({
  type: 'GET',
  url: "/listLiartGenfMapJson/" + selectedLiart + "/" + selectedVersion,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  hotGenf.destroy();
  hotGenfData = data;
  hotGenfDataSettings.data = [data];
  hotGenf = new Handsontable($('#hotGenf')[0], hotGenfDataSettings);
  hotGenf.render();

  //hotLiartdata = ;

    /*new Handsontable($('#example2')[0], {
      data: data,
      startRows: 8,
      startCols: 7,
      minSpareRows: 1,
      colHeaders: ['CODE', 'TEXT', 'LIGRU','LIUGRU','LI_GATTUNG','LIART_VERSION'],
      cells : function (row, col, prop) {
      if(col === 3 || col ===4 ) {
                  this.type = 'dropdown';
                  var val = this.instance.getValue();
                  if(typeof val != 'undefined') {
                    this.source =  ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']; // to add to the beginning do this.source.unshift(val) instead
                  }
               }
            }
    });*/
  }
}).fail(function() {
  console.log('Request failed, inspect arguments for details')
})

$.ajax({
  type: 'GET',
  url: "/listLiartAuthorsJson/" + selectedLiart + "/" + selectedVersion,
  dataType: 'json',
  crossDomain: true,
  success: function(data) {
  hotLiartAuthors.destroy();
  hotAuthorsData = data;
  hotAuthorsSettings.data = data;
  hotLiartAuthors = new Handsontable($('#hotAuthors')[0], hotAuthorsSettings);
  hotLiartAuthors.render();

  //hotLiartdata = ;

    /*new Handsontable($('#example2')[0], {
      data: data,
      startRows: 8,
      startCols: 7,
      minSpareRows: 1,
      colHeaders: ['CODE', 'TEXT', 'LIGRU','LIUGRU','LI_GATTUNG','LIART_VERSION'],
      cells : function (row, col, prop) {
      if(col === 3 || col ===4 ) {
                  this.type = 'dropdown';
                  var val = this.instance.getValue();
                  if(typeof val != 'undefined') {
                    this.source =  ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']; // to add to the beginning do this.source.unshift(val) instead
                  }
               }
            }
    });*/
  }
}).fail(function() {
  console.log('Request failed, inspect arguments for details')
})


}



$('#save').click(function () {

    //hotGenf.alter("insert_row", 1,2);
        // save all cell's data
        var a = hotGenf.validateCells(function (valid) {
            alert('data is valid');
        });
        liartComplexData.liart = hotLiart.getSourceData();
        liartComplexData.synonyms = hotSynonyms.getSourceData();
        liartComplexData.genfMap = hotGenf.getSourceData();
        liartComplexData.authors = hotLiartAuthors.getSourceData();
        var partiesAnalysisInput = JSON.stringify(liartComplexData);
        $.ajax({
                crossDomain: true,
                        url: '/saveLiart',
                        type: 'POST',
                        //dataType: 'json',
                        contentType : 'application/json; charset=utf-8',
                        data: partiesAnalysisInput,
                        //headers: {'Content-Type': 'application/json'}
                        success: function (data, status, headers, config) {
                            console.log("good")
                        }
                        }).fail(function (data, status, headers, config) {
                            console.log(status)
                    });
        console.log(partiesAnalysisInput);
    });