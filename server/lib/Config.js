var settings = Meteor.settings;

N.Config = _.extend({}, settings, settings.public);
delete N.Config.public;
