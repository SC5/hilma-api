var config = require('./config');
var hilma = require('./hilma');
var tendertypeSkipRe = /^(suorahankintaa koskeva ilmoitus|jälki-ilmoitus.*|.*tehdyistä.*)$/i;
var Promise = require('bluebird');
  
function handlerequest(event, callback) {
 // Define the promise response / error functions outside the for loop
  var allTendersHash={};
  var cpvstr="";
  var tenderReqs = [];

  // Default to config CPVs if not defined in query
  cpvstr = event.CPV || config.cpvs;
  var CPVs = cpvstr.split(";");

  var tenderError = function(error) {
    callback(error);
  };

  // Done. Iterate over all of the results

  for (var i=0; i < CPVs.length; i++) {
    var CPVcode = CPVs[i];
    tenderReqs.push(hilma.getTenderList(CPVcode));
    break;
  }

  Promise.all(tenderReqs).then(function(resTenders) {
    var tenderArry = [];
    var allTendersHash = {};
    var id;
    // Iterate through the response of each promise
    for (var j=0;j<resTenders.length; j++) {
      var reqTenders = resTenders[j];
      // and through the results of a specific promise
      for (var i=0;i<reqTenders.length; i++) {
        var tend = reqTenders[i];
        id = tend.ID;
        allTendersHash[id] = reqTenders[i];
      }
    } 

    var tenderIDs = Object.keys(allTendersHash).sort();
    for (var idx in tenderIDs) {
      id = tenderIDs[idx];

      if (tendertypeSkipRe.exec(allTendersHash[id].ttype) == undefined) {
        tenderArry.push(allTendersHash[id]);
      }
    }
    callback( null, {tenders: tenderArry,
              request: event,
              CPVs : CPVs});
  }, tenderError);
}

module.exports = exports = {
  handlerequest: handlerequest
};
