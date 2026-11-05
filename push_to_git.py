import os
import subprocess
import sys

git_dir = r"C:\Users\Seefoo Sial\AppData\Local\OpenClaw\deps\portable-git\mingw64\bin"
if os.path.exists(git_dir):
    os.environ["PATH"] = git_dir + os.pathsep + os.environ.get("PATH", "")

def run(cmd):
    print(f"\n> {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr:
        print(res.stderr.strip())
    return res.returncode

# 1. Version
run(["git", "--version"])

# 2. Init
run(["git", "init"])

# 3. Add all
run(["git", "add", "."])

# 4. Status
run(["git", "status", "--short"])

# 5. Commit
run(["git", "commit", "-m", "Initial commit: M. Asim Chemistry & Computational Portfolio"])

# 6. Branch
run(["git", "branch", "-M", "main"])

# 7. Remote
run(["git", "remote", "remove", "origin"])
run(["git", "remote", "add", "origin", "https://github.com/SAFIULLAH012/AsimPortfolio.git"])
run(["git", "remote", "-v"])

# 8. Push
print("\nAttempting git push to https://github.com/SAFIULLAH012/AsimPortfolio.git...")
code = run(["git", "push", "-u", "origin", "main"])
if code == 0:
    print("\nSUCCESS: Successfully pushed to GitHub repository!")
else:
    print("\nPush exited with code", code)
