require "bundler/setup"
require "sinatra/base"
require 'haml'

module Website
  class ImperialPark < Sinatra::Application
    set :root, File.dirname(__FILE__)
    set :public_folder, File.expand_path("../public", __FILE__)
    set :logging, :true
    enable :sessions

    LANGUAGES = ["en", "es", "pt"]

    def self.check_language!
      condition { LANGUAGES.include?(params[:lang]) }
    end

    def self.page(path, &block)
      path = "/" + path.gsub(/^\//, '')

      get path do
        redirect "#{language}#{path}"
      end

      get "/:lang#{path}", &block
    end

    get "/" do
      redirect language
    end

    check_language!
    get "/:lang" do |lang|
      redirect "/#{lang}/index"
    end

    page "index" do
      haml :index
    end

    page "rooms" do
      haml :guest_rooms
    end

    page "lounge" do
      haml :coffee_lounge
    end

    page "restaurant" do
      haml :restaurant
    end

    page "lobby" do
      haml :lobby
    end

    page "gym" do
      haml :gym
    end

    page "events" do
      haml :events
    end

    page "services" do
      haml :services
    end

    page "location" do
      haml :location
    end

    page "gallery" do
      haml :gallery, :skip_translation => true
    end

    helpers do
      def partial(page, options={})
        haml page, options.merge!(:layout => false)
      end
    end

    def language
      @lang ||= params[:lang] || language_from_http || "en"
    end

    def current_path(options = {})
      request.url.gsub(/\/(#{language})/, "/#{options.fetch(:lang, language)}")
    end

    def language_from_http
      env["HTTP_ACCEPT_LANGUAGE"].to_s.split(",").each do |lang|
        %w(en es).each {|code| return code if lang =~ /^#{code}/ }
      end
      nil
    end

    def active_link?(route)
      request.url == route
    end

    def link_to(text, url=nil, options={}, &block)
      url, text = text, capture_haml(&block) if url.nil?
      options.merge!(:class => 'active') if active_link?(url)
      capture_haml do
        haml_tag :a, text, options.merge(:href => url)
      end
    end

    def haml(template_or_code, options={}, &block)
      layout = options.has_key?(:layout) ? options.delete(:layout) : :layout
      options[:layout] = :"#{layout}_#{language}" if layout

      skip_translation = options.delete(:skip_translation)

      if Symbol === template_or_code && !skip_translation
        super(:"#{template_or_code}_#{language}", options, &block)
      else
        super
      end
    end
  end
end


