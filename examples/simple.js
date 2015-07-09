var Uspto = require('../');

var options = {
  query: 'IN/KANG-HO-FAN'
};

Uspto.listPatents(options, function (err, data) {
  
  if (!err) {
    data.forEach(function (element) {

      console.log('\n\n');
      console.log('patent number: ' + element.id);
      console.log('patent link: ' + element.url);
      console.log('patent title: ' + element.title);
      console.log('patent pdf link: ' + element.pdf);
    });
  }
});