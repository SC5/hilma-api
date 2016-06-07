# Hilma API

Hilma API is an API that makes the public tenders available in Hilma (http://www.hankintailmoitukset.fi) available on a REST API (see Usage).

## Setup

Relevant environment variables:

- `PORT`: port used to run the server (default 8080)

## Usage

* `/hilmatenders`: Return tenders in JSON. Example:

        {"tenders":[
          {
            "ID":"2014-004638",
            "name":"Consultation request",
            "organization":"Company Oyj",
            "entrydate":"2014-07-10T00:00:00.000Z",
            "tenderdate":"2015-07-30T00:00:00.000Z",
            "ttype":"Ennakkoilmoitus",
            "url":"http://www.hankintailmoitukset.fi/fi/view/2014-004638/"
          },
          { ... }
        ]}
* CPV codes can be passed via the CPV parameter (multiple codes delimited by semicolon). E.g. '/hilmatenders/?CPV=123456-6%3B45678-1'
