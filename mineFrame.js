/**
* mineFrame 0.1a
* by Satbir Jhuti
**/

/* Global Variables */

var pageType = 'parent';

var mf = mf || {};
mf = {
	init : function(page){
	   pageType = page;
	},
	
	getParam : function (name,type) {
        if (type == "hash") {
            var match = RegExp("[#&]" + name + "=([^&]*)").exec(top.location.hash);
        } else {
            var match = RegExp("[?&]" + name + "=([^&]*)").exec(top.location.search);   
        }
        if (match) {
            return match && decodeURIComponent(match[1].replace(/\+/g, " "));
        } else {
            if (name == "s") {
                return "upload%20DESC";
            } else {
                return "";
            }
        }
    },
    
    receiveBodyHeight : function (e) {
        var currentHeight = $('.postMessage').height();
        if (currentHeight != e) {
            //document.getElementById("mfgallery").height = parseInt(e) + 20;
            $('.postMessage').height(parseInt(e));
        }
    },
    
    setParam : function (e) {
        var messageType = "";
        var message = "";
        
        if (typeof(e.data) == "object") {
            messageType = e.data[0];
            message = e.data[1];
        } else {
            // IE8 fix
            messageType = e.data.substr(0,e.data.indexOf(","));
            message = e.data.substr(e.data.indexOf(",") + 1);
        }
        
        switch (messageType) {
            case 'height':
                mf.receiveBodyHeight(message);
                break;
            case 'params':
                window.location.hash = message;
                break;
            case 'function':
                window[message]();
                break;
            case 'scrollToTop':
                scrollTo();
                break;
        }
    },
    
    scrollTo : function () {
        document.getElementById('mfgallery').scrollIntoView();
    },
    
    sendMessage : function (messageType,value){
        var query = new Array();
        var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
        if (typeof target != "undefined" && document.body.scrollHeight) {
            query[0] = messageType;
            
            switch (messageType) {
                case "height":
                    query[1] = $('body').prop('scrollHeight')+value;
                    break;
                case "setAttr":
                    break;
                case "params":
                    if (window.location.search.indexOf("&siteUrl=") != -1) {
                        query[1] = "mid=" + getParam("mid") + "&offset=" + getParam("offset") + "&page=" + getParam("page") + "&s=" + getParam("s");
                    } else {
                        query[1] = window.location.search.substr(window.location.search.indexOf("?") + 1);
                    }
                    break;
                case "scrollToTop":
                    query[1] = "0";
                    break;
                default:
                    query[1] = "0";
                    break;
                }
            target.postMessage(query, "*");
        }
    },
    
    callParentFunction : function (functionName) {
        var query = new Array();
        var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
        if (typeof target != "undefined") {
            query[0] = "function";
            query[1] = functionName;
            target.postMessage(query, "*");
        }
    },
    
    childAutoGrow : function (padding) {
        if(typeof padding != "undefined") {
            setInterval(function(){mf.sendMessage("height",padding)},100);
        } else {
            setInterval(function(){mf.sendMessage("height",0)},100);
        }
    },
    
    setAttr : function (elem,attr,val) {
        if (pageType == "parent") {
            console.log("parent");
            /* Under Construction */
        }
    }

}

// Event listeners
if (window.addEventListener) {
    window.addEventListener("message", mf.setParam, false);
} else {
    window.attachEvent("onmessage", mf.setParam, false); // IE8,9 fix
}