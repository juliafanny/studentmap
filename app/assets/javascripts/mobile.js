
var studentMap = function() {
  
  this.map = null;
  this.buildingMarker = null;
  this.roomMarker = null;
  
  this.currentSchool = null;
  this.currentRoom = null;
  
  this.debug = true;
  
  this.dbVersion = '1.0';
  this.db = null;
  this.tables = {
    'schools': 'CREATE TABLE IF NOT EXISTS schools (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' + 
      'name VARCHAR(255));',
    
    'buildings': 'CREATE TABLE IF NOT EXISTS buildings (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' + 
      'school_id INTEGER,' + 
      'name VARCHAR(255),' +
      'latitude DECIMAL,' +
      'longditude DECIMAL);',
      
    'rooms': 'CREATE TABLE IF NOT EXISTS rooms (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' + 
      'building_id INTEGER,' + 
      'name VARCHAR(255));'
  };
  
  this.init = function() {
    this.initDatabase(function() {
      this.loadData('schools', function() {
        this.updateSchoolsView();
      }.bind(this));
    }.bind(this));
    
    $("div#listRooms").live('pagebeforeshow', function() {
      this.loadData('school', function() {
        this.updateSchoolView();
      }.bind(this), {'id': this.currentSchool});
    }.bind(this));
    
    $("div#showRoom").live('pagebeforeshow', function(event) {
      if(event['target']['id'] == 'showRoom') {
        this.updateRoomView();
      }
    }.bind(this));
  };
  
  this.updateSchoolsView = function() {
    this.getData('*', 'schools', function(schools) {
      var ul = $("#schoolList");
      
      $(ul).empty();
      
      for(var i in schools) {
        var school = schools[i];
        var link = $('<a href="#listRooms" data-id="' + school['id'] + '">' + school['name'] + '</a>');
        
        $(ul).append(link);
        $(link).wrap('<li>');
      }
      
      $(ul).listview('refresh');
      
      $(ul).find('a').live('vclick', function(event) {
        this.currentSchool = $(event.target).attr('data-id');
      }.bind(this));
    }.bind(this));
  };
  
  this.updateSchoolView = function() {
    this.getData('*', 'schools', function(school) {
      this.getData('r.*', 'rooms r, buildings b, schools as s', 
      function(rooms) {
        var ul = $("#roomList");

        $(ul).empty();

        for(var i in rooms) {
          var room = rooms[i];
          var link = $('<a href="#showRoom" data-id="' + room['id'] + '">' + room['name'] + '</a>');

          $(ul).append(link);
          $(link).wrap('<li>');
        }

        $(ul).listview('refresh');

        $(ul).find('a').live('vclick', function(event) {
          this.currentRoom = $(event.target).attr('data-id');
        }.bind(this));

        $('#showRoom > div[data-role=header] > h1').text(school['name']);
      }.bind(this), 'WHERE b.id = r.building_id AND s.id = b.school_id AND s.id = ?', [this.currentSchool]);
    }.bind(this), 'WHERE id = ?', [this.currentSchool]);
  };
  
  this.updateRoomView = function() {
    this.getData('r.*, b.name as building_name, b.latitude as building_latitude, ' +
                 'b.longditude as building_longditude', 'rooms r, buildings b', 
      function(room) {
      var buildingLocation = new google.maps.LatLng(
          room['building_latitude'], room['building_longditude']);
      var myOptions = {
        'zoom': 16,
        'center': buildingLocation,
        'mapTypeId': google.maps.MapTypeId.SATELLITE
      };

      if(this.map == null) {
        this.map = new google.maps.Map($('#googleMap').get(0), myOptions);
        this.buildingMarker = new google.maps.Marker({
          'position': buildingLocation, 
          'map': this.map, 
          'title': room['building_name']
        });
        
        $(window).bind('orientationchange', function(){
          this.resizeMap();
        });
        this.resizeMap();
      } else {
        this.map.setCenter(buildingLocation);
        this.buildingMarker.setPosition(buildingLocation);
      }
      
      $('#showRoom > div[data-role=header] > h1').text(room['name']);
    }.bind(this), 'WHERE b.id = r.building_id AND r.id=?', [this.currentRoom]);
  };
  
  this.resizeMap = function() {
    $('#googleMap').css('width', $(window).width() + 'px');
    $('#googleMap').css('height', ($(window).height() - 45) + 'px');
  };
  
  this.getData = function(what, table, callback, where, args) {
    if(typeof(arguments) === 'undefined') {
      args = [];
    }
    if(typeof(where) === 'undefined') {
      where = '';
    }
    
    app.db.transaction(function(tx) {
      tx.executeSql('SELECT ' + what + ' FROM ' + table + ' ' + where + ';', args, 
      function(tx, result) {
        var data = [];
        
        if(result.rows.length > 1) {
          for(var i = 0; i < result.rows.length; i++) {
            data.push(result.rows.item(i));
          }
        } else if(result.rows.length == 1) {
          data = result.rows.item(0);
        }
        
        if(typeof(callback) !== 'undefined') {
          callback(data);
        }
      }.bind(this), this.dbError.bind(this));
    }.bind(this), this.dbError.bind(this));
  };
  
  this.loadData = function(name, callback, args) {
    if(typeof(args) === 'undefined') {
      args = {};
    }
    
    if(window.navigator.onLine) {
      $.ajax({
        'type': 'GET',
        'url': name + '_data',
        'dataType': 'jsonp',
        'timeout': 10000,
        'data': args,
        'success': function(data) {
          this.handleData(name, data, callback);
        }.bind(this),
        'error': function(jqXHR, textStatus) {
          this.log('get ' + name + ' data error: ' + textStatus);
          if(typeof(callback) !== 'undefined') {
            callback();
          }
        }.bind(this)
      });
    } else {
      if(typeof(callback) !== 'undefined') {
        callback();
      }
    }
  } 
  
  this.handleData = function(name, data, callback) {
    this.db.transaction(function(tx) {
      if(name == 'schools') {
        tx.executeSql('DELETE FROM schools;', [], function(tx, result) {
          for(var i in data) {
            tx.executeSql('INSERT INTO schools (id, name) VALUES (?, ?);',
                  [data[i]['id'], data[i]['name']], null, this.dbError.bind(this));
          }
        }.bind(this), this.dbError.bind(this));
      } else if(name == 'school') {
        tx.executeSql('DELETE FROM rooms;', [], function(tx, result) {
          tx.executeSql('DELETE FROM buildings;', [], function(tx, result) {
            for(var i in data['rooms']) {
              var room = data['rooms'][i];
              tx.executeSql('INSERT INTO rooms (id, building_id, name) VALUES (?, ?, ?);',
                    [room['id'], room['building_id'], room['name']], null, this.dbError.bind(this));
            }
            for(var i in data['buildings']) {
              var building = data['buildings'][i];
              tx.executeSql('INSERT INTO buildings (id, school_id, name, ' + 
                'latitude, longditude) VALUES (?, ?, ?, ?, ?);',
                [building['id'], building['school_id'], building['name'], 
                 building['latitude'], building['longditude']], 
                null, this.dbError.bind(this));
            }
          }.bind(this), this.dbError.bind(this));
        }.bind(this), this.dbError.bind(this));
        
      }
      
    }.bind(this), this.dbError.bind(this), function() {
      if(typeof(callback) !== 'undefined') {
        callback();
      }
    });
  }
  
  this.initDatabase = function(callback) {
    var dbSize = 5 * 1024 * 1024; // 5MB
    
    this.db = window.openDatabase('StudentMap', '', '', dbSize);
    
    // Check the version of the database.
    if(this.db.version != this.dbVersion) {
      // The client has an old version of the database, drop all tables.
      this.db.changeVersion(this.db.version, this.dbVersion, function(tx) {
        this.createTables(true, callback);
      }.bind(this), function(error) {
        this.dbError(null, error).bind(this);
      }.bind(this), function() {
        
      });
    } else {
      this.createTables(false, callback);
    }
  };
  this.createTables = function(dropTables, callback) {
    this.db.transaction(function(tx) {
      for(var i in this.tables) {
        if(dropTables) {
          tx.executeSql('DROP TABLE IF EXISTS ' + i, 
              null, null, this.dbError.bind(this));
        }
        tx.executeSql(this.tables[i], null, null, this.dbError.bind(this));
      }
    }.bind(this), this.dbError.bind(this), function() {
      if(typeof(callback) !== 'undefined') {
        callback();
      }
    });
  };
  this.dbError = function(tx, error) {
    this.log('db error: ' + error.message)
  };
  this.log = function(message) {
    if(this.debug && typeof console !== "undefined") {
      console.log(message)
    }
  }
  
};

app = new studentMap();

if(typeof(isMobile) !== 'undefined' && isMobile) {
  $(document).bind("mobileinit", function() {
    app.init();
  });
}
