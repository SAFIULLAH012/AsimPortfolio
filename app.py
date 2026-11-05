"""
Flask Portfolio CMS — Application Factory
"""
import os
import logging
import click
from datetime import datetime, timezone

from flask import Flask, render_template
from dotenv import load_dotenv

from config import config_map
from extensions import db, csrf, mail, limiter
from utils.security import apply_security_headers

_base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_base_dir, ".env"))


def create_app(env: str | None = None) -> Flask:
    """Create and configure the Flask application."""
    if env is None:
        env = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__, instance_relative_config=False)

    # ── Load config ───────────────────────────────────────────────────────────
    cfg = config_map.get(env, config_map["default"])
    app.config.from_object(cfg)

    # ── Production secret key validation ─────────────────────────────────────
    if env == "production":
        try:
            cfg.validate()
        except RuntimeError as e:
            raise RuntimeError(str(e)) from e

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # ── Init extensions ───────────────────────────────────────────────────────
    db.init_app(app)
    csrf.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)

    # ── Ensure database tables & seed exist ────────────────────────────────────
    with app.app_context():
        try:
            import models
            db.create_all()
            _seed_database()
        except Exception as e:
            app.logger.warning("Database auto-init notice: %s", e)

    # ── Jinja Filters & Context Processors ──────────────────────────────────
    import json
    @app.template_filter("from_json")
    def from_json_filter(value):
        try:
            return json.loads(value) if value else []
        except (ValueError, TypeError):
            return []

    @app.context_processor
    def inject_globals():
        return {"now": lambda: datetime.now(timezone.utc)}

    # ── Security headers & ProxyFix ───────────────────────────────────────────
    from werkzeug.middleware.proxy_fix import ProxyFix
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    app.after_request(apply_security_headers)

    # ── Register blueprints ───────────────────────────────────────────────────
    from blueprints.public import public_bp
    from blueprints.admin import admin_bp
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    # ── SEO: robots.txt & sitemap.xml ─────────────────────────────────────────
    register_seo_routes(app)

    # ── Error handlers ────────────────────────────────────────────────────────
    register_error_handlers(app)

    # ── CLI commands ──────────────────────────────────────────────────────────
    register_cli_commands(app)

    # ── Logging ───────────────────────────────────────────────────────────────
    configure_logging(app)

    return app


