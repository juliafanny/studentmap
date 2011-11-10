class Building < ActiveRecord::Base
	has_many :rooms
	belongs_to :school
end
