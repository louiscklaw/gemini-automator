// NOTE:
//
// profile setup for google-chrome browser
//

const socks_server_2 = 'socks5://go-socks5-proxy-2:1080';

const profile_setup = {
  testhelloworld04_tvbhk: {
    jobsdb_login: false,
    gemini_login: true,
    
    //
    chrome_data_dir: '/browser_data_dir/testhelloworld04_tvbhk',
    
    // REPORT_HEALTHY_URL checked and correct, report account login healthy
    REPORT_HEALTHY_URL: 'https://healthcheck.iamon99.com/ping/f58a5012-a319-4b6f-a337-991bf709a02d',
    
    // click_burn_healthy
    CLICK_BURN_HEALTHY_URL: 'https://healthcheck.iamon99.com/ping/73bee4f0-fb9d-45b1-825e-5974c2df67ff1',
    
    // 
    proxy: "socks5://192.168.10.24:1080"
  },
};

exports.profile_setup = profile_setup;
