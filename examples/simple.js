var Uspto = require('../');

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