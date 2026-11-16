Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root 'public'
$images = Join-Path $public 'images'
New-Item -ItemType Directory -Force -Path $images | Out-Null

$petrol = [System.Drawing.Color]::FromArgb(12, 94, 91)
$paper = [System.Drawing.Color]::FromArgb(244, 246, 245)
$ink = [System.Drawing.Color]::FromArgb(28, 36, 40)
$soft = [System.Drawing.Color]::FromArgb(231, 241, 240)
$white = [System.Drawing.Color]::White

function New-Bitmap([int]$width, [int]$height, [System.Drawing.Color]$color) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear($color)
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Save-Bitmap($pair, [string]$path) {
  $pair.Bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $pair.Graphics.Dispose()
  $pair.Bitmap.Dispose()
}

function Draw-Hall($graphics, [single]$x, [single]$y, [single]$w, [single]$h, [System.Drawing.Color]$color, [single]$weight) {
  $pen = New-Object System.Drawing.Pen $color, $weight
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter
  $floor = $y + $h
  $eave = $y + ($h * 0.34)
  $left = $x + ($w * 0.12)
  $right = $x + ($w * 0.88)
  $mid = $x + ($w * 0.5)
  $ridge = $y + ($h * 0.08)
  $graphics.DrawLine($pen, $left, $floor, $left, $eave)
  $graphics.DrawLine($pen, $right, $floor, $right, $eave)
  $graphics.DrawLine($pen, ($x + ($w * 0.06)), $floor, ($x + ($w * 0.94)), $floor)
  $graphics.DrawLine($pen, $left, $eave, $mid, $ridge)
  $graphics.DrawLine($pen, $right, $eave, $mid, $ridge)
  $graphics.DrawLine($pen, $left, $eave, $right, $eave)
  $graphics.DrawLine($pen, ($x + ($w * 0.31)), $floor, ($x + ($w * 0.31)), ($y + ($h * 0.46)))
  $graphics.DrawLine($pen, ($x + ($w * 0.69)), $floor, ($x + ($w * 0.69)), ($y + ($h * 0.46)))
  $pipe = New-Object System.Drawing.Pen $color, ([single]([Math]::Max(2, $weight * 0.85)))
  $graphics.DrawLine($pipe, ($x + ($w * 0.18)), ($y + ($h * 0.5)), ($x + ($w * 0.84)), ($y + ($h * 0.56)))
  $graphics.DrawEllipse($pipe, ($x + ($w * 0.84)), ($y + ($h * 0.52)), ($w * 0.045), ($h * 0.08))
  $pen.Dispose()
  $pipe.Dispose()
}

function Draw-Station($graphics, [single]$x, [single]$y, [System.Drawing.Color]$color) {
  $solid = New-Object System.Drawing.Pen $color, 4
  $dash = New-Object System.Drawing.Pen $color, 3
  $dash.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
  $graphics.DrawLine($dash, $x, $y, ($x + 150), ($y - 92))
  $graphics.DrawLine($dash, $x, $y, ($x + 210), ($y - 18))
  $graphics.DrawEllipse($solid, ($x - 9), ($y - 9), 18, 18)
  $graphics.DrawLine($solid, $x, ($y + 10), $x, ($y + 58))
  $graphics.DrawLine($solid, ($x - 22), ($y + 58), ($x + 22), ($y + 58))
  $solid.Dispose()
  $dash.Dispose()
}

function Draw-Icon([int]$size, [string]$path) {
  $pair = New-Bitmap $size $size $petrol
  $g = $pair.Graphics
  $weight = [single]([Math]::Max(1.6, $size / 28))
  $pen = New-Object System.Drawing.Pen $white, $weight
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $left = [single]($size * 0.22)
  $right = [single]($size * 0.78)
  $floor = [single]($size * 0.78)
  $eave = [single]($size * 0.40)
  $mid = [single]($size * 0.50)
  $ridge = [single]($size * 0.18)
  $g.DrawLine($pen, $left, $floor, $left, $eave)
  $g.DrawLine($pen, $right, $floor, $right, $eave)
  $g.DrawLine($pen, ([single]($size * 0.16)), $floor, ([single]($size * 0.84)), $floor)
  $g.DrawLine($pen, $left, $eave, $mid, $ridge)
  $g.DrawLine($pen, $right, $eave, $mid, $ridge)
  $g.DrawLine($pen, $left, $eave, $right, $eave)
  $beam = New-Object System.Drawing.Pen $soft, ([single]([Math]::Max(1.4, $weight * 0.75)))
  $g.DrawLine($beam, ([single]($size * 0.34)), ([single]($size * 0.60)), ([single]($size * 0.70)), ([single]($size * 0.56)))
  $pen.Dispose()
  $beam.Dispose()
  $dot = New-Object System.Drawing.SolidBrush $soft
  $r = [single]([Math]::Max(1.4, $size / 26))
  $cx = [single]($size * 0.34)
  $cy = [single]($size * 0.60)
  $g.FillEllipse($dot, ($cx - $r), ($cy - $r), ($r * 2), ($r * 2))
  $dot.Dispose()
  Save-Bitmap $pair $path
}

