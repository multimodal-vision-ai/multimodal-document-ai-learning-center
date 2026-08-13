# Kaggle 操作器（供 Codex 驱动，2026-08-13）
#
# 用途：解决 Codex 沙箱无网络/审批通道故障的问题。您启动本脚本一次，
# Codex 通过 %TEMP%\codex_kaggle_queue 投递 JSON 任务，本脚本代为执行
# Kaggle CLI 并写回 .out 文件，Codex 自行读取。
#
# 安全边界（固定不变）：
# - 只支持三种操作：status / output / push；
# - kernel 必须以 "guopingtan/" 开头；
# - push 目录必须位于 %TEMP%\mvai_phase2_push 下；
# - 每个任务处理完即删除任务文件，全部操作记录到
#   %TEMP%\codex_kaggle_runner.log；
# - 最长运行 2 小时，到点自动退出。
#
# 停止方式：关闭窗口 / 结束 powershell 进程 / 删除队列目录并等待。

$watch = Join-Path $env:TEMP "codex_kaggle_queue"
$log   = Join-Path $env:TEMP "codex_kaggle_runner.log"
$kaggle = "C:\Users\guopi\AppData\Roaming\Python\Python314\Scripts\kaggle.exe"
$allowedPush = (Join-Path $env:TEMP "mvai_phase2_push").TrimEnd('\')

New-Item -ItemType Directory -Path $watch -Force | Out-Null
"$(Get-Date -Format o) runner started" | Out-File $log -Append -Encoding UTF8

$deadline = (Get-Date).AddHours(2)
while ((Get-Date) -lt $deadline) {
    $jobs = Get-ChildItem $watch -Filter "*.json" -File -ErrorAction SilentlyContinue | Sort-Object Name
    foreach ($j in $jobs) {
        $outfile = $j.FullName -replace "\.json$", ".out"
        $out = ""
        try {
            $req = Get-Content $j.FullName -Raw | ConvertFrom-Json
            $kernel = [string]$req.kernel
            if ($req.op -eq "status") {
                if ($kernel -like "guopingtan/*") {
                    $out = & $kaggle kernels status $kernel 2>&1 | Out-String
                } else { $out = "REFUSED: kernel must start with guopingtan/" }
            }
            elseif ($req.op -eq "output") {
                $dest = [string]$req.dest
                if ($kernel -like "guopingtan/*" -and $dest) {
                    New-Item -ItemType Directory -Path $dest -Force | Out-Null
                    $out = & $kaggle kernels output $kernel -p $dest 2>&1 | Out-String
                } else { $out = "REFUSED: invalid kernel/dest" }
            }
            elseif ($req.op -eq "push") {
                $folder = [string]$req.folder
                if ($folder -and ($folder -like "$allowedPush*")) {
                    $out = & $kaggle kernels push -p $folder 2>&1 | Out-String
                } else { $out = "REFUSED: folder must be under $allowedPush" }
            }
            else {
                $out = "REFUSED: unknown op '$($req.op)'"
            }
        }
        catch {
            $out = "RUNNER ERROR: $_"
        }
        $out | Out-File $outfile -Encoding UTF8
        Remove-Item $j.FullName -Force -ErrorAction SilentlyContinue
        "$(Get-Date -Format o) done $($j.Name)" | Out-File $log -Append -Encoding UTF8
    }
    Start-Sleep -Seconds 5
}
"$(Get-Date -Format o) runner stopped (deadline)" | Out-File $log -Append -Encoding UTF8
