import os, subprocess, sys

def run_git_cmd(args, cwd=None):
    git_path = r"C:\Users\Seefoo Sial\AppData\Local\OpenClaw\deps\portable-git\mingw64\bin\git.exe"
    env = os.environ.copy()
    env["PATH"] = os.pathsep.join([os.path.dirname(git_path), env.get("PATH", "")])
    result = subprocess.run([git_path] + args, cwd=cwd, env=env, capture_output=True, text=True)
    print(f"{' '.join(['git']+args)} => return {result.returncode}")
    print(result.stdout)
    print(result.stderr, file=sys.stderr)
    if result.returncode != 0:
        sys.exit(result.returncode)

project_dir = r"C:\Users\Seefoo Sial\Downloads\m_asim_portfolio"
# stage all
run_git_cmd(["add", "."], cwd=project_dir)
# commit (allow empty? check if changes)
run_git_cmd(["commit", "-m", "Add UI/UX motion suite and responsive layout"], cwd=project_dir)
# push
run_git_cmd(["push", "-u", "origin", "main"], cwd=project_dir)
