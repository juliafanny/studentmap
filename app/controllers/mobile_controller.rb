class MobileController < ApplicationController
  
  def index
    if(request.format != :mobile) 
      redirect_to "/"
    end
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
  
  def rooms_data
    @school = School.find(params[:id])
    render :json => @school.rooms.to_json, :callback => params[:callback]
  end
  
  def buildings_data
    @school = School.find(params[:id])
    render :json => @school.buildings.to_json, :callback => params[:callback]
  end

end
