/*
  adapt content in iFrame
  version: 1.0
*/

function init_iFrameAdapter(options) {
    if (!inIframe()) return;

    var iFrameAdapterOptions = {
        wrapperId: "iFrameAdapter_wrapper",
        mode: "fit" // options: fit | fitH | fitV | stretch
    };

    // User defined options
    for (var key in options)
        if (options.hasOwnProperty(key)) iFrameAdapterOptions[key] = options[key];

    var body = document.body;
    var iFrameAdapterWrapper = document.createElement("div");
    iFrameAdapterWrapper.setAttribute("id", iFrameAdapterOptions.wrapperId);
    while (body.childNodes.length > 0) {
        iFrameAdapterWrapper.appendChild(body.childNodes[0]);
    }

    body.appendChild(iFrameAdapterWrapper);

    // body.innerHTML = "<div id='" + iFrameAdapterOptions.wrapperId + "'>" + body.innerHTML + "</div>";

    // var iFrameAdapterWrapper = document.getElementById(iFrameAdapterOptions.wrapperId);
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var cssText = document.createTextNode(
        ' body{' +
        '   position: absolute;' +
        '   margin:0px;' +
        '   top:0px;' +
        '   left:0px;' +
        '   width: ' + document.width + 'px;     /*<--- IMPORTANT */' +
        '   height: ' + document.height + 'px;   /*<--- IMPORTANT */' +
        '   overflow: hidden;                    /*<--- IMPORTANT */' +
        ' }' +
        ' #' + iFrameAdapterOptions.wrapperId + '{' +
        '   position: absolute;' +
        '   width: 100%;                         /*<--- IMPORTANT */' +
        '   height:100%;                         /*<--- IMPORTANT */' +
        '   overflow: hidden;                    /*<--- IMPORTANT */' +
        ' }');
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(cssText);
    head.appendChild(style);

    window.addEventListener("resize", scale);
    scale();

    function scale() {
        //reset overflow
        body.style.overflowX = "hidden";
        body.style.overflowY = "hidden";

        var containerWidth = window.frameElement ? window.frameElement.offsetWidth : window.innerWidth,
            containerHeight = window.frameElement ? window.frameElement.offsetHeight : window.innerHeight,

            contentWidth = iFrameAdapterWrapper.offsetWidth,
            contentHeight = iFrameAdapterWrapper.offsetHeight,

            containerRatio = containerWidth / containerHeight,
            contentRatio = contentWidth / contentHeight,

            scaleFactorH = scaleFactorV = 1,
            iFrameAdapterStyle = "";

        switch (iFrameAdapterOptions.mode) {
            case 'fitH':
                scaleFactorV = scaleFactorH = containerWidth / contentWidth;
                iFrameAdapterStyle += "height: " + contentHeight + "px; ";
                body.style.overflowY = "auto";
                body.style.height = "initial";
                break;

            case 'fitV':
                scaleFactorH = scaleFactorV = containerHeight / contentHeight;

                iFrameAdapterStyle += "width: " + contentWidth + "px; ";
                body.style.overflowX = "auto";
                body.style.width = "initial";
                break;

            case 'stretch':
                scaleFactorH = containerWidth / contentWidth;
                scaleFactorV = containerHeight / contentHeight;
                break;

            default:
                //auto detect max size
                if (containerRatio < contentRatio) {
                    // scale depending on width
                    scaleFactorH = scaleFactorV = containerWidth / contentWidth;
                } else {
                    // scale depending on height
                    scaleFactorH = scaleFactorV = containerHeight / contentHeight;
                }
        }

        // scale the content
        iFrameAdapterStyle +=
            "-webkit-transform-origin: top left;-webkit-transform: scale(" + scaleFactorH + "," + scaleFactorV + ");" +
            "   -moz-transform-origin: top left;   -moz-transform: scale(" + scaleFactorH + "," + scaleFactorV + ");" +
            "    -ms-transform-origin: top left;    -ms-transform: scale(" + scaleFactorH + "," + scaleFactorV + ");" +
            "     -o-transform-origin: top left;     -o-transform: scale(" + scaleFactorH + "," + scaleFactorV + ");" +
            "        transform-origin: top left;        transform: scale(" + scaleFactorH + "," + scaleFactorV + ");";

        // center the content using
        var left = Math.floor((containerWidth - contentWidth * scaleFactorH) * .5);
        var top = Math.floor((containerHeight - contentHeight * scaleFactorV) * .5);
        iFrameAdapterStyle += "left: " + (left > 0 ? left : 0) + "px; ";
        iFrameAdapterStyle += "top:  " + (top > 0 ? top : 0) + "px; ";

        // render
        iFrameAdapterWrapper.setAttribute("style", iFrameAdapterStyle);
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
}


function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

addLoadEvent(function() {
    init_iFrameAdapter();
});