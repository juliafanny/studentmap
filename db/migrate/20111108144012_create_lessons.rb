class CreateLessons < ActiveRecord::Migration
  def change
    create_table :lessons do |t|
      t.string :name
      t.datetime :datetime
      t.string :teacher
      t.string :location

      t.timestamps
    end
  end
end
