N.bll.Extractor = new function () {

    var extractors = [
        N.bll.extractor.BestRestaurantsParis
    ];

    var extract = function () {
        extractors.forEach(function(extractor) {
            extractor.extract();
        });
    };

    this.extract = extract;
};
