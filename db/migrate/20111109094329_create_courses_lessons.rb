class CreateCoursesLessons < ActiveRecord::Migration
  def up
  	create_table :courses_lessons, :id => false do |t|
  	 t.references :course 
  	 t.references :lesson
end
  end

  def down
  	drop_table :courses_lessons
  end
end
