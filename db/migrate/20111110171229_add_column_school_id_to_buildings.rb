class AddColumnSchoolIdToBuildings < ActiveRecord::Migration
  def change
    add_column :buildings, :school_id, :integer
  end
end
