var express = require('express');
var fs = require('fs');
var request = require('request').defaults({"jar": true});
var cheerio = require('cheerio');
var NodeRSA = require('node-rsa');
var app = express();

// store cookies to maintain session

// login
function login() {
	var url = 'https://members.myactivesg.com/auth';
	request(url, function(error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);
			var email, ec_password, _csrf, rsapublickey, publickey;

			// Load auth data
			var auth = JSON.parse(fs.readFileSync('auth.json'));

			// get _csrf and rsa public key required for log-in
			_csrf = $("input[name='_csrf']").val();
			rsapublickey = $("input[name='rsapublickey']").val();
			var key = new NodeRSA(rsapublickey);
			ec_password = key.encrypt(auth.password, 'base64', 'base64');

			// create login form data
			var login_form = {
				"email": auth.email,
				"ec_password": ec_password,
				"_csrf": _csrf
			};

			// create custom request headers
			var login_header = {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Content-Type": "application/x-www-form-urlencoded",
				"Referer": "https://members.myactivesg.com/auth"
			};

			var login_url = "https://members.myactivesg.com/auth/signin";

			request.post({"url": login_url, "headers": login_header, "form": login_form}, 
				function(err, httpResponse, body) {
					if (!error) {
						url = 'https://members.myactivesg.com/profile';
						request(url, function(error, response, html) {
							console.log(html);
						});
					}
				});
		}
	});
}

// select and checkout courts
function add_available_courts() {
	url = 'https://members.myactivesg.com/profile';
	request(url, function(error, response, html) {
		console.log(html);
	});
}

login();
