class CreateBuildings < ActiveRecord::Migration
  def change
    create_table :buildings do |t|
      t.string :name
      t.decimal :latitude
      t.decimal :longditude

      t.timestamps
    end
  end
end
