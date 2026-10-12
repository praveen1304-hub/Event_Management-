import os
import sys
from datetime import datetime, timezone

# Add parent directory to sys.path so it can run standalone
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.extensions import db
from backend.models.admin import Admin
from backend.models.host import Host
from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.attendance import Attendance

def seed_database():
    print("[CampusPulse Seed] Seeding Database with official college data...")

    # 1. Seed Admin
    existing_admin = Admin.query.filter_by(email="admin@campuspulse.com").first()
    if not existing_admin:
        admin = Admin(
            name="Dean Academic Affairs",
            email="admin@campuspulse.com",
            role="admin",
            status="active",
            department="Academic Affairs & Student Welfare"
        )
        admin.set_password("CampusPulse@2026!")
        db.session.add(admin)
        print(" -> Created Admin: admin@campuspulse.com / CampusPulse@2026!")
    else:
        existing_admin.set_password("CampusPulse@2026!")
        print(" -> Admin already exists: admin@campuspulse.com")

    # 2. Seed Hosts
    hosts_data = [
        {
            "email": "host@campuspulse.com",
            "password": "CampusPulse@2026!",
            "name": "Dr. A. Ramanathan",
            "department": "Computer Science & Engineering",
            "organization": "CSE Association & AI Club",
            "phone": "+91 98401 23456",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
        },
        {
            "email": "host1@campuspulse.com",
            "password": "CampusPulse@2026!",
            "name": "Prof. Priya Nair",
            "department": "Information Technology",
            "organization": "ACM Student Chapter",
            "phone": "+91 98402 34567",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120"
        },
        {
            "email": "host2@campuspulse.com",
            "password": "CampusPulse@2026!",
            "name": "Dr. Suresh Kumar",
            "department": "Electronics & Communication",
            "organization": "IEEE Student Branch",
            "phone": "+91 98403 45678",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
        },
        {
            "email": "host3@campuspulse.com",
            "password": "CampusPulse@2026!",
            "name": "Prof. Ananya Sen",
            "department": "Student Affairs",
            "organization": "College Cultural Council",
            "phone": "+91 98404 56789",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120"
        }
    ]

    host_objs = []
    for hd in hosts_data:
        h = Host.query.filter_by(email=hd["email"]).first()
        if not h:
            h = Host(
                name=hd["name"],
                email=hd["email"],
                department=hd["department"],
                organization=hd["organization"],
                phone=hd["phone"],
                avatar=hd["avatar"],
                role="host",
                status="active"
            )
            h.set_password(hd["password"])
            db.session.add(h)
            print(f" -> Created Host: {hd['email']} / {hd['password']}")
        else:
            h.set_password(hd["password"])
        host_objs.append(h)

    db.session.commit()

    # Re-fetch hosts to ensure IDs exist
    h_main = Host.query.filter_by(email="host@campuspulse.com").first()
    h_it = Host.query.filter_by(email="host1@campuspulse.com").first()
    h_ece = Host.query.filter_by(email="host2@campuspulse.com").first()
    h_cult = Host.query.filter_by(email="host3@campuspulse.com").first()

    # 3. Seed Events (10 Comprehensive Events across all 10 categories)
    events_data = [
        {
            "host_id": h_main.id,
            "event_name": "Full-Stack AI & Cloud Integration Bootcamp",
            "category": "Workshop",
            "description": "Comprehensive hands-on workshop covering end-to-end full-stack AI development. Students will build and deploy cloud-connected generative AI microservices using React, Python, and Docker container pipelines.",
            "poster": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
            "event_date": "2026-08-25",
            "start_time": "09:30",
            "end_time": "16:30",
            "venue": "CSE Advanced Computing Lab, Block 3, 2nd Floor",
            "registration_deadline": "2026-08-24",
            "capacity": 120,
            "status": "Upcoming",
            "rules": [
                "Laptops with minimum 8GB RAM are mandatory for hands-on sessions.",
                "College ID Card is required at entry verification.",
                "Attendance will be marked via Digital Pass QR scanner at the lab entrance."
            ]
        },
        {
            "host_id": h_main.id,
            "event_name": "CodeStrike: 24-Hour Inter-Department Hackathon",
            "category": "Coding Event",
            "description": "The ultimate 24-hour campus hackathon! Teams compete to solve real-world college and societal problems across Web3, AI in Healthcare, Smart Campus Automation, and Sustainable Energy.",
            "poster": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
            "event_date": "2026-08-28",
            "start_time": "10:00",
            "end_time": "10:00",
            "venue": "Main Campus Auditorium & Hackathon Hall",
            "registration_deadline": "2026-08-27",
            "capacity": 200,
            "status": "Upcoming",
            "rules": [
                "Teams must consist of 2 to 4 registered college students.",
                "All code must be written during the 24-hour hackathon window.",
                "Git repositories must be publicly submitted before the deadline."
            ]
        },
        {
            "host_id": h_it.id,
            "event_name": "InnovateX: National Conference on Deep Tech & Sustainable AI",
            "category": "Paper Presentation",
            "description": "Annual technical research paper presentation symposium. Students present peer-reviewed research in Machine Learning, Computer Vision, Cybersecurity, and Edge Computing.",
            "poster": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
            "event_date": "2026-08-29",
            "start_time": "09:00",
            "end_time": "15:00",
            "venue": "Dr. APJ Abdul Kalam Seminar Hall, Admin Block",
            "registration_deadline": "2026-08-27",
            "capacity": 150,
            "status": "Upcoming",
            "rules": [
                "Presentation duration: 8 mins presentation + 4 mins Q&A by jury.",
                "Slide decks must be submitted in PDF format at least 24h prior.",
                "Formal college dress code is strictly observed."
            ]
        },
        {
            "host_id": h_it.id,
            "event_name": "Capstone Expo 2026: Senior Project Demonstrations",
            "category": "Project Presentation",
            "description": "Showcase of working hardware and software prototypes developed by final year engineering students. Open to all students, faculty, and industry evaluators.",
            "poster": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
            "event_date": "2026-09-02",
            "start_time": "10:00",
            "end_time": "16:00",
            "venue": "Campus Innovation & Project Exhibition Center",
            "registration_deadline": "2026-09-01",
            "capacity": 250,
            "status": "Upcoming",
            "rules": [
                "Working physical model or live software demo required.",
                "Project poster must follow the standard IEEE template."
            ]
        },
        {
            "host_id": h_ece.id,
            "event_name": "Quantum Computing & Post-Quantum Cryptography Seminar",
            "category": "Seminar",
            "description": "Distinguished lecture series exploring quantum circuit design, Qubits superposition, quantum entanglement algorithms, and cryptographic security for next-gen communication networks.",
            "poster": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
            "event_date": "2026-09-05",
            "start_time": "11:00",
            "end_time": "13:30",
            "venue": "ECE Department Mini Auditorium",
            "registration_deadline": "2026-09-04",
            "capacity": 100,
            "status": "Upcoming",
            "rules": [
                "Open for all engineering students and research scholars.",
                "Digital Entry Pass must be presented for seating allocation."
            ]
        },
        {
            "host_id": h_ece.id,
            "event_name": "RoboSumo & Autonomous Drone Racing Championship",
            "category": "Technical Event",
            "description": "High-octane robotics competition! Custom-built autonomous obstacle-navigating robots and FPV drones battle for the annual campus robotics trophy.",
            "poster": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
            "event_date": "2026-09-10",
            "start_time": "10:00",
            "end_time": "17:00",
            "venue": "Indoor Sports Complex & Robotics Arena",
            "registration_deadline": "2026-09-08",
            "capacity": 300,
            "status": "Upcoming",
            "rules": [
                "Robot weight must not exceed 3.0 kg for Sumo category.",
                "All drones must operate on designated 5.8 GHz channels."
            ]
        },
        {
            "host_id": h_cult.id,
            "event_name": "Dhwani 2026: Annual Inter-College Music & Dance Fest",
            "category": "Cultural Event",
            "description": "The flagship cultural festival of our college featuring battle of bands, classical instrumental fusion, solo vocals, choreography showdown, and celebrity DJ night.",
            "poster": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
            "event_date": "2026-09-15",
            "start_time": "16:00",
            "end_time": "22:00",
            "venue": "Open Air Amphitheatre (OAT), Main Campus",
            "registration_deadline": "2026-09-14",
            "capacity": 600,
            "status": "Upcoming",
            "rules": [
                "College ID Card mandatory along with Digital Entry Pass.",
                "Strict adherence to campus security protocol and conduct."
            ]
        },
        {
            "host_id": h_cult.id,
            "event_name": "Campus Olympiad: Inter-Department Athletics & Basketball Meet",
            "category": "Sports",
            "description": "Annual intramural sports tournament including 100m sprint, 4x100m relay, 3v3 basketball, badminton singles/doubles, and volleyball championship.",
            "poster": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
            "event_date": "2026-09-20",
            "start_time": "08:00",
            "end_time": "18:00",
            "venue": "College Athletic Grounds & Sports Pavilion",
            "registration_deadline": "2026-09-18",
            "capacity": 400,
            "status": "Upcoming",
            "rules": [
                "Athletes must wear standard sports attire and footwear.",
                "Medical fitness clearance required for track events."
            ]
        },
        {
            "host_id": h_main.id,
            "event_name": "AlgoClash: Speed Algorithms & Data Structures Tournament",
            "category": "Competition",
            "description": "Competitive programming contest testing fast problem solving, algorithmic complexity optimization, dynamic programming, and graph algorithms on a live leader board.",
            "poster": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
            "event_date": "2026-09-22",
            "start_time": "14:00",
            "end_time": "17:00",
            "venue": "Turing Computing Centre, Block 1",
            "registration_deadline": "2026-09-21",
            "capacity": 100,
            "status": "Upcoming",
            "rules": [
                "Allowed languages: C++, Java, Python, Rust, Go.",
                "Strict plagiarism checks with automated test vectors."
            ]
        },
        {
            "host_id": h_main.id,
            "event_name": "Campus Leadership & Student Governance Summit",
            "category": "Other",
            "description": "Interactive orientation and leadership development conference for club presidents, student council representatives, and event coordinators.",
            "poster": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
            "event_date": "2026-09-25",
            "start_time": "10:30",
            "end_time": "14:00",
            "venue": "Senate Hall, Administrative Complex",
            "registration_deadline": "2026-09-24",
            "capacity": 80,
            "status": "Upcoming",
            "rules": [
                "Open to all student coordinators and club executive members."
            ]
        }
    ]

    event_objs = []
    for ed in events_data:
        evt = Event.query.filter_by(event_name=ed["event_name"]).first()
        if not evt:
            evt = Event(
                host_id=ed["host_id"],
                event_name=ed["event_name"],
                category=ed["category"],
                description=ed["description"],
                poster=ed["poster"],
                event_date=ed["event_date"],
                start_time=ed["start_time"],
                end_time=ed["end_time"],
                venue=ed["venue"],
                registration_deadline=ed["registration_deadline"],
                capacity=ed["capacity"],
                status=ed["status"]
            )
            evt.set_rules_list(ed["rules"])
            db.session.add(evt)
            print(f" -> Created Event: {ed['event_name']}")
        event_objs.append(evt)

    db.session.commit()

    # 4. Seed Initial Registrations and Attendance
    first_evt = Event.query.filter_by(event_name="Full-Stack AI & Cloud Integration Bootcamp").first()
    second_evt = Event.query.filter_by(event_name="CodeStrike: 24-Hour Inter-Department Hackathon").first()

    if first_evt:
        sample_students = [
            ("Praveen Kumar", "21CS084", "Computer Science & Engineering", "4th Year", "praveen.kumar@college.edu", "CP-WS-90184", True),
            ("Ananya Sharma", "22IT012", "Information Technology", "3rd Year", "ananya.s@college.edu", "CP-WS-90212", True),
            ("Rohit Varma", "23AI045", "Artificial Intelligence & Data Science", "2nd Year", "rohit.v@college.edu", "CP-WS-90345", False),
            ("Sneha Reddy", "21EC089", "Electronics & Communication", "4th Year", "sneha.r@college.edu", "CP-WS-90489", False),
            ("Karthik M", "22CS105", "Computer Science & Engineering", "3rd Year", "karthik.m@college.edu", "CP-WS-90505", False),
        ]

        for s_name, s_roll, s_dept, s_yr, s_email, s_code, s_attended in sample_students:
            r = Registration.query.filter_by(event_id=first_evt.id, roll_number=s_roll).first()
            if not r:
                r = Registration(
                    event_id=first_evt.id,
                    student_name=s_name,
                    roll_number=s_roll,
                    department=s_dept,
                    year=s_yr,
                    email=s_email,
                    registration_code=s_code,
                    registration_date="2026-08-19 14:30",
                    status="CONFIRMED"
                )
                db.session.add(r)
                db.session.flush()

                if s_attended:
                    att = Attendance(
                        event_id=first_evt.id,
                        registration_id=r.id,
                        student_name=s_name,
                        roll_number=s_roll,
                        entry_code=s_code,
                        attendance_status="PRESENT",
                        scanned_at=datetime.now(timezone.utc)
                    )
                    db.session.add(att)

        first_evt.registration_count = len(first_evt.registrations)

    if second_evt:
        sample_hackathon = [
            ("Vikram Singh", "22CS142", "Computer Science & Engineering", "3rd Year", "vikram.s@college.edu", "CP-CODE-90142", True),
            ("Divya Patel", "23IT067", "Information Technology", "2nd Year", "divya.p@college.edu", "CP-CODE-90267", False),
            ("Arjun Nair", "21AI015", "Artificial Intelligence & Data Science", "4th Year", "arjun.n@college.edu", "CP-CODE-90315", False),
        ]

        for s_name, s_roll, s_dept, s_yr, s_email, s_code, s_attended in sample_hackathon:
            r = Registration.query.filter_by(event_id=second_evt.id, roll_number=s_roll).first()
            if not r:
                r = Registration(
                    event_id=second_evt.id,
                    student_name=s_name,
                    roll_number=s_roll,
                    department=s_dept,
                    year=s_yr,
                    email=s_email,
                    registration_code=s_code,
                    registration_date="2026-08-19 15:00",
                    status="CONFIRMED"
                )
                db.session.add(r)
                db.session.flush()

                if s_attended:
                    att = Attendance(
                        event_id=second_evt.id,
                        registration_id=r.id,
                        student_name=s_name,
                        roll_number=s_roll,
                        entry_code=s_code,
                        attendance_status="PRESENT",
                        scanned_at=datetime.now(timezone.utc)
                    )
                    db.session.add(att)

        second_evt.registration_count = len(second_evt.registrations)

    db.session.commit()
    print("[CampusPulse Seed] Database seeding completed successfully!")

if __name__ == "__main__":
    from backend.app import create_app
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_database()
