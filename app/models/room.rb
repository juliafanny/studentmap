class Room < ActiveRecord::Base
	belongs_to :building

	searchable do
		text :name
	end
end
