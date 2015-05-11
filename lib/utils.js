String.prototype.startsWith = function (s) {
    return this.slice(0, s.length) == s;;
};

String.prototype.format = function(o){
    if (typeof o == 'string' || typeof o == 'number') {

        var args = arguments;

        return this.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    } else {

        var pattern = /\{(\w+(\.\w+)*)\}/g;

        return this.replace(pattern, function(capture){
            var property = capture.substr(1, capture.length - 2),
                arr = property.split('.');
                oo = o;

            for(var i=0; i<arr.length; i++) {
                oo = oo[arr[i]];
            }

            return oo;
        });
    }
};

String.prototype.cleanName = function () {
    return this.trim().removeExtraSpaces().replace(/[,\., ]+$/g, '');
};

String.prototype.repeat = function(n){
    return Array(n + 1).join(this);
};

String.prototype.stripTags = function () {
    return this.replace(/<([^>]+)>/ig,"");
};

String.prototype.removeSpaces = function () {
    return this.replace(/\s/g, '');
};

String.prototype.removeExtraSpaces = function () {
    return this.replace(/\s+/g, ' ');
};

String.prototype.safeAttribute = function () {
    return this.replace('"', ' ');
};

String.prototype.safeHtml = function () {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
};

/**
 * ellipsis from extjs
 * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
 * @param {Number} length The maximum length to allow before truncating
 * @param {Boolean} word True to try to find a common word break
 * @return {String} The converted text
 */
String.prototype.ellipsis = function(len, word) {
    if (this.length > len) {
        if (word) {
            var vs = this.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));

            if (index !== -1 && index >= (len - 15)) {
                return vs.substr(0, index) + "...";
            }
        }

        return this.substr(0, len - 3) + "...";
    }

    return this + '';
};

if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

T = function(s) {
    return s;
};

T_MSG = {
    SERVER_ERROR: T("An error occurred, please try again later.")
};
