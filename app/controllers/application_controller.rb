class ApplicationController < ActionController::Base
  has_mobile_fu
	protect_from_forgery
  
  before_filter :set_request_format
  def set_request_format
    request.format = :mobile if is_mobile_device? || request.xhr?
  end

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
