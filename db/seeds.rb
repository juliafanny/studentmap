# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

School.create [{:name => 'KTH'}, {:name => 'SU'}]

KTH = School.first
SU = School.last

SU.buildings.create({:name => 'Arrhenius', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'Biblioteket', :latitude => nil, :longditude => nil})
a = SU.buildings.create({:name => 'Sodrahuset A', :latitude => 59.36277149185905, :longditude => 18.058784902095795})
b = SU.buildings.create({:name => 'Sodra huset B', :latitude => 59.36275030559559, :longditude => 18.059472888708115})
SU.buildings.create({:name => 'Sodra huset C', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'Sodra huset D', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'Sodra huset E', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'Sodra huset F', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS A', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS C', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS D', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS E', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS G', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS H', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS J', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS O', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS Q', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS T', :latitude => nil, :longditude => nil})
SU.buildings.create({:name => 'K- HUS Z', :latitude => nil, :longditude => nil})

100.times {|i| 
a.rooms.create({:name => 'A' << (i + 1) });
}
# a.rooms.create({:name => 'A1'});
# a.rooms.create({:name => 'A2'});
# a.rooms.create({:name => 'A3-U-N'});

b.rooms.create({:name => 'B1'});
b.rooms.create({:name => 'B2'});
b.rooms.create({:name => 'B3'});
