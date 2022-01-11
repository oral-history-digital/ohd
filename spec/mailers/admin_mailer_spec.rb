require "rails_helper"

RSpec.describe AdminMailer, :type => :mailer do

  interview = FactoryBot.create :interview
  receiver = UserAccount.first || FactoryBot.create(:user_account)

  describe "finished read_transcript job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'read_transcript',
      file: 'tmp/files/transcript-cd001-de.ods',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Transkript Upload")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Transkript Upload")
      expect(mail.body.encoded).to match(interview.archive_id)
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished read_bulk_metadata job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'read_bulk_metadata',
      file: 'tmp/files/metadata-cdoh-de.ods',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Import von Metadaten")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Import von Metadaten")
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished read_bulk_texts job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'read_bulk_texts',
      file: 'tmp/files/texts-cdoh.zip',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Import von Textdateien")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Import von Textdateien")
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished read_bulk_photos job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'read_bulk_photos',
      file: 'tmp/files/photos.zip',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Import von Fotos")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Import von Fotos")
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished read_bulk_registry_entries job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'read_bulk_registry_entries',
      file: 'tmp/files/registry_entries.zip',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Import von Registereinträgen")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Import von Registereintr=C3=A4gen")
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished assign_speakers job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'assign_speakers',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match(/Sprecher\*innen zuordnen/)
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match(/Sprecher\*innen zuordnen/)
      expect(mail.body.encoded).to match(interview.archive_id)
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end

  describe "finished mark_text job" do
    mail = described_class.with(
      interview: interview,
      receiver: receiver,
      type: 'mark_text',
      locale: 'de'
    ).finished_job

    it "renders the headers" do
      expect(mail.subject).to match("Text ersetzen")
      expect(mail.subject).to match(interview.project.name)
      expect(mail.to).to eq([receiver.email])
      expect(mail.from).to eq(["noreply@cedis.fu-berlin.de"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Text ersetzen")
      expect(mail.body.encoded).to match(interview.archive_id)
      expect(mail.body.encoded).to match("Bitte pr=C3=BCfen Sie Vollst=C3=A4ndigkeit und Korrektheit der importiert=")
    end
  end
end
