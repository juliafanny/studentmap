class User < ActiveRecord::Base
	has_secure_password

	validates :password, :presence => true
	validates :email, :presence => true, :uniqueness => true,
										:format => {:with => /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i }

	has_and_belongs_to_many :courses
end
