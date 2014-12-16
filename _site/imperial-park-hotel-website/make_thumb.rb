#!/usr/bin/ruby
require 'rubygems'
require 'rmagick'
include Magick

def resize(write_dir)
  Dir.glob("#{write_dir}/*.jpg") do |fname|
    file_name = fname.split(".")[0]
    img = Magick::Image.read(fname)[0]
    img.thumbnail(0.10).write("#{file_name}-thumb.jpg")
    puts "thumb - #{file_name}-thumb.jpg"
  end
end


begin
  puts "Making thumbs"
  resize "public/images/gallery/resize"

rescue Exception => e
  puts
  puts e.message
end

