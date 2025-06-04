# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def latex_escape(text)
    LatexToPdf.escape_latex(text)
  end
end
