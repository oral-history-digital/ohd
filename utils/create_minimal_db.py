# /// script
# requires-python = ">=3.14"
# dependencies = [
#     "pymysql",
#     "sqlalchemy",
# ]
# ///

import os
from sqlalchemy import Column, Integer, String, ForeignKey, Text, create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base


DB_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/ohd_archive_minimal")
PORTAL_URL = os.getenv("PORTAL_URL", "http://portal.oral-history.localhost:3000")


Base = declarative_base()

# Models

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    shortname = Column(String(50), unique=True)
    archive_domain = Column(String(255))

class Interview(Base):
    __tablename__ = 'interviews'
    id = Column(Integer, primary_key=True)
    archive_id = Column(String(20))  # z. B. 'cd001'
    project_id = Column(Integer, ForeignKey('projects.id'))

class Segment(Base):
    __tablename__ = 'segments'
    id = Column(Integer, primary_key=True)
    interview_id = Column(String(20), ForeignKey('interviews.id'))

class SegmentTranslation(Base):
    __tablename__ = 'segment_translations'
    id = Column(Integer, primary_key=True)
    segment_id = Column(Integer, ForeignKey('segments.id'))

class InstitutionProject(Base):
    __tablename__ = 'institution_projects'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))
    institution_id = Column(Integer)

class Institution(Base):
    __tablename__ = 'institutions'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('institutions.id'))

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    task_type_id = Column(Integer, ForeignKey('task_types.id'))

class TaskType(Base):
    __tablename__ = 'task_types'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'))






def main() -> None:
    engine = create_engine(DB_URL, echo=False)  # echo=True für Debugging
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        print("🔍 Identifiziere zu behaltende Entitäten...")

        # 1. Projekte behalten
        keep_project_shortnames = {"ohd", "cd"}
        projects_to_keep = session.query(Project).filter(Project.shortname.in_(keep_project_shortnames)).all()
        project_ids = {p.id for p in projects_to_keep}
        if len(project_ids) != 2:
            raise ValueError(f"Erwartete 2 Projekte ({keep_project_shortnames}), fand aber {len(project_ids)}")

        # 2. Interviews behalten
        keep_interview_ids = {"cd001"}
        interviews_to_keep = session.query(Interview).filter(Interview.archive_id.in_(keep_interview_ids)).all()
        interview_ids = {i.id for i in interviews_to_keep}
        if len(interview_ids) != 1:
            raise ValueError(f"Interview 'cd001' nicht gefunden!")

        print(f"Behalte Projekte: {project_ids}, Interviews: {interview_ids}")

        # 3. Update archive_domain
        session.query(Project).filter(Project.id == [p.id for p in projects_to_keep if p.shortname == 'ohd'][0]).update(
            {"archive_domain": PORTAL_URL}
        )
        session.query(Project).filter(Project.id == [p.id for p in projects_to_keep if p.shortname == 'cd'][0]).update(
            {"archive_domain": None}
        )

        # 4. Lösche in korrekter Reihenfolge (von Blättern zu Wurzeln)

        # Segments and translations.
        delete_segments_stmt = text("""
            DELETE s, st
            FROM segments s
            JOIN segment_translations st ON s.id = st.segment_id
            WHERE s.interview_id NOT IN :interview_ids
        """)
        session.execute(delete_segments_stmt, {"interview_ids": list(interview_ids)})
        print("✅ Segmente und Segment-Übersetzungen gelöscht…")


        # Interviews
        session.query(Interview).filter(~Interview.id.in_(interview_ids)).delete(synchronize_session=False)
        print("✅ Interviews gelöscht…")


        # Projekt-bezogene Tabellen (alle mit project_id)
        tables_with_project_id = [
            # Füge hier alle Tabellen hinzu, die eine Spalte `project_id` haben
            # Achte auf Reihenfolge: zuerst abhängige Tabellen löschen!
            ('registry_references', 'registry_entries', 'project_id'),  # komplexer Fall → siehe unten
            ('access_configs', None, 'project_id'),
            ('archiving_batches', None, 'project_id'),
            ('collections', None, 'project_id'),
            ('contribution_types', None, 'project_id'),
            ('event_types', None, 'project_id'),
            ('institution_projects', None, 'project_id'),
            ('map_sections', None, 'project_id'),
            ('metadata_fields', None, 'project_id'),
            ('people', None, 'project_id'),
            ('registry_name_types', None, 'project_id'),
            ('roles', None, 'project_id'),
        ]

        for table_name, join_table, col_name in tables_with_project_id:
            if join_table:
                # Spezialfall: registry_references → registry_entries
                # Lösche zuerst Referenzen, dann Einträge
                session.execute(text(f"""
                    DELETE rr FROM registry_references rr
                    JOIN registry_entries re ON rr.registry_entry_id = re.id
                    WHERE re.project_id NOT IN :project_ids
                """), {"project_ids": list(project_ids)})

                session.execute(text(f"""
                    DELETE FROM registry_entries
                    WHERE project_id NOT IN :project_ids
                """), {"project_ids": list(project_ids)})
            else:
                session.execute(text(f"""
                    DELETE FROM {table_name}
                    WHERE {col_name} NOT IN :project_ids
                """), {"project_ids": list(project_ids)})


        # Projekte
        session.query(Project).filter(~Project.id.in_(project_ids)).delete(synchronize_session=False)
        print("✅ Archive (Projekte) gelöscht…")

        session.query(Task).delete(synchronize_session=False)
        session.query(TaskType).delete(synchronize_session=False)
        print("✅ Tasks und TaskTypes gelöscht…")



        session.commit()
        print("✅ Datenbank erfolgreich reduziert!")


    except Exception as e:
        session.rollback()
        print(f"❌ Fehler: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
