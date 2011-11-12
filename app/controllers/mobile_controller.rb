class MobileController < ApplicationController
  
  def index
    
  end
  
  def schools_data
    @schools = School.all
    render :json => @schools.to_json, :callback => params[:callback]
  end
  
  def school_data
    @school = School.find(params[:id])
    @data = {
      'rooms' => @school.rooms,
      'buildings' => @school.buildings
    }
    render :json => @data.to_json, :callback => params[:callback]
  end

end
