#### Intro

Wiki Everywhere is a web browser extension which leverages Wikidata in order
to overlay linked open data (LOD) on the wider web.

#### How it works

Wiki Everywhere looks at the URL of the current page and attempts to match it against a list of patterns maintained using Wikidata's [formatter URL property](https://www.wikidata.org/wiki/Property:P1630) of authority control identifiers.  If the URL matches, a search of Wikidata is performed using the derived property and key value.  If the search returns a match for an entity then the extension is able to use the data there to perform additional queries of the LOD cloud.

In the example above, the user visits, the [Rotten Tomatoes entry for "The Dark Knight"](http://www.rottentomatoes.com/m/the_dark_knight).  The URL matches the authority control formatter property of "http://www.rottentomatoes.com/$1" for ["Rotten Tomatoes identifier" (P1258)](https://www.wikidata.org/wiki/Property:P1258).  Thus, a SPARQL search of Wikidata can be performed using the derived property of P1258 with a key of "m/the_dark_knight".  An entity ([Q163872](https://www.wikidata.org/wiki/Q163872)) is found and the query returns the Wikipedia page and the official website property (P856) if there is one.  The Freebase property (P646) is used to perform a subsequent search against Youtube's API to display related videos.
