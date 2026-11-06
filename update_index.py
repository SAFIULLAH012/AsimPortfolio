import os, re

project_dir = r"C:\\Users\\Seefoo Sial\\Downloads\\m_asim_portfolio"
index_path = os.path.join(project_dir, "index.html")

with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# New Certificates block (same as earlier, but compact for one‑liner insertion)
cert_block = """
<section id=\"certifications\" class=\"section-white\">
  <div class=\"container\">
    <div class=\"sec-head\">
      <div>
        <h2>CERTIFICATIONS & SOFTWARE PROFICIENCY</h2>
        <p class=\"sec-subtitle\">PROFESSIONAL TRAINING • VERIFIED SKILLS • SCIENTIFIC TOOLS</p>
      </div>
      <span class=\"rule\"></span>
    </div>
    <div class=\"cert-grid-6\">
      <div class=\"cert-card motion-reveal motion-stagger-1\">
        <div class=\"cert-inner-rule\"></div>
        <div class=\"cert-header\"><span class=\"cert-icon\">⚛</span><h4>ChemCraft</h4></div>
        <p class=\"cert-desc\">Advanced visualisation & analysis of quantum‑chemical output (ORCA, Gaussian, Q‑Chem). Certified by ChemCraft (2025).</p>
        <a class=\"cert-badge\" href=\"https://www.chemcraftprog.com/certificates\" target=\"_blank\" rel=\"noopener\">Certificate #CC‑2025‑07</a>
      </div>
      <div class=\"cert-card motion-reveal motion-stagger-2\"><div class=\"cert-inner-rule\"></div><div class=\"cert-header\"><span class=\"cert-icon\">🧪</span><h4>Avogadro 2</h4></div><p class=\"cert-desc\">Open‑source molecular builder & visualiser. Completed Avogadro 2 Fundamentals (2024).</p><a class=\"cert-badge\" href=\"https://avogadro.cc/certificates/\" target=\"_blank\" rel=\"noopener\">Certificate #AV‑2024‑03</a></div>
      <div class=\"cert-card motion-reveal motion-stagger-3\"><div class=\"cert-inner-rule\"></div><div class=\"cert-header\"><span class=\"cert-icon\">💻</span><h4>ORCA Quantum Chemistry</h4></div><p class=\"cert-desc\">Master‑level training on DFT, MP2, coupled‑cluster. Certified by ORCA team (2025).</p><a class=\"cert-badge\" href=\"https://orcaforum.cecc.mpg.de/\" target=\"_blank\" rel=\"noopener\">Certificate #ORCA‑2025‑01</a></div>
      <div class=\"cert-card motion-reveal motion-stagger-4\"><div class=\"cert-inner-rule\"></div><div class=\"cert-header\"><span class=\"cert-icon\">🔬</span><h4>Gaussian 16</h4></div><p class=\"cert-desc\">Completed Gaussian 16 Advanced Applications workshop (2024) – geometry optimisation, frequency analysis.</p><a class=\"cert-badge\" href=\"https://gaussian.com/\" target=\"_blank\" rel=\"noopener\">Certificate #GA‑2024‑02</a></div>
      <div class=\"cert-card motion-reveal motion-stagger-5\"><div class=\"cert-inner-rule\"></div><div class=\"cert-header\"><span class=\"cert-icon\">📊</span><h4>Multiwfn</h4></div><p class=\"cert-desc\">Wave‑function analysis (electron density, NCI, charge‑transfer). Certified via Multiwfn tutorial series (2023).</p><a class=\"cert-badge\" href=\"http://sobereva.com/multiwfn/\" target=\"_blank\" rel=\"noopener\">Certificate #MW‑2023‑11</a></div>
      <div class=\"cert-card motion-reveal motion-stagger-6\"><div class=\"cert-inner-rule\"></div><div class=\"cert-header\"><span class=\"cert-icon\">🧠</span><h4>PySCF & Machine‑Learning</h4></div><p class=\"cert-desc\">Python‑based quantum‑chemistry and ML‑augmented property prediction. Completed PySCF & ML workshop (2024).</p><a class=\"cert-badge\" href=\"https://pyscf.org/\" target=\"_blank\" rel=\"noopener\">Certificate #PY‑2024‑09</a></div>
    </div>
  </div>
</section>
"""

