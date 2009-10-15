# Controller for "static" pages in app/view/home
class HomeController < ApplicationController
  def show
    render :action => params[:page]
  end
end