class School < ActiveRecord::Base
	has_many :buildings
	has_many :rooms, :through => :buildings
end