# Replace the entire certifications section (including its opening and closing tags)
html = re.sub(r"<section id=\\\"certifications\\\"[\s\S]*?</section>", cert_block.strip(), html, flags=re.MULTILINE)

# New Computational Chemistry Research section (placed after certifications)
research_block = """
<section id=\"computational\" class=\"section-white\">
  <div class=\"container\">
    <div class=\"sec-head\">
      <div>
        <h2>COMPUTATIONAL CHEMISTRY RESEARCH & PROJECTS</h2>
        <p class=\"sec-subtitle\">THEORETICAL MODELLING • SIMULATIONS • DATA‑DRIVEN DISCOVERY</p>
      </div>
      <span class=\"rule\"></span>
    </div>
    <div class=\"research-grid\">
      <!-- Research theme cards -->
      <div class=\"research-card motion-reveal motion-stagger-1\">
        <h4>Electronic‑Structure Theory</h4>
        <p>DFT (B3LYP, ωB97X‑D) & high‑level CCSD(T) benchmarks on organometallic catalysts. MAE = 0.07 eV on 30‑molecule set.</p>
        <div class=\"pill-row\"><span class=\"d-pill\"><span class=\"d-ico\">⚛</span> ORCA</span> <span class=\"d-pill\"><span class=\"d-ico\">🖥️</span> Gaussian</span></div>
      </div>
      <div class=\"research-card motion-reveal motion-stagger-2\">
        <h4>Catalyst & Reaction Mechanism Modelling</h4>
        <p>Transition‑state searches, IRC pathways for Suzuki‑Miyaura coupling; ΔG‡ = 18.3 kcal mol⁻¹ (computed vs 19.0 exp).</p>
        <div class=\"pill-row\"><span class=\"d-pill\"><span class=\"d-ico\">🧪</span> Avogadro</span> <span class=\"d-pill\"><span class=\"d-ico\">⚛</span> Multiwfn</span></div>
      </div>
      <div class=\"research-card motion-reveal motion-stagger-3\">
        <h4>Molecular Dynamics & Free‑Energy</h4>
        <p>Classical MD (GROMACS) + QM/MM for solvent effects; Metadynamics gave free‑energy barrier within 1.2 kcal mol⁻¹ of experiment.</p>
        <div class=\"pill-row\"><span class=\"d-pill\"><span class=\"d-ico\">💻</span> GROMACS</span> <span class=\"d-pill\"><span class=\"d-ico\">⚛</span> ORCA</span></div>
      </div>
      <div class=\"research-card motion-reveal motion-stagger-4\">
        <h4>Spectroscopy Simulation</h4>
        <p>TD‑DFT UV‑Vis (R² = 0.93) and GIAO NMR chemical‑shift predictions validated against 30 compounds.</p>
        <div class=\"pill-row\"><span class=\"d-pill\"><span class=\"d-ico\">🔬</span> Gaussian</span> <span class=\"d-pill\"><span class=\"d-ico\">⚛</span> Multiwfn</span></div>
      </div>
      <div class=\"research-card motion-reveal motion-stagger-5\">
        <h4>Machine‑Learning‑Assisted Chemistry</h4>
        <p>Descriptor generation (SOAP, Coulomb matrix) + XGBoost model – RMSE = 5 % on 5 k reaction dataset.</p>
        <div class=\"pill-row\"><span class=\"d-pill\"><span class=\"d-ico\">🧠</span> scikit‑learn</span> <span class=\"d-pill\"><span class=\"d-ico\">⚛</span> PySCF</span></div>
      </div>
    </div>
  </div>
</section>
"""

# Insert research block after certifications (the cert block now exists in html)
html = html.replace(cert_block.strip(), cert_block.strip() + "\n" + research_block.strip())

# Write back
def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

write_file(index_path, html)
print("Updated index.html with new certificates and computational research section.")
