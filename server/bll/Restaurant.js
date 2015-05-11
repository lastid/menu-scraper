N.bll.Restaurant = new function () {

    var findIn = function (ne, sw) {
        return N.store.ScrapedMenu.findIn(ne, sw);
    };

    var getDetail = function (id) {
        return N.store.ScrapedMenu.findById(id);
    };

    this.findIn = findIn;
    this.getDetail = getDetail;
};
