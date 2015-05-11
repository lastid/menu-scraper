Meteor.methods({
    'Restaurant.findIn': function (ne, sw) {
        return N.bll.Restaurant.findIn(ne, sw);
    },
    'Restaurant.getDetail': function (id) {
        return N.bll.Restaurant.getDetail(id);
    }
});
