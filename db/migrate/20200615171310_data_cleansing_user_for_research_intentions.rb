class DataCleansingUserForResearchIntentions < ActiveRecord::Migration[5.2]

  def up
    research_mappings = {
      exhibition: ['Ausstellung', 'exhibition', 'Exhibition', 'Выставка'],
      genealogy: ['Familienforschung', 'Genealogical Research', 'genealogy', 'Genealogy', 'Семейные исследования'],
      personal_interest: ['Pers?ches Interesse', 'Pers?nliches Interesse', 'Personal Interest / Other', 'Personal Interest', 'Personal Interest/Other', 'personal_interest', 'Persönl. Interesse / Sonstiges', 'Persönliches Interesse', 'Private Interest/Other', 'Личный интерес'],
      education: ['Bildungsarbeit', 'education', 'Educational Work', 'Просветительная работа'],
      art: ['art', 'Art Project', 'Kunstprojekt', 'Проект в области искусства'],
      film: ['Documentary Film', 'Documentary', 'Dokumentarfilm', 'film', 'Документальный фильм'],
      press_publishing: ['Press Publication', 'press_publishing', 'Pressepublikation', 'Publication in Press', 'Публикация в прессе'],
      school_project: ['School Project/Presentation', 'school_project', 'Schulprojekt/Referat', 'Школьный проект/реферат', 'Schulunterricht'],
      university_teaching: ['Teaching', 'Universit?re Lehre', 'Universitäre Lehre', 'Universitäre Lehre/Studium', 'University Course/Lecture', 'University Teaching/Studies', 'university_teaching', 'Университетское преподавание'],
      scientific_paper: ['Dissertation', 'Dissertation/Habilitation', 'Publication', 'Publikation', 'Scholarly Publication', 'scientific_paper', 'Wissenschaftliche Publikation', 'Диссертация', 'Научная публикация'],
      other: [ 'k. A. (Recherche-Anliegen)', 'k.A. (Recherche-Anliegen)', 'Other (research intentions)', 'other', 'Other', 'Sonstiges', 'Прочее', 'Mitarbeit', 'Project Staff (research intentions)', 'Projektmitarbeit'],
    }
    research_mappings.each do |key, value|
      User.where(research_intentions: value).update_all(research_intentions: key.to_s)
    end
  end

  def down
  end

end
