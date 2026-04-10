// const fetch = require('node-fetch');

function reportHealthy(url, comment = '') {
  console.log('report healthy here,' + comment);

  try {
    fetch(url).then(() => {
      // console.debug('report healthy done');
    });
  } catch (error) {
    console.debug(error);
  }
}
module.exports = { reportHealthy };
