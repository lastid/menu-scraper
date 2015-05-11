N.store.ScrapedMenu = new function () {
    N.store.Base.call(this, 'scrapedMenu');

    var col = this.col;
    col._ensureIndex({ 'detail.geo.coords' : '2d' });

    var findByUrl = function (url) {
        return col.findOne({url: url});
    };

    var findIn = function (ne, sw) {
        return col.find(
        {
            'detail.geo.coords': {
                $geoWithin : {
                    $box : [[sw[1], sw[0]], [ne[1], ne[0]]]
                } 
            }
        },
        {
            limit: 20,
            fields: {
                'detail.name': 1,
                'detail.geo': 1,
                //'detail.photo': 1
            }
        }
        ).fetch();
    };

    var findById = function (id) {
        return col.findOne(id).detail;
    };

    this.findIn = findIn;
    this.findById = findById;
    this.insert = function (doc) {return col.insert(doc);};
    this.findByUrl = findByUrl;
};