function Draw-Cover([string]$path, [string]$kicker, [string]$title, [string]$note, [switch]$Window) {
  $pair = New-Bitmap 1200 630 $paper
  $g = $pair.Graphics
  $panel = New-Object System.Drawing.SolidBrush $petrol
  $g.FillRectangle($panel, 0, 0, 470, 630)
  $panel.Dispose()
  $bar = New-Object System.Drawing.SolidBrush $soft
  $g.FillRectangle($bar, 0, 598, 470, 8)
  $bar.Dispose()
  $brush = New-Object System.Drawing.SolidBrush $white
  $muted = New-Object System.Drawing.SolidBrush $soft
  $fontKicker = New-Object System.Drawing.Font 'Segoe UI', 18, ([System.Drawing.FontStyle]::Regular)
  $fontTitle = New-Object System.Drawing.Font 'Segoe UI', 36, ([System.Drawing.FontStyle]::Bold)
  $fontNote = New-Object System.Drawing.Font 'Segoe UI', 16, ([System.Drawing.FontStyle]::Regular)
  $g.DrawString($kicker, $fontKicker, $muted, 48, 168)
  $rect = New-Object System.Drawing.RectangleF 48, 214, 374, 220
  $g.DrawString($title, $fontTitle, $brush, $rect)
  if ($note) { $g.DrawString($note, $fontNote, $muted, 48, 470) }
  Draw-Hall $g 560 120 520 360 $petrol 7
  Draw-Station $g 690 390 $petrol
  if ($Window) {
    $fill = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 12, 94, 91))
    $g.FillRectangle($fill, 760, 250, 150, 150)
    $fill.Dispose()
    $edge = New-Object System.Drawing.Pen $petrol, 3
    $edge.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawRectangle($edge, 760, 250, 150, 150)
    $edge.Dispose()
  }
  $brush.Dispose(); $muted.Dispose(); $fontKicker.Dispose(); $fontTitle.Dispose(); $fontNote.Dispose()
  Save-Bitmap $pair $path
}

function Draw-Profile([string]$path) {
  $pair = New-Bitmap 1200 900 $paper
  $g = $pair.Graphics
  $panel = New-Object System.Drawing.SolidBrush $petrol
  $g.FillRectangle($panel, 0, 0, 1200, 168)
  $panel.Dispose()
  $whiteBrush = New-Object System.Drawing.SolidBrush $white
  $inkBrush = New-Object System.Drawing.SolidBrush $ink
  $font = New-Object System.Drawing.Font 'Segoe UI', 40, ([System.Drawing.FontStyle]::Bold)
  $sub = New-Object System.Drawing.Font 'Segoe UI', 22, ([System.Drawing.FontStyle]::Regular)
  $small = New-Object System.Drawing.Font 'Segoe UI', 16, ([System.Drawing.FontStyle]::Regular)
  $g.DrawString($(if ($env:H3D_PROFILE_TITLE) { $env:H3D_PROFILE_TITLE } else { 'Ipari terfelmeres' }), $font, $whiteBrush, 56, 48)
  Draw-Hall $g 180 250 840 460 $petrol 8
  Draw-Station $g 470 560 $petrol
  $g.DrawString($(if ($env:H3D_PROFILE_NOTE) { $env:H3D_PROFILE_NOTE } else { 'Sematikus abra, nem referenciafoto.' }), $small, $inkBrush, 56, 820)
  $whiteBrush.Dispose(); $inkBrush.Dispose(); $font.Dispose(); $sub.Dispose(); $small.Dispose()
  Save-Bitmap $pair $path
}

Draw-Icon 16 (Join-Path $public 'favicon-16.png')
Draw-Icon 32 (Join-Path $public 'favicon-32.png')
Draw-Icon 48 (Join-Path $public 'favicon-48.png')
Draw-Icon 192 (Join-Path $public 'favicon-192.png')
Draw-Icon 512 (Join-Path $public 'favicon-512.png')
Draw-Icon 180 (Join-Path $public 'apple-touch-icon.png')
Draw-Cover (Join-Path $public 'og.png') $env:H3D_OG_KICKER $env:H3D_OG_TITLE '' 
Draw-Cover (Join-Path $images 'og-mukodo-uzem.png') $env:H3D_ARTICLE_KICKER $env:H3D_ARTICLE_TITLE $env:H3D_ARTICLE_NOTE -Window
Draw-Profile (Join-Path $images 'cegprofil-ipari-felmeres.png')
