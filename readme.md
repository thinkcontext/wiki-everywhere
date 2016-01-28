#### Intro

Wiki Everywhere is a web browser extension which leverages Wikidata in order
to overlay linked open data (LOD) onto the wider web.

![Example using the Rotten Tomatoes entry for the Dark Knight](https://raw.githubusercontent.com/thinkcontext/wiki-everywhere/master/misc/screen-dk.png)

#### Using it

Clone this repository, open Chrome in developer mode, and load the "chrome" folder as an unpacked extension.  If you want to use the Youtube search functionality, you'll need an API key from Google.  Once you have it, rename chrome/js/settings.js-example to settings.js (excluded by .gitignore) and put the key in the file.

#### How it works

Wiki Everywhere looks at the URL of the current page and attempts to match it against a list of patterns maintained using Wikidata's [formatter URL property](https://www.wikidata.org/wiki/Property:P1630) of authority control identifiers.  If the URL matches, a search of Wikidata is performed using the derived property and key value.  If the search returns a match for an entity then the extension is able to use the data there to perform additional queries of the LOD cloud.

In the example above, the user visits, the [Rotten Tomatoes entry for "The Dark Knight"](http://www.rottentomatoes.com/m/the_dark_knight).  The URL matches the authority control formatter property of "http://www.rottentomatoes.com/$1" for ["Rotten Tomatoes identifier" (P1258)](https://www.wikidata.org/wiki/Property:P1258).  Thus, a [SPARQL search of Wikidata](https://query.wikidata.org/#PREFIX%20bd%3A%20%3Chttp%3A%2F%2Fwww.bigdata.com%2Frdf%23%3E%20%0APREFIX%20wdt%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fprop%2Fdirect%2F%3E%20%0APREFIX%20wikibase%3A%20%3Chttp%3A%2F%2Fwikiba.se%2Fontology%23%3E%20%0APREFIX%20wds%3A%20%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2Fstatement%2F%3E%0A%0ASELECT%20%3FproptypeLabel%20%3Fproptype%20%3Fpropstat%20%3Fpropre%20WHERE%20%7B%20%20%20%0A%20%20%3Fproptype%20wdt%3AP1630%20%3Fpropstat%20.%20%20%20%0A%20%20optional%20%7B%20%3Fproptype%20wdt%3AP1793%20%3Fpropre%20%7D%20%20%20%20%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%20%20%20%20%7D%20%0A%7D%20%0A) can be performed using the derived property of P1258 with a key of "m/the_dark_knight".  An entity ([Q163872](https://www.wikidata.org/wiki/Q163872)) is found and the query returns the Wikipedia page and the official website property (P856) if there is one.  The Freebase property (P646) is used to perform a subsequent search against Youtube's API to display related videos.
