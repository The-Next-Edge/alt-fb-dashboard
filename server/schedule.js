var
  Agenda = require('agenda'),
  scrape = require('../jobs/scrape'),
  fillin = require('../jobs/fillin');

module.exports = function (dbUrl) {
  
  agenda = new Agenda({db: { address: dbUrl }}),

  agenda.define('find updated', function(job, done) {
    scrape(dbUrl, function (err, number) {
      if (err) {
        console.log('there was an error while figuring out which posts need updating', err);
        return done();
      }
      console.log('finished finding last ' + number + ' posts which need updating');
      done();
    });
  });

  agenda.define('fillin posts', function(job, done) {
    fillin(dbUrl, function (err) {
      if (err) {
        console.log('there was an error while filling in posts with updates', err);
        return done();
      }
      console.log('finished filling in posts that need updating');
      done();
    });
  });

  agenda.every('10 minutes', ['find updated', 'fillin posts']);
  agenda.start();
};
