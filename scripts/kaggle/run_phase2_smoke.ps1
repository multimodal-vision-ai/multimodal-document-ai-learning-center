# 一键自动化：打包 -> 推送 Kaggle（GPU+Internet，等待运行结束）-> 下载产物 -> 打印报告
# 用法：powershell -ExecutionPolicy Bypass -File "<repo>\scripts\kaggle\run_phase2_smoke.ps1"

$ErrorActionPreference = "Continue"
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$env:PATH = "$env:PATH;C:\Users\guopi\AppData\Roaming\Python\Python314\Scripts"

$push = Join-Path $env:TEMP "mvai_phase2_push"
$out  = Join-Path $env:TEMP "mvai_phase2_output"

New-Item -ItemType Directory -Path $push -Force | Out-Null
Get-ChildItem $push -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $out -Force | Out-Null
Get-ChildItem $out -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Copy-Item "$repo\scripts\kaggle\smoke_phase2.ipynb" "$push\smoke_phase2.ipynb" -Force
Copy-Item "$repo\scripts\kaggle\kernel-metadata.json" "$push\kernel-metadata.json" -Force
Copy-Item "$repo\src" "$push\src" -Recurse -Force
Copy-Item "$repo\configs" "$push\configs" -Recurse -Force
Copy-Item "$repo\prompts" "$push\prompts" -Recurse -Force
Get-ChildItem $push -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "=== push (may take 10-40 min) ==="
kaggle kernels push -p $push 2>&1

Write-Host "=== status ==="
kaggle kernels status guopingtan/mvai-phase2-smoke 2>&1

Write-Host "=== download output ==="
kaggle kernels output guopingtan/mvai-phase2-smoke -p $out 2>&1

Write-Host "=== files ==="
Get-ChildItem $out -Recurse -File | Select-Object FullName, Length | Format-Table -AutoSize

$report = Join-Path $out "results\run_report.txt"
if (Test-Path $report) {
    Write-Host "=== run_report ==="
    Get-Content $report -Encoding UTF8
}
