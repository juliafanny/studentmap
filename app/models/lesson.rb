class Lesson < ActiveRecord::Base
	has_and_belongs_to_many :courses
	belongs_to :location
end
