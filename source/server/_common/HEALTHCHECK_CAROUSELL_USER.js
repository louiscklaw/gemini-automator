// NOTE:
//
// the script(s) consistently scan carousell post
// it will click when the post with "spotlight" .
// if the username of the post matched with the key defined here.
// it will ping the url(value)
//
// dashboard url: http://192.168.10.61:8097/projects/dc055375-6ec2-4e28-9109-09b22a2eee7d/checks/
//

const HEALTHCHECK_CAROUSELL_USER = {
  kylema11201: 'https://healthcheck.iamon99.com/ping/7c9a06f0-0197-41f4-87a3-a4e165620e1d',
  hw19812359580: 'https://healthcheck.iamon99.com/ping/14d3725e-1dbe-4bbc-b5ba-1683eeb97614',
  //
  // http://192.168.10.61:8097/projects/dc055375-6ec2-4e28-9109-09b22a2eee7d/checks/
  louis_coding: 'https://healthcheck.iamon99.com/ping/13b83a8c-3047-49b2-855a-e7ecf75a3686',
};

exports.HEALTHCHECK_CAROUSELL_USER = HEALTHCHECK_CAROUSELL_USER;
