// ==UserScript==
// @name         Custom Oneboxes for Stack Exchange Chat
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.0
// @description  A userscript that allows you to easily add a onebox to your own custom sites! :)
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://chat.stackoverfow.com/*
// @match        *://chat.meta.stackexchange.com/*
// @match        *://chat.stackexchange.com/*
// @grant        none
// ==/UserScript==
/*
Notes:
1. All you need to do to add your own oneboxed site is add a function to the customSites object (ie. add a 'plugin' :)
2. The function must be named as the URL you want to onebox (eg. SoundCloud -> `soundcloud.com` as the function name)
3. The function must have the parameters `link` and `$obj`, in that  order! link = the matched link; $obj = the message as a jQuery element
4. If you want additional CSS (which is likely), you have 3 options (in order of preference):
 - Use GM_addStyle (requires adding `// @grant GM_addStyle` to the usersript metadata block at the top)
 - Add a CSS file by adding it to the head: $('head').append('<link rel="stylesheet" type="text/css" href="URL">'); - The URL could be a github file
 - Use inline `style=""` attributes for each element
5. If you need to, you can make an extra function if things start getting complex :)
*/
var customSites = {};

customSites['customsite.com'] = function(link, $obj) { //all sites must have a function like this, with those parameters. Change the 'customsite.com' to whatever your desired URL is

	var template = "" // A HTML String (ie. your oneboxed div)
	//$obj.html(template);
}


//---------------------------------------------------------You don't need to modify the below!-----------------------------------------------------------//

var observer = new MutationObserver(function (mutations) { //MutationObserver;
    mutations.forEach(function (mutation) {
        var length = mutation.addedNodes.length;
        for (var i = 0; i < length; i++) {
            var $addedNode = $(mutation.addedNodes[i]);
            if (!$addedNode.hasClass('message')) {
                return;
            } //don't run if new node is NOT a .message

            var $lastanchor = $addedNode.find('a').last();
            if (!$lastanchor) {
                return;
            } //don't run if there is no link

            var lastanchorHref = $lastanchor.attr('href');			
			if ($addedNode.text().trim().indexOf(' ') == -1) { //no spaces = 1 word (ie. plain URL)
				$.each(customSites, function(k, v) {
					if (lastanchorHref.indexOf(k) > -1) { //if the link is to a desired site...
						customSites[k](lastanchorHref, $addedNode.find('.content')); //pass URL and added node to the function and add the onebox
					}
				});							
			}
        }
    });
});

setTimeout(function() {
    $('.message').each(function () { //loop through EXISTING messages to find oneboxable messages
        var $link;
        var $that = $(this);
        $.each(customSites, function(k, v) {
            if($that.find('a[href*="'+k+'"]').length) {
                $link = $that.find('a[href*="'+k+'"]');
                customSites[k]($link.attr('href'), $that.find('.content')); //pass URL and message to the function and add the onebox
            }
        });
    });
	
	observer.observe(document.getElementById('chat'), { //observe with the mutation observer for NEW messages
        childList: true,
        subtree: true
    });
}, 1000);
