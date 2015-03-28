'use strict';

/**
 * Lets see how people use it and if there are any errors we can easily 
 * triage it quickly. This is the way we can setup CSP for Google Analytics.
 * We can't add any script blocks in extensions due to CSP.
 *
 * @author Mohamed Mansour 2015 (http://mohamedmansour.com)
 */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-19066286-20']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();