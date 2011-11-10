class RoomsController < ApplicationController

	def index
	  @search = Room.search do
	    fulltext params[:search]
	  end
	  @rooms = @search.results
	end

	def show
		@room = Room.find(params[:id])

		respond_to do |format|
	      format.html # show.html.erb
	      format.json { render json: @room }
	    end
	end

end