def register_seo_routes(app: Flask) -> None:
    """Register robots.txt, sitemap.xml, and legal pages for SEO."""
    from flask import Response, request as flask_request
    from models import Project

    @app.route("/robots.txt")
    def robots_txt():
        host = flask_request.host_url.rstrip("/")
        content = (
            "User-agent: *\n"
            "Allow: /\n"
            "Disallow: /admin/\n"
            "Disallow: /admin/login\n"
            "\n"
            f"Sitemap: {host}/sitemap.xml\n"
        )
        return Response(content, mimetype="text/plain")

    @app.route("/sitemap.xml")
    def sitemap_xml():
        from datetime import datetime, timezone
        from models import Project, SiteSettings
        host = flask_request.host_url.rstrip("/")
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        settings = None
        try:
            settings = SiteSettings.query.first()
        except Exception:
            pass

        home_mod = settings.updated_at.strftime("%Y-%m-%d") if (settings and settings.updated_at) else today

        pages = [
            {"loc": f"{host}/", "priority": "1.0", "changefreq": "weekly", "lastmod": home_mod},
            {"loc": f"{host}/privacy-policy", "priority": "0.3", "changefreq": "yearly", "lastmod": "2026-10-10"},
            {"loc": f"{host}/terms", "priority": "0.3", "changefreq": "yearly", "lastmod": "2026-10-10"},
        ]

        # Dynamic project pages with authentic lastmod
        try:
            projects = Project.query.filter_by(published=True).order_by(Project.display_order.asc()).all()
            for p in projects:
                p_mod = p.updated_at.strftime("%Y-%m-%d") if p.updated_at else today
                pages.append({
                    "loc": f"{host}/projects/{p.slug}",
                    "priority": "0.8",
                    "changefreq": "monthly",
                    "lastmod": p_mod,
                })
        except Exception:
            pass

        xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>']
        xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        for page in pages:
            xml_lines.append("  <url>")
            xml_lines.append(f"    <loc>{page['loc']}</loc>")
            xml_lines.append(f"    <lastmod>{page['lastmod']}</lastmod>")
            xml_lines.append(f"    <changefreq>{page['changefreq']}</changefreq>")
            xml_lines.append(f"    <priority>{page['priority']}</priority>")
            xml_lines.append("  </url>")
        xml_lines.append("</urlset>")

        return Response("\n".join(xml_lines), mimetype="application/xml")

    @app.route("/privacy-policy")
    def privacy_policy():
        from models import SiteSettings as Settings
        settings = Settings.query.first()
        return render_template("privacy_policy.html", settings=settings)

    @app.route("/terms")
    def terms():
        from models import SiteSettings as Settings
        settings = Settings.query.first()
        return render_template("terms.html", settings=settings)

    @app.route("/thank-you")
    def thank_you():
        from models import SiteSettings as Settings
        settings = Settings.query.first()
        name = flask_request.args.get("name", "")
        email = flask_request.args.get("email", "")
        return render_template("thank_you.html", settings=settings, name=name, email=email)


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(400)
    def bad_request(e):
        return render_template("errors/400.html"), 400

    @app.errorhandler(403)
    def forbidden(e):
        return render_template("errors/403.html"), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template("errors/404.html"), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return render_template("errors/404.html"), 405

    @app.errorhandler(429)
    def too_many_requests(e):
        return render_template("errors/429.html"), 429

    @app.errorhandler(500)
    def server_error(e):
        app.logger.exception("Internal server error")
        return render_template("errors/500.html"), 500


def register_cli_commands(app: Flask) -> None:
    @app.cli.command("init-db")
    def init_db():
        """Create database tables and seed default content."""
        with app.app_context():
            import models
            db.create_all()
            _seed_database()
            click.echo("Database initialized and seeded.")

    @app.cli.command("create-admin")
    @click.argument("username")
    @click.argument("email")
    @click.password_option()
    def create_admin(username, email, password):
        """Create an admin account."""
        from models import Admin
        with app.app_context():
            db.create_all()
            if Admin.query.filter_by(username=username).first():
                click.echo(f"Admin '{username}' already exists.")
                return
            admin = Admin(username=username, email=email)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            click.echo(f"Admin account '{username}' created successfully.")

    @app.cli.command("reset-password")
    @click.argument("username")
    def reset_password(username):
        """Reset the password and/or username for an existing admin account."""
        from models import Admin, AdminOTP
        from utils.security import send_otp_email
        import click
        with app.app_context():
            admin = Admin.query.filter_by(username=username).first()
            if not admin:
                click.echo(f"Error: Admin user '{username}' not found.")
                return

            past_password = click.prompt("Past password", hide_input=True)
            if not admin.check_password(past_password):
                click.echo("Error: Incorrect past password.")
                return

            click.echo(f"Generating OTP for {admin.email}...")
            otp_code = AdminOTP.generate_otp(admin.id, purpose="cli_reset", valid_minutes=10)
            sent = send_otp_email(admin.email, otp_code, "CLI credential reset")
            if not sent:
                click.echo(f"Warning: SMTP not configured. Generated OTP is: {otp_code}")

            entered_otp = click.prompt("Enter OTP")
            if not AdminOTP.verify_otp(admin.id, entered_otp, purpose="cli_reset"):
                click.echo("Error: Invalid or expired OTP.")
                return

            new_username = click.prompt("New username (leave blank to keep current)", default=admin.username)
            if new_username and new_username != admin.username:
                existing = Admin.query.filter_by(username=new_username).first()
                if existing:
                    click.echo(f"Error: Username '{new_username}' is already taken.")
                    return
                admin.username = new_username

            new_password = click.prompt("New password (leave blank to keep current)", default="", hide_input=True)
            if new_password:
                admin.set_password(new_password)

            db.session.commit()
            click.echo(f"Credentials for admin '{admin.username}' have been updated successfully.")



