# M. Asim — The Chemistry Series ⌬

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-black.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-red.svg)](https://www.sqlalchemy.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Cinematic, Netflix/Awwwards-grade Academic & Bench Chemistry Portfolio**  
> Showcasing undergraduate research in Organic Synthesis, Computational Chemistry, Coordination Complexes, and Analytical Metrology.

---

## 🌟 Overview & Screen Architecture

The portfolio is structured into **seven seamless fullscreen (`100svh`) viewports** with CSS scroll-snap transitions, alternating dark, white, and signature berry (`#952a65`) palette sequences:

1. **Screen 1: Hero (`#home`)** — High-impact display typography (`THE CHEMISTRY SERIES.`), active lab research status pill, dynamic intro, and interactive portrait card.
2. **Screen 2: About (`#about`)** — Scholar profile, verified bench hours (600+ Hours, 100% GLP Compliance, 10+ Instruments), and academic highlights.
3. **Screen 3: Education Timeline (`#education`)** — Full academic trajectory featuring BS Chemistry (Hons) (CGPA 3.82), FSc Pre-Medical (884/1100 • 80.36%), and Matriculation (1087/1100 • 98.82%).
4. **Screen 4: The Full Story (`#resume`)** — Three sequential research milestones alongside a unified analytics dashboard covering **Primary Synthesis & Computational Domains**, bench expertise meters, and modeling software.
5. **Screen 5: Credentials & Honors (`#certifications`)** — Six accredited credentials in synthesis kinetics, instrumental spectroscopy (FTIR/UV-Vis), GLP compliance, and academic distinctions.
6. **Screen 6: Original Builds & Research (`#originals`)** — Six benchmark laboratory research dossiers formatted as a modern laboratory dashboard (Schiff Base Complexes, Water Heavy Metal Assay, Botanical Flavonoids, Aspirin Esterification, Crystal Violet Kinetics, and EDTA Water Hardness).
7. **Screen 7: Contact / To Be Continued (`#contact`)** — Centered collaboration hub, direct email link, and research network channels.

---

## 🛠️ Technology Stack

- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-WTF, Flask-Mail, Flask-Limiter
- **Database:** SQLite (persisted in `instance/portfolio.db`) with modular SQLAlchemy models
- **Frontend:** Semantic HTML5, Custom CSS3 (CSS Variables, Flexbox, CSS Grid, Scroll-Snap, Clamp Typography), Vanilla JavaScript
- **Typography:** Bebas Neue (Display) & Poppins (Sans & Technical Body)
- **Icons:** Font Awesome 6.4

---

## 📂 Project Structure

```text
m_asim_portfolio/
├── app.py                      # Application entry point & factory loader
├── config.py                   # Configuration classes (Development, Production, Testing)
├── extensions.py               # Flask extensions initialization (db, mail, limiter, csrf)
├── models.py                   # SQLAlchemy models (Education, Certification, Project, etc.)
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── index.html                  # Standalone previewable static HTML page
│
├── blueprints/                 # Modular Flask blueprints
│   ├── public/                 # Public-facing views & message contact handler
│   │   ├── __init__.py
│   │   └── routes.py
│   └── admin/                  # Secure administrative dashboard & content management
│       ├── __init__.py
│       └── routes.py
│
├── css/                        # Static standalone stylesheet
│   └── style.css
│
├── js/                         # Static standalone JavaScript
│   └── main.js
│
├── assets/                     # Portfolio imagery & media assets
│   └── asim.jpeg
│
├── static/                     # Flask static assets
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── main.js
│   │   └── admin.js
│   └── images/
│
├── templates/                  # Jinja2 dynamic templates
│   ├── base.html
│   ├── index.html
│   ├── admin/
│   │   ├── base_admin.html
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   └── verify_otp.html
│   └── errors/
│       ├── base_error.html
│       ├── 404.html
│       └── 500.html
│
└── instance/                   # Runtime SQLite database
    └── portfolio.db
```

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/m_asim_portfolio.git
cd m_asim_portfolio
```

### 2. Create and Activate a Virtual Environment
```bash
# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```
Open your browser and navigate to:
```text
http://127.0.0.1:5000/
```

> **Note:** The SQLite database comes pre-seeded with all research dossiers, academic records, certifications, and settings in `instance/portfolio.db`.

---

## 🔒 Admin Dashboard

Access the administrative interface at `/admin/login` to manage:
- Academic milestones and degrees
- Laboratory dossiers and projects
- Certifications and verified credentials
- Contact messages and inquiries

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
