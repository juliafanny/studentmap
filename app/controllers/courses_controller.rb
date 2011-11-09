class CoursesController < ApplicationController
	  def index
    # @search = Project.search do
    #   fulltext params[:search]
    # end
    # @projects = @search.results
   @courses = Course.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @courses }
    end
  end

  def show
    @course = Course.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @course }
    end
  end
end
