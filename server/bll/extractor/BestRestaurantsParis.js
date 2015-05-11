N.bll.extractor.BestRestaurantsParis = new function () {
    var MAX_MENU_EACH_CRAWL = 300,
        ROOT_URL = 'http://bestrestaurantsparis.com/fr/plan-du-site.html',
        USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36',
        crawled = 0;

    var getAllUrls = function (pageContent) {
        var $ = cheerio.load(pageContent),
            links = $($('.block-sitemap-section')[1]).find('a');

        return _.map(links, function (link) {
            return 'http://bestrestaurantsparis.com/' + $(link).attr('href');
        });

    };

    var parseMenu = function ($) {
        var menu = {},
            currentType = '',
            currentTypeIndex = -1,
            mapping = ['starter', 'main', 'dessert'],
            menuSection = $('.restaurant-menu-section')[0],
            elements = $(menuSection).children();

        _.each(elements, function (el) {
            if ($(el).hasClass('restaurant-menu-section-title')) {
                currentTypeIndex++;
            } else {
                currentType = mapping[currentTypeIndex];
                if (!menu[currentType]) menu[currentType] = [];

                var name = $(el).find('.restaurant-menu-desc').text().trim(),
                    price = $(el).find('.restaurant-menu-price').text().trim();

                menu[currentType].push({name: name, price: price});

            }
        });

        return menu;
    };

    var getPhoto = function (pageContent) {
        var $ = cheerio.load(pageContent),
            url = $('.restaurant-photo .slider-main-wapper img').attr('src');

        console.log('photo ' + url);
        return url;
    };

    var parseRestaurantDetail = function (pageContent) {
        var $ = cheerio.load(pageContent),
            name = $('.restaurant-title-main').text(),
            descriptionLinks = $('.restaurant-info-desc').find('a'),
            address = $($('.restaurant-desc')[1]).text().trim(),
            geodata = N.core.Geocoder.get(address + ', France', 'FR', 'fr'),
            menu = parseMenu($),
            email, website;

        _.each(descriptionLinks, function (link) {
            var url = $(link).attr('href');

            if (url.startsWith('mailto')) {
                email = url.substr(7);
            } else {
                website = url;
            }
        });

        console.log(address,'----', geodata.address);
        return {
            name: name,
            extractedAddress: address,
            geo: {
                address: geodata.address,
                coords: [geodata.lng, geodata.lat]
            },
            website: website,
            email: email,
            menu: menu,
        };
    };

    var getRestaurantDetail = function (url, cb) {
        var restaurant = N.store.ScrapedMenu.findByUrl(url),
            content;

        console.log('Get restaurant detail ', url);

        if (!restaurant) {
            console.log('Get restaurant from web');

            content = HTTP.get(url, {
                headers: {
                    'User-Agent': USER_AGENT
                }
            }).content;

            crawled++;

            if (!content) {
                console.error('Cannot get from web ' + url);
            } else {
                N.store.ScrapedMenu.insert({
                    createdAt: new Date(),
                    url: url,
                    content: content,
                    detail: parseRestaurantDetail(content)
                });

                var nextTime = (Math.random() * (6 - 4) + 4) * 1000;// random interval

                if (crawled < MAX_MENU_EACH_CRAWL) {
                    // delay to avoid the server detection
                    Meteor.setTimeout(function() {
                        cb();
                    }, nextTime);
                }
            }

        } else {

            if (!restaurant.detail) {
                N.store.ScrapedMenu.set(restaurant._id, {
                    detail: parseRestaurantDetail(restaurant.content)
                });
            } else if (!restaurant.detail.photo) {
                N.store.ScrapedMenu.set(restaurant._id, {
                    'detail.photo': getPhoto(restaurant.content)
                });
            }

            cb();
        }

    };

    var extractUrl = function (remaining) {
        if (remaining.length > 0) {
            var url = remaining.shift();

            getRestaurantDetail(url, function () {
                extractUrl(remaining);
            });
        }
    };

    var extract = function () {
        var root = N.store.ScrapedRoot.findByUrl(ROOT_URL),
            content;

        if (!root) {
            console.log('Extract root from web ', ROOT_URL);

            content = HTTP.get(ROOT_URL, {
                headers: {
                    'User-Agent': USER_AGENT
                }
            }).content;

            N.store.ScrapedRoot.insert({
                createdAt: new Date(),
                url: ROOT_URL,
                content: content,
                restaurantUrls: getAllUrls(content)
            });

            root = N.store.ScrapedRoot.findByUrl(ROOT_URL);

        } else {
            content = root.content;

            if (!root.restaurantUrls) {
                N.store.ScrapedRoot.set(root._id, {
                    restaurantUrls: getAllUrls(content)
                });
            }
        }

        root.restaurantUrls = root.restaurantUrls.slice(1);
        extractUrl(root.restaurantUrls);

        if (content) {

        } else {

            throw new Meteor.Exception(500, 'No content found for ' + ROOT_URL);
        }
    };

    this.extract = extract;
};
