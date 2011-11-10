class SchoolsController < ApplicationController
  
  def index
  	@schools = School.all

	respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @schools }
    end
  end

  def show
  	@school = School.find(params[:id])
    
    if params[:search] && params[:search].length > 0
      @search = Room.search do
        fulltext params[:search]
      end
      @rooms = @search.results
    else 
      @rooms = @school.rooms
    end

  	respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @school }
    end
  end
end
