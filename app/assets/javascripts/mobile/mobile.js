var StudentMap = StudentMap || {};

// Google maps variables
StudentMap.map = null;
StudentMap.mapInfoWindow = null;
StudentMap.buildingMarker = null;

StudentMap.init = function(options) {
  _.extend(StudentMap.options, options);

  StudentMap.views.schools = new StudentMap.views.Schools(
                             {'collection': StudentMap.collections.schools});
};

// Models
StudentMap.models = StudentMap.models || {};

StudentMap.models.School = Backbone.Model.extend();

StudentMap.models.Room = Backbone.Model.extend({
  'initialize': function() {
    var building = null;

    for(var i in StudentMap.collections.buildings) {
      building = StudentMap.collections.buildings[i]
                 .get(this.attributes['building_id']);

      if(building != null) {
        this.building = building;
      }
    }
  }
});

StudentMap.models.Building = Backbone.Model.extend({
  'initialize': function() {
    this.latLon = new google.maps.LatLng(
        this.attributes.latitude, 
        this.attributes.longditude);
  }
});

// Collection classes
StudentMap.collections = StudentMap.collections || {};

StudentMap.collections.Schools = Backbone.Collection.extend({
  'model': StudentMap.models.School,
  'url': '/mobile/schools_data'
});

StudentMap.collections.Rooms = Backbone.Collection.extend({
  'model': StudentMap.models.Room,
  'url': '/mobile/rooms_data/?id='
});

StudentMap.collections.Buildings = Backbone.Collection.extend({
  'model': StudentMap.models.Building,
  'url': '/mobile/buildings_data/?id='
});

// Fetched collections
StudentMap.collections.schools = {};
StudentMap.collections.rooms = {};      // Multiple collections, one per school.
StudentMap.collections.buildings = {};  // Multiple collections, one per school.

// Views
StudentMap.views = StudentMap.views || {};

StudentMap.views.Schools = Backbone.View.extend({
  'el': '#schoolList',
  'initialize': function() {
    this.template = _.template($('#school-template').html());

    this.collection = StudentMap.collections.schools = 
                      new StudentMap.collections.Schools();
    this.collection.bind('all', this.render, this);
    this.collection.fetch();

    $(this.el).delegate('a', 'click', function(e){
      var id = $(e.currentTarget).attr('data-id');
      StudentMap.views.school = new StudentMap.views.School({'school_id': id});
    }.bind(this));
  },
  'render': function() {
    $(this.el).empty();

    this.collection.each(function(school) {
      $(this.el).append(this.template(school.attributes));
    }.bind(this));

    $(this.el).listview('refresh');

    return this;
  }
});

StudentMap.views.School = Backbone.View.extend({
  'el': '#roomList',
  'initialize': function(options) {
    this.template = _.template($('#room-template').html());

    // Load the buildings for this school.
    this.buildings = StudentMap.collections.buildings[options.school_id] = 
                     new StudentMap.collections.Buildings();
    this.buildings.bind('all', this.render, this);
    this.buildings.url = '/mobile/buildings_data/?id=' + options.school_id;
    this.buildings.fetch();

    // Load the rooms for this school.
    this.collection = StudentMap.collections.rooms[options.school_id] = 
                      new StudentMap.collections.Rooms();
    this.collection.bind('all', this.render, this);
    this.collection.url = '/mobile/rooms_data/?id=' + options.school_id;
    this.collection.fetch();

    $(this.el).delegate('a', 'click', function(e){
      var id = $(e.currentTarget).attr('data-id');
      StudentMap.views.map = new StudentMap.views.Map(
                             {'room_id': id, 'school_id': options.school_id});
    }.bind(this));
  },
  'render': function() {
    $(this.el).empty();

    this.collection.each(function(school) {
      $(this.el).append(this.template(school.attributes));
    }.bind(this));

    $(this.el).listview('refresh');

    return this;
  }
});

StudentMap.views.Map = Backbone.View.extend({
  'el': '#googleMap',
  'initialize': function(options) {
    this.roomId = options.room_id;
    this.schoolId = options.school_id;
    var room = StudentMap.collections.rooms[this.schoolId].get(this.roomId);

    var myOptions = {
      'zoom': 18,
      'center': room.building.latLon,
      'mapTypeId': google.maps.MapTypeId.SATELLITE
    };

    StudentMap.map = new google.maps.Map($('#googleMap').get(0), myOptions);
    StudentMap.buildingMarker = new google.maps.Marker({
      'position': room.building.latLon, 
      'map': StudentMap.map, 
      'title': room.building.name
    });
    StudentMap.mapInfoWindow = new google.maps.InfoWindow({
      'content': ''
    });
    StudentMap.mapInfoWindow.open(StudentMap.map);
    
    google.maps.event.addListener(StudentMap.buildingMarker, 'click', 
    function() {
      StudentMap.mapInfoWindow.open(StudentMap.map);
    });

    $(window).bind('orientationchange', function(){
      this.resizeMap();
    }.bind(this));
    $(window).bind('resize', function(){
      this.resizeMap();
    }.bind(this));

    this.render();
  },
  'render': function() {
    var room = StudentMap.collections.rooms[this.schoolId].get(this.roomId);

    $('#showRoom').live('pageshow', function() {
      StudentMap.buildingMarker.setPosition(room.building.latLon);
      StudentMap.mapInfoWindow.setPosition(room.building.latLon);
      StudentMap.mapInfoWindow.setContent(room.attributes['name'] + 
            ' i byggnad ' + room.building.attributes['name']);

      window.setTimeout(function() {
        StudentMap.map.setCenter(room.building.latLon);
      }, 0);

      this.resizeMap();
    }.bind(this));

    $('#showRoom > div[data-role=header] > h1').html(room.attributes.name);
  },
  'resizeMap': function() {
    $('#googleMap').css('width', $(window).width() + 'px');
    $('#googleMap').css('height', ($(window).height() - 42) + 'px');

    google.maps.event.trigger(StudentMap.map, 'resize');
  }
});

// Launch our app!
$(function() {
  StudentMap.init();
});

// Setup jQuery Mobile
$(document).bind("mobileinit", function() {
  $.mobile.hashListeningEnabled = false;
  $.mobile.ajaxEnabled = false;
});
