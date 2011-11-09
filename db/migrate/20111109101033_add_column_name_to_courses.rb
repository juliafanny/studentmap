class AddColumnNameToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :name, :string
  end
end