def _seed_database() -> None:
    """Seed the database with initial chemistry portfolio data for M. Asim."""
    from models import (
        Admin, Project, Skill, Education, Certification, Experience, SiteSettings,
    )
    import json

    # Auto-migration: ensure newly added columns exist in sqlite table
    try:
        from sqlalchemy import text
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE site_settings ADD COLUMN whatsapp_number VARCHAR(50) DEFAULT '+923000000000'"))
            conn.commit()
    except Exception:
        pass

    # Settings
    settings_obj = SiteSettings.query.first()
    if not settings_obj:
        s = SiteSettings(
            name="M. Asim",
            headline="Chemistry Research Scholar & Laboratory Analyst",
            bio=(
                "Chemistry student at the University of Layyah (5th Semester, CGPA 3.82/4.00) "
                "specializing in Organic Synthesis, Spectroscopic Characterization (FTIR, UV-Vis, NMR), "
                "and Analytical Instrumentation. Dedicated to experimental precision, Good Laboratory "
                "Practices (GLP), and reproducible scientific research."
            ),
            location="Layyah, Punjab, Pakistan",
            contact_email="m.asim.chemistry@gmail.com",
            github_url="https://github.com",
            linkedin_url="https://linkedin.com",
            whatsapp_number="+923000000000",
            site_title="M. Asim | BS Chemistry Scholar & Laboratory Researcher",
            meta_description=(
                "Explore undergraduate laboratory research, organic synthesis protocols, and spectroscopic "
                "analyses by M. Asim, Chemistry Scholar at the University of Layyah."
            ),
            hero_description=(
                "Passionate Chemistry Student & Laboratory Researcher specializing in Organic Synthesis, "
                "Spectroscopic Characterization (FTIR, UV-Vis, NMR), and Analytical Instrumentation. Dedicated to "
                "experimental precision, Good Laboratory Practices (GLP), and rigorous scientific inquiry."
            ),
            hero_tags=json.dumps(["BS Chemistry Scholar", "University of Layyah", "5th Semester (CGPA 3.82)", "Spectroscopy & Synthesis"]),
            about_domain="Organic Synthesis & Instrumental Spectroscopy",
            why_work_with_me=json.dumps([
                "Academic excellence: 5th Semester BS Chemistry with a high 3.82 / 4.00 CGPA",
                "Demonstrated track record: Matric 98.82% (1087/1100) & FSc 80.00% (880/1100)",
                "600+ bench hours executing multi-step synthesis, reflux setups & column chromatography",
                "Certified Good Laboratory Practices (GLP) and zero-incident compliance record"
            ]),
            projects_badge_count="6+",
            github_handle="@MAsimChem",
            availability="Open for Research Collaboration",
            profile_image="assets/asim.jpeg",
        )
        db.session.add(s)
    else:
        settings_obj.name = "M. Asim"
        settings_obj.headline = "Chemistry Research Scholar & Laboratory Analyst"
        settings_obj.profile_image = "assets/asim.jpeg"
        settings_obj.contact_email = "m.asim.chemistry@gmail.com"
        db.session.commit()

    # Education (Matric, FSc, BS Chemistry)
    if not Education.query.first():
        edu_data = [
            {
                "institution": "BISE Board Examination, Punjab",
                "degree": "Matriculation (Science Group)",
                "level": "Matric (SSC)",
                "start_year": "2018",
                "end_year": "2020",
                "score": "1087/1100 (98.82%)",
                "score_label": "Score",
                "description": "Secondary school certificate with exceptional distinction in Science subjects (Chemistry, Physics, Biology, Mathematics), ranking in the top academic tier.",
                "display_order": 1,
            },
            {
                "institution": "BISE Board Examination, Punjab",
                "degree": "Higher Secondary School Certificate (FSc Pre-Medical)",
                "level": "Intermediate (HSSC)",
                "start_year": "2020",
                "end_year": "2022",
                "score": "880/1100 (80.00%)",
                "score_label": "Score",
                "description": "Pre-medical concentration focusing on Chemistry, Biology, and Physics, establishing rigorous laboratory foundations and scientific problem solving.",
                "display_order": 2,
            },
            {
                "institution": "University of Layyah, Punjab",
                "degree": "Bachelor of Science in Chemistry (BS Hons)",
                "level": "Undergraduate (BS)",
                "start_year": "2022",
                "end_year": "Present",
                "score": "3.82 / 4.00",
                "score_label": "CGPA",
                "description": "Currently in 5th Semester maintaining an outstanding 3.82 CGPA. Advanced coursework in Organic Synthesis, Physical Chemistry & Kinetics, Coordination Complexes, Biochemistry & Instrumental Spectroscopy.",
                "display_order": 3,
            },
        ]
        for ed in edu_data:
            db.session.add(Education(**ed))

    # Certifications (6 Certifications / Achievements)
    if not Certification.query.first():
        certs_data = [
            {
                "title": "Advanced Organic Synthesis & Reaction Kinetics",
                "issuer": "Department of Chemistry • Lab Practicum Division",
                "issue_date": "Fall 2024",
                "credential_url": "#",
                "image": "",
                "display_order": 1,
            },
            {
                "title": "Instrumental Analytical Spectroscopy (FTIR & UV-Vis)",
                "issuer": "Central Instrumental Analysis Laboratory",
                "issue_date": "Spring 2024",
                "credential_url": "#",
                "image": "",
                "display_order": 2,
            },
            {
                "title": "Good Laboratory Practices (GLP) & Chemical Safety",
                "issuer": "Laboratory Safety & Environmental Compliance Board",
                "issue_date": "Fall 2023",
                "credential_url": "#",
                "image": "",
                "display_order": 3,
            },
            {
                "title": "Academic Merit Honor Roll (CGPA 3.82 Distinction)",
                "issuer": "University of Layyah Academic Affairs Council",
                "issue_date": "Session 2022–Present",
                "credential_url": "#",
                "image": "",
                "display_order": 4,
            },
            {
                "title": "Quantitative Metrology & Complexometric Titrimetry",
                "issuer": "Division of Quantitative & Analytical Chemistry",
                "issue_date": "Spring 2024",
                "credential_url": "#",
                "image": "",
                "display_order": 5,
            },
            {
                "title": "Undergraduate Chemical Research & Poster Symposium",
                "issuer": "Inter-University Chemistry Research Forum",
                "issue_date": "Annual 2024",
                "credential_url": "#",
                "image": "",
                "display_order": 6,
            },
        ]
        for cert in certs_data:
            db.session.add(Certification(**cert))

    # Skills
    if not Skill.query.first():
        skills_data = [
            {"name": "Organic Synthesis", "category": "Synthetic Chemistry", "proficiency": 92,
             "icon_class": "fas fa-flask",
             "tags": json.dumps(["Reflux", "Recrystallization", "Schiff Bases", "Yield Optimization"]), "display_order": 1},
            {"name": "Molecular Spectroscopy", "category": "Instrumental Analysis", "proficiency": 94,
             "icon_class": "fas fa-wave-square",
             "tags": json.dumps(["FTIR Interferometry", "UV-Vis Beer-Lambert", "1H/13C NMR", "Flame Photometry"]), "display_order": 2},
            {"name": "Separation & Chromatography", "category": "Analytical Methods", "proficiency": 88,
             "icon_class": "fas fa-filter",
             "tags": json.dumps(["TLC Silica 60", "Column Chromatography", "Soxhlet Extraction", "Rotovap"]), "display_order": 3},
            {"name": "Quantitative Titrations", "category": "Chemical Metrology", "proficiency": 96,
             "icon_class": "fas fa-balance-scale",
             "tags": json.dumps(["Complexometric EDTA", "Redox KMnO4", "Gravimetry", "Error Propagation"]), "display_order": 4},
            {"name": "Chemical Kinetics & Thermo", "category": "Physical Chemistry", "proficiency": 89,
             "icon_class": "fas fa-bolt",
             "tags": json.dumps(["Pseudo-1st Order", "Arrhenius Plots", "Viscometry", "Conductometry"]), "display_order": 5},
            {"name": "GLP Safety & Software", "category": "Compliance & Tools", "proficiency": 98,
             "icon_class": "fas fa-shield-alt",
             "tags": json.dumps(["ChemDraw Pro", "OriginLab 2024", "MestReNova", "NFPA 704"]), "display_order": 6},
        ]
        for sd in skills_data:
            db.session.add(Skill(**sd))

    # Projects (6 Benchmark Laboratory Research Dossiers)
    if not Project.query.first():
        projects_data = [
            {
                "title": "Synthesis & Characterization of Schiff Base Transition Metal Complexes",
                "slug": "schiff-base-metal-complexes",
                "short_description": "Multi-step condensation of salicylaldehyde with primary aromatic amines, coordinating Cu(II) and Zn(II) ions with 88.4% isolated yield.",
                "description": "Multi-step condensation of salicylaldehyde with primary aromatic amines, coordinating Cu(II) and Zn(II) ions. Characterized via infrared C=N stretch shifts and UV-Vis d-d electronic transitions with 88.4% isolated yield.",
                "problem_statement": "Coordination ligands and their transition metal complexes exhibit significant catalytic and antimicrobial properties, requiring strict solvent control and stoichiometric balance.",
                "category": "Organic & Inorganic Synthesis",
                "github_url": "#",
                "dataset": "Analytical batch of 15 synthesized chelates under single/dual solvent recrystallization.",
                "model_architecture": "Square-planar and octahedral coordination geometries verified through spectrochemical series.",
                "preprocessing": "Vacuum desiccator drying and recrystallization using ethanol/water mixtures.",
                "metrics": json.dumps({"Yield": "88.4%", "Melting Point": "184-186°C", "Purity": ">98%"}),
                "technologies": json.dumps(["Reflux", "Recrystallization", "FTIR", "UV-Vis", "Büchner Filtration"]),
                "results": "Obtained crystalline micro-needles with sharp melting point range 184-186°C and verified azomethine linkage.",
                "limitations": "Benchwork conducted at laboratory scale (sub-10g batch size).",
                "featured": True,
                "display_order": 1,
            },
            {
                "title": "FTIR & UV-Vis Spectrophotometric Analysis of Paracetamol Formulations",
                "slug": "ftir-uvvis-paracetamol-spectroscopy",
                "short_description": "Diagnostic absorption assay measuring phenolic O-H (3325 cm⁻¹) and amide C=O (1650 cm⁻¹) stretching frequencies, constructing linear Beer-Lambert calibration curves.",
                "description": "Diagnostic absorption assay measuring phenolic O-H (3325 cm⁻¹) and amide C=O (1650 cm⁻¹) stretching frequencies. Beer-Lambert calibration curve constructed across 2-20 μg/mL with R² = 0.9992.",
                "problem_statement": "Pharmaceutical active ingredient quality control requires rapid, reproducible spectroscopic verification without destructive chromatography.",
                "category": "Spectroscopic Identification",
                "github_url": "#",
                "dataset": "Standardized paracetamol reference samples compared against commercial OTC tablets.",
                "model_architecture": "Double-beam spectrophotometry with quartz cuvettes (1.00 cm path length).",
                "preprocessing": "Quantitative volumetric serial dilution with spectroscopic grade methanol.",
                "metrics": json.dumps({"R² Value": "0.9992", "λmax": "243 nm", "Recovery": "99.4%"}),
                "technologies": json.dumps(["UV-Vis Spectrophotometry", "FTIR", "Beer-Lambert Law", "OriginLab"]),
                "results": "Verified λmax at 243 nm and validated active pharmaceutical ingredient content within ±0.6% USP limits.",
                "limitations": "Turbid excipients require secondary syringe membrane microfiltration.",
                "featured": True,
                "display_order": 2,
            },
            {
                "title": "Chemical Kinetics: Acid-Catalyzed Ester Hydrolysis by Conductometry",
                "slug": "ester-hydrolysis-kinetics",
                "short_description": "Investigation into pseudo-first-order rate kinetics of methyl acetate hydrolysis, deriving rate constant k = 2.45 × 10⁻³ s⁻¹ and activation energy Ea = 58.4 kJ/mol.",
                "description": "Investigation into pseudo-first-order rate kinetics of methyl acetate hydrolysis at varying temperatures (25°C to 45°C). Derivation of Arrhenius activation energy Ea = 58.4 kJ/mol.",
                "problem_statement": "Understanding catalytic reaction dynamics and temperature dependency enables optimal scale-up and mechanism confirmation.",
                "category": "Physical Chemistry & Kinetics",
                "github_url": "#",
                "dataset": "Dynamic conductance readings sampled at 60-second intervals across 4 isothermal runs.",
                "model_architecture": "Ostwald thermostatic water bath and dip-type conductivity cell.",
                "preprocessing": "Reagent thermal equilibration to ±0.1°C prior to kinetic initiation.",
                "metrics": json.dumps({"k (298K)": "2.45e-3 s⁻¹", "Ea": "58.4 kJ/mol", "Arrhenius R²": "0.998"}),
                "technologies": json.dumps(["Conductometry", "Thermostatic Bath", "Arrhenius Fitting", "Excel Kinetics"]),
                "results": "Confirmed pseudo-first-order kinetics with linear ln(G∞ - Gt) correlation (R² = 0.998).",
                "limitations": "Conductivity dip cell requires frequent recalibration with standard 0.01M KCl.",
                "featured": True,
                "display_order": 3,
            },
            {
                "title": "Extraction, Phytochemical Screening & TLC Isolation of Flavonoids",
                "slug": "flavonoids-extraction-tlc",
                "short_description": "Soxhlet extraction of secondary metabolites from botanical matrices with rotary evaporation, yielding flavonoid fractions resolved via TLC (Rf = 0.64).",
                "description": "Continuous solid-liquid Soxhlet extraction of secondary metabolites from botanical matrices with rotary vacuum solvent recovery. TLC silica gel 60 separation resolving key flavonoid fractions at Rf = 0.64 and 0.42.",
                "problem_statement": "Efficient isolation of thermosensitive botanical antioxidants without thermal degradation.",
                "category": "Natural Products Chemistry",
                "github_url": "#",
                "dataset": "Air-dried powdered botanical specimens extracted in triplicate solvent systems.",
                "model_architecture": "Soxhlet continuous extractor with dual-solvent rotary vacuum recovery.",
                "preprocessing": "Desolventization under reduced pressure at 40°C in Buchi-type rotary evaporator.",
                "metrics": json.dumps({"Crude Yield": "12.8%", "Rf Value": "0.64", "Separation": "Baseline"}),
                "technologies": json.dumps(["Soxhlet Extractor", "Rotary Evaporator", "TLC Silica 60", "UV 365nm Lamp"]),
                "results": "Successfully resolved 3 distinct luminescent bands under 365 nm UV illumination with clean Rf separation.",
                "limitations": "Preparative-scale column chromatography needed for gram-scale isolate recovery.",
                "featured": False,
                "display_order": 4,
            },
            {
                "title": "Potentiometric Acid-Base & Redox KMnO₄ Assays of Ferrous Ion",
                "slug": "potentiometric-redox-kmno4-assays",
                "short_description": "Comparative titrimetric metrology determining ferrous ion content in Mohr's salt through potentiometric inflection and visual self-indicating permanganate endpoint.",
                "description": "Comparative titrimetric metrology determining ferrous ion content in Mohr's salt through potentiometric inflection and visual self-indicating permanganate endpoint. Statistical RSD < 0.35%.",
                "problem_statement": "Standardizing analytical titrimetric metrology and eliminating subjective indicator error in redox determinations.",
                "category": "Quantitative Analytical Chemistry",
                "github_url": "#",
                "dataset": "Five replicate analytical runs against primary standard sodium oxalate.",
                "model_architecture": "Combined glass-calomel electrode and precision micro-burette apparatus.",
                "preprocessing": "Reagent standardization and temperature correction of titrant density.",
                "metrics": json.dumps({"Titrant Molarity": "0.0200 M", "Endpoint Vol": "24.60 mL", "RSD": "0.32%"}),
                "technologies": json.dumps(["Potentiometric pH Meter", "Redox Titration", "Analytical Balance", "GLP"]),
                "results": "Achieved equivalence point inflection at pH 8.32 and quantified Fe²⁺ mass with 99.7% stoichiometric recovery.",
                "limitations": "Acidic medium (H2SO4) concentration must be precisely regulated to prevent permanganate side-decomposition.",
                "featured": False,
                "display_order": 5,
            },
            {
                "title": "Water Hardness Metrology via Complexometric EDTA Titration",
                "slug": "edta-water-hardness-metrology",
                "short_description": "Complexometric titration of total, Ca²⁺, and Mg²⁺ hardness in environmental water using standardized disodium EDTA and Eriochrome Black T indicator at buffered pH 10.",
                "description": "Complexometric titration of total, Ca²⁺, and Mg²⁺ hardness in environmental water using standardized disodium EDTA and Eriochrome Black T indicator at buffered pH 10 with ±0.02 mL standard deviation.",
                "problem_statement": "Accurate determination of mineral divalent cations in environmental water supplies.",
                "category": "Environmental Analytical Assays",
                "github_url": "#",
                "dataset": "Tap, groundwater, and treated municipal water samples analyzed in triplicate.",
                "model_architecture": "Buffered ammonia-ammonium chloride pH 10 medium with Eriochrome Black T visual end-point.",
                "preprocessing": "Sample filtration and boiling to remove dissolved CO2 and bicarbonate interferences.",
                "metrics": json.dumps({"Total Hardness": "248 ppm", "Std Dev": "±0.02 mL", "pH Control": "10.0 ± 0.1"}),
                "technologies": json.dumps(["Complexometry", "EDTA Assay", "pH Buffering", "Statistical QC"]),
                "results": "Standard deviation within ±0.02 mL and classified water sample as hard water (248 ppm CaCO3 equivalent).",
                "limitations": "High heavy-metal concentrations require masking agents (KCN or triethanolamine).",
                "featured": False,
                "display_order": 6,
            },
        ]
        for p in projects_data:
            db.session.add(Project(**p))

    db.session.commit()



def configure_logging(app: Flask) -> None:
    """Configure structured logging — never log passwords or secrets."""
    os.makedirs("logs", exist_ok=True)
    log_level = logging.DEBUG if app.debug else logging.INFO

    handler = logging.FileHandler("logs/portfolio.log", encoding="utf-8")
    handler.setLevel(log_level)
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(log_level)

    # Suppress Flask-Limiter verbose output in production
    if not app.debug:
        logging.getLogger("flask_limiter").setLevel(logging.WARNING)


app = create_app()

if __name__ == "__main__":  # pragma: no cover
    # Binding to 0.0.0.0 is intentional for Docker/container deployment
    app.run(debug=app.config.get("DEBUG", False), host="0.0.0.0", port=5000)  # nosec B104
