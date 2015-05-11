N.store.Base = function (collectionName) {

    var col = new Meteor.Collection(collectionName);

    var updateById = function (id, modifier) {
        return col.update({_id: id}, modifier);
    };

    var set = function (id, fields) {
        return updateById(id, {
            $set : fields
        });
    };

    this.col        = col;
    this.updateById = updateById;
    this.set        = set;
};
