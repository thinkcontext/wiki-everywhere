#### Intro

Wiki Everywhere is a web browser extension which leverages Wikidata in order
to overlay linked open data (LOD) onto the wider web.

![Example of retrieving Marco Rubio's New York Times and Politifact latest entries on his Twitter profile page](https://raw.githubusercontent.com/thinkcontext/wiki-everywhere/master/misc/rubio-nyt-poli.png)

#### Using it

Clone this repository, open Chrome in developer mode, and load the "chrome" folder as an unpacked extension.  

#### How it works

Wiki Everywhere looks at the URL of the current page and attempts to match it against a list of patterns maintained using Wikidata's [formatter URL property](https://www.wikidata.org/wiki/Property:P1630) of authority control identifiers.  If the URL matches, a search of Wikidata is performed using the derived property and key value.  If the search returns a match for an entity then the extension is able to use the data there to perform additional queries to display relevant linked information.

In the example above, the user visits, [Marco Rubio's Twitter profile](https://twitter.com/marcorubio).  The URL matches the authority control formatter property of "https://twitter.com/$1" for ["Twitter username" (P2002)](https://www.wikidata.org/wiki/Property:P2002).  Thus, a SPARQL search of Wikidata can be performed using the derived property of P2002 with a key of "marcorubio".  An entity ([Q324546](https://www.wikidata.org/wiki/Q324546)) is found and the query returns the Wikipedia page and the NYTimes Topic and Politifact property values.  Those values are used to retrieve the RSS feeds from those sites, allowing their latest entries to be displayed.  Those 2 properties are meant to illustrate that any Wikidata entry could be used to access an API to display contextually relevant 3rd party information.
