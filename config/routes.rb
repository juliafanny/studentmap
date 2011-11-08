Studentmap::Application.routes.draw do
  root :to => "sessions#new"
  
  get "sign_up" => "users#new", :as => "sign_up"
  get "log_in" => "sessions#new", :as => "log_in"
  delete "log_out" => "sessions#destroy", :as => "log_out"

  resources :users

  resources :sessions, :only => [:new, :create, :destroy]
end
