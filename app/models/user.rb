class User < ActiveRecord::Base
	#attr_accessible :email, :password, :password_confirmation, :assets_attributes
	has_secure_password

	validates :password, :presence => true
	validates :email, :presence => true, :uniqueness => true,
										:format => {:with => /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i }

end
