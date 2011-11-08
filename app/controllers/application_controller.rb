class ApplicationController < ActionController::Base
	protect_from_forgery

  protected

  def current_user
  	@current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def set_current_user(user)
  	session[:user_id] = user.id
  	@current_user = user
  end

  def require_user
  	redirect_to(root_path, :notice => "Plz log in first.") unless current_user
  end
end
