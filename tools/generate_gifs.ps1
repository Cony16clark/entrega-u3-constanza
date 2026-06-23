# Generar GIFs optimizados desde videos en la carpeta "videos"
# Requisitos: ffmpeg disponible en PATH
# Uso: Abrir PowerShell en la carpeta del proyecto y ejecutar: .\tools\generate_gifs.ps1

$sourceDir = "videos"
$outDir = "imagenes/gifs"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$videos = Get-ChildItem -Path $sourceDir -File | Where-Object { $_.Extension -match "\.(mp4|mov|webm|avi|mkv)$" }
if ($videos.Count -eq 0) {
    Write-Output "No se encontraron videos en $sourceDir"
    exit 0
}

$index = 1
foreach ($v in $videos) {
    $inFile = Join-Path $sourceDir $v.Name
    $outFile = Join-Path $outDir ("gif_{0}.gif" -f $index)

    # Obtener duración del video
    $duration = (& ffprobe -v error -select_streams v:0 -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$inFile") -as [double]
    if (-not $duration) { $duration = 6 }

    # Recortar clip de 6s desde la mitad del video
    $clipLength = 6
    $start = [math]::Max(0, ($duration/2) - ($clipLength/2))

    # Generar paleta para mejor calidad
    $palette = Join-Path $outDir ("palette_{0}.png" -f $index)
    & ffmpeg -y -ss $start -t $clipLength -i "$inFile" -vf "fps=15,scale=640:-1:flags=lanczos,palettegen" -png256 "$palette"

    # Generar GIF usando la paleta
    & ffmpeg -y -ss $start -t $clipLength -i "$inFile" -i "$palette" -filter_complex "fps=15,scale=640:-1:flags=lanczos[x];[x][1:v]paletteuse" -loop 0 "$outFile"

    # Generar WebP animado optimizado (fallback moderno)
    $outWebP = Join-Path $outDir ("gif_{0}.webp" -f $index)
    & ffmpeg -y -ss $start -t $clipLength -i "$inFile" -vf "fps=15,scale=640:-1:flags=lanczos" -loop 0 -compression_level 6 -q:v 50 -preset default -an "$outWebP"

    # Limpiar paleta
    Remove-Item $palette -ErrorAction SilentlyContinue

    Write-Output "Generado: $outFile"
    Write-Output "Generado: $outWebP"
    $index++
}

Write-Output "GIFs generados en $outDir"
