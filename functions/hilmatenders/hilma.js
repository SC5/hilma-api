var http = require('https');
var Promise = require('bluebird');

var hilmaObj = {
  getTenderList : function (CPV) {
      return new Promise (function(response, reject) {
        var hilmaHost = "www.hankintailmoitukset.fi";
        var hilmaURL='/fi/notice/search/?all=1&_s%5B_sent%5D=1&_s%5Bphrase%5D=&_s%5Borganisation%5D=&_s%5Bnuts%5D=&_s%5Bpublished_start%5D=&_s%5Bpublished_end%5D=&_s%5Bcpv%5D=' + CPV;

        var post_options={
          host:hilmaHost,
          path:hilmaURL,
          method:"GET",
        };
        var restext = "";

        var post_req= http.request(post_options, function (httpres) {
           httpres.on('data', function(chunk) {
            restext += chunk;
          });
          httpres.on('end', function() {
            restext = restext.replace(/[\r\n]/g, "");
            //<td>23.4.2014 08.25</td><td> </td><td><a href="http://www.hankintailmoitukset.fi/fi/notice/view/2014-011796/">REQUEST FOR INFORMATION: VTS solution and ESB (Enterprise Service Bus)</a> (Liikennevirasto)<span class="meta">Ennakkoilmoitus</span>
            //<td>20.5.2016 17:01</td><td></td><td><a href="/fi/notice/view/2016-013727">KESKEYTYSILMOITUS Tilannekuvajärjestelmä</a> (Helsingin kaupungin liikennelaitos)<span class="meta">Jälki-ilmoitus, erityisalat</span>
            var hankintaIlmoRe = /<td>([^<]*)<\/td><td> *([^<]*)<\/td><td><a href=\"\/fi\/notice\/view\/([^\"]+)\">([^<]+)<\/a> *\(([^<]+)\)<span[^>]*>([^<]*)<\/span>/ig;
            
            var tenderRows = restext.match(hankintaIlmoRe);

            var tenders = [];
            var dateRe = new RegExp(/(\d+)\.(\d+)\.(\d+)\s+(\d+)[\.:](\d+)/);
            
            if (tenderRows == null) {
              response([]);
              return;
            }

            for (var i=0; i < tenderRows.length; i++) {

              var tender = tenderRows[i];
              var entryDateStr = tender.replace(hankintaIlmoRe, "$1");
              //var dateparts = entryDateStr.replace(/ .+/, "").split(".");
              var dateparts = dateRe.exec(entryDateStr);
              dateparts.shift();
              var entryDate = new Date(dateparts[2], dateparts[1] - 1, dateparts[0], dateparts[3], dateparts[4]);
              var tenderDateStr = tender.replace(hankintaIlmoRe, "$2");
              var tenderDate = "";
              dateparts = dateRe.exec(tenderDateStr);
              if (dateparts != undefined) {
                dateparts.shift();
                tenderDate = new Date(dateparts[2], dateparts[1] - 1, dateparts[0], dateparts[3], dateparts[4]);
              }
              
              var tenderID = tender.replace(hankintaIlmoRe, "$3");
              var tenderName = tender.replace(hankintaIlmoRe, "$4");
              var tenderTarget = tender.replace(hankintaIlmoRe, "$5");
              var tenderType = tender.replace(hankintaIlmoRe, "$6");

              tenders.push({ ID: tenderID,
                              name: tenderName,
                              organization: tenderTarget,
                              entrydate: entryDate,
                              entrydateStr : entryDateStr,
                              tenderdate : tenderDate,
                              tenderdateStr : tenderDateStr,
                              ttype : tenderType,
                              url : "https://www.hankintailmoitukset.fi/fi/notice/view/" + tenderID + "/"});
            }
            response(tenders);
          });
      });

      post_req.on('error', function(err) {
          reject({message: "Request error to hilma : " + err});
      });
      post_req.end();
    });
  }
};

module.exports = exports = hilmaObj;