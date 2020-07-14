class DeviseMailerPreview < ActionMailer::Preview

  def confirmation_instructions
    CustomDeviseMailer.confirmation_instructions(UserAccount.first, "faketoken", {})
  end

  def reset_password_instructions
    CustomDeviseMailer.reset_password_instructions(UserAccount.first, "faketoken", {})
  end

  def project_access_granted
    CustomDeviseMailer.project_access_granted(UserAccount.first, "faketoken", {})
  end

  def project_access_rejected
    CustomDeviseMailer.project_access_rejected(UserAccount.first, "faketoken", {})
  end
end
