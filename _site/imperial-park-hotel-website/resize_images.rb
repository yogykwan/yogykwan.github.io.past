#!/usr/bin/ruby
require 'rubygems'
require 'rmagick'
include Magick

def resize(write_dir)
  Dir.glob("#{write_dir}/emperador_*.jpg") do |fname|
    file_name = fname.split(".")[0]
    img = Magick::Image.read(fname)[0]
    img.scale(0.4).write(fname){|f| f.quality = 0.6 }
    puts "rezise - #{file_name}"
  end
end


begin
  puts "Making thumbs"
  resize "public/images/gallery"

rescue Exception => e
  puts
  puts e.message
end

