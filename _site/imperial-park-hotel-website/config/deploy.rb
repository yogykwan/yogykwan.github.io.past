set :keep_releases,       2
set :application,         "imperial_park"
set :user,                "tom"
set :deploy_to,           "/var/www/apps/#{application}"
set :repository,          "git@github.com:tomaadland/imperial-park-hotel-website.git"
set :scm,                 :git
set :use_sudo,            false
set :deploy_via,          :remote_cache
set :term,                "linux"
set :rails_env,           'production'

ssh_options[:forward_agent] = true
# ssh_options[:port] = 24504


role :web, "71.19.144.108"
role :app, "71.19.144.108"
role :db,  "71.19.144.108", :primary => true # This is where Rails migrations will run

$:.unshift(File.expand_path('./lib', ENV['rvm_path'])) # Add RVM's lib directory to the load path.
require "rvm/capistrano"                  # Load RVM's capistrano plugin.
set :rvm_ruby_string, 'ruby-1.9.2-p180@imperial_park'        # Or whatever env you want it to run in.

namespace :deploy do
  namespace :imperial do
    task :restart, :roles => :app, :except => {:no_release => true} do
      run "touch #{current_path}/tmp/restart.txt"
    end
  end 
end
  
deploy.task :restart, :roles => :app  do 
  deploy.imperial.restart
end



