**uspto** is a library for directly retrieving USPTO patent information

Lead Maintainer: [Ho-Fan Kang](https://github.com/hofan41)

<!-- toc -->

- [Example](#example)
- [Usage](#usage)
    - [`listPatents(options, callback)`](#listpatentsoptions-callback)

<!-- tocstop -->

### Example

```javascript
var Uspto = require('uspto');

var options = {
  query: 'IN/KANG-HO-FAN'
};

Uspto.listPatents(options).then(function (data) {

  data.patentList.forEach(function (element) {

    console.log('patent number: ' + element.id);
    console.log('patent link: ' + element.url);
    console.log('patent title: ' + element.title);
    console.log('patent pdf link: ' + element.pdf);
    console.log('');
  });

  console.log('Displaying patents ' + data.startIndex + ' - ' + data.endIndex + ' out of ' + data.totalCount + ' patents found.');
}).catch(function (err) {

  console.log(err);
});
```

# Usage

### `listPatents(options)`

Retrieves a list of up to 50 patents/grants based on:
- `options` - required:
  - `query` - [USPTO Query String](http://patft.uspto.gov/netahtml/PTO/search-adv.htm), required.
  - `page` - number, used when retrieving beyond the first 50 search results, defaults to 1.

Returns a [promise](https://github.com/petkaantonov/bluebird#what-are-promises-and-why-should-i-use-them) with the following data:
- `data` - an object containing:
  - `patentList` - an array of up to 50 objects containing:
    - `id` - the patent id.
    - `url` - a link to the patent on the USPTO website.
    - `title` - the patent title.
    - `pdf` - a link to a full pdf download of the patent.
  - `startIndex` - the index of the first patent in `patentList` within `totalCount`.
  - `endIndex` - the index of the last patent in `patentList` within `totalCount`.
  - `totalCount` - the total number of patents found.
