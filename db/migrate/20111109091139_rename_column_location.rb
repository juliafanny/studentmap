class RenameColumnLocation < ActiveRecord::Migration
  def up
  	remove_column :lessons, :location
  	add_column :lessons, :location_id, :integer
  end

  def down
  end
end
