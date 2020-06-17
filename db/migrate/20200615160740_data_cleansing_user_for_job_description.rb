class DataCleansingUserForJobDescription < ActiveRecord::Migration[5.2]

  def up
    job_mappings = {
      student: ['student', 'Student(in)', 'Studentin/Student', 'University Student', 'Студент'],
      other: ['k. A. (Beruf)', 'Other (job description)', 'other', 'Other', 'Sonstiges', 'Прочее', 'Mitarbeit', 'Project Staff (job description)', 'Projektmitarbeiter'],
      teacher: ['Lehrer(in)', 'Lehrerin/Lehrer', 'teacher', 'Teacher', 'Учитель'],
      researcher: ['Dozent', 'Dozent(in)/Forscher(in)', 'Dozentin/Dozent', 'Lecturer', 'Lecturer/Researcher', 'researcher', 'Wissenschaftlerin/Wissenschaftler', 'Доцент/Научный сотрудник'],
      journalist: ['journalist', 'Journalist', 'Journalist(in)', 'Journalistin/Journalist', 'Журналист'],
      filmmaker: ['Filmemacher(in)', 'Filmemacherin/Filmemacher', 'filmmaker', 'Filmmaker', 'Автор фильмов'],
      pupil: ['Sch?lerin/Sch?ler', 'Schülerin/Schüler', 'pupil', 'Pupil', 'School Student', 'Schüler(in)', 'Учащийся'],
      memorial_staff: ['memorial_staff', 'Mitarbeiter(in) (Museen/Gedenkstätten)', 'Mitarbeiterin /Mitarbeiter (Museen / Gedenkst?tten)', 'Mitarbeiterin /Mitarbeiter (Museen / Gedenkstätten)', 'Mitarbeiterin/Mitarbeiter (Museen/Gedenkstätten)', 'Staff Member (Museums/Memorial Sites)', 'Staff Member (museums/memorial sites)', 'Сотрудник (Музеи/Мемориалы)']
    }
    job_mappings.each do |key, value|
      User.where(job_description: value).update_all(job_description: key.to_s)
    end
  end

  def down
  end

end
