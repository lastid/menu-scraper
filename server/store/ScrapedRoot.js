N.store.ScrapedRoot = new function () {
    N.store.Base.call(this, 'scrapedRoot');

    var col = this.col;
    
    var findByUrl = function (url) {
        return col.findOne({url: url});
    };

    this.insert = function (doc) {return col.insert(doc);};
    this.findByUrl = findByUrl;
};
