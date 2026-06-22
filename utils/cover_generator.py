import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def get_font(font_name, size):
    """Try loading local custom fonts first, then fallback to Windows/system fonts."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    local_font_path = os.path.join(base_dir, "static", "fonts", font_name)
    
    paths = [
        local_font_path,
        f"C:\\Windows\\Fonts\\{font_name}",
        f"C:\\Windows\\Fonts\\{font_name.lower()}",
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "arial.ttf"
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    try:
        return ImageFont.truetype(font_name, size)
    except:
        return ImageFont.load_default()

def wrap_text(text, font, max_width):
    """Wrap text into multiple lines fitting the width budget."""
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        # Measure width
        if hasattr(font, 'getbbox'):
            bbox = font.getbbox(test_line)
            w = bbox[2] - bbox[0]
        else:
            w = font.getsize(test_line)[0]
            
        if w <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
                current_line = [word]
            else:
                lines.append(word)
                current_line = []
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def generate_cover_image(playlist_name, output_path):
    """
    Generates a premium 1:1 square cover art (1080x1080) for the playlist.
    Visual styles are dynamically inferred based on keywords or string hash.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 1. Inferred Style Settings
    name_lower = playlist_name.lower()
    
    # Presets definition: (start_rgb, end_rgb, accent_rgb, font_file)
    presets = [
        # 0: Calm Study (Indigo/Deep Teal)
        ((10, 25, 47), (0, 150, 136), (79, 209, 197), "InstrumentSerif-Regular.ttf"),
        # 1: Late Night (Midnight Purple/Magenta)
        ((15, 10, 30), (255, 64, 129), (255, 235, 59), "PlusJakartaSans-Bold.ttf"),
        # 2: Energetic Workout (Charcoal/Electric Lime)
        ((18, 18, 18), (10, 10, 10), (163, 230, 53), "PlusJakartaSans-Bold.ttf"),
        # 3: Summer Vibes (Warm Coral/Peach Sunset)
        ((253, 186, 116), (239, 68, 68), (255, 253, 240), "PlusJakartaSans-Bold.ttf"),
        # 4: Artistic Indie (Pastel Sage/Soft Amber)
        ((217, 249, 157), (180, 83, 9), (45, 212, 191), "InstrumentSerif-Italic.ttf"),
        # 5: Cinematic Lofi (Muted Earthy Amber/Charcoal)
        ((28, 25, 23), (120, 113, 108), (245, 158, 11), "JetBrainsMono-Regular.ttf")
    ]
    
    if any(k in name_lower for k in ["lofi", "lo-fi", "sad", "acoustic", "retro", "grain", "cinematic"]):
        preset_idx = 5
    elif any(k in name_lower for k in ["gym", "workout", "power", "run", "beats", "dance", "edm", "hype", "beast"]):
        preset_idx = 2
    elif any(k in name_lower for k in ["study", "focus", "work", "calm", "ambient", "sleep"]):
        preset_idx = 0
    elif any(k in name_lower for k in ["night", "drive", "midnight", "chill", "sleepy", "late"]):
        preset_idx = 1
    elif any(k in name_lower for k in ["summer", "vibes", "happy", "party", "beach", "sun", "pop", "warm"]):
        preset_idx = 3
    elif any(k in name_lower for k in ["indie", "alternative", "art", "rock", "folk", "mix"]):
        preset_idx = 4
    else:
        # consistent hash based on character sums
        preset_idx = sum(ord(c) for c in playlist_name) % 6
        
    start_color, end_color, accent_color, font_file = presets[preset_idx]
    
    # 2. Generate smooth gradient background
    # We generate a 108x108 image, blur it, and upscale with bilinear to make a beautiful mesh!
    small_img = Image.new("RGB", (108, 108))
    small_draw = ImageDraw.Draw(small_img)
    
    # Draw base linear gradient with vignette edge darkening for contrast
    for x in range(108):
        for y in range(108):
            factor = (x + y) / 216.0
            base_r = start_color[0] + (end_color[0] - start_color[0]) * factor
            base_g = start_color[1] + (end_color[1] - start_color[1]) * factor
            base_b = start_color[2] + (end_color[2] - start_color[2]) * factor
            
            # Vignette factor: darken edges to increase text contrast
            dx = x - 54
            dy = y - 54
            dist = (dx*dx + dy*dy) ** 0.5
            norm_dist = dist / 76.36  # ~76.36 is max distance to corner
            vignette = max(0.4, 1.0 - (norm_dist * 0.40)) # up to 40% darker at corners, keep center bright
            
            r = int(base_r * vignette)
            g = int(base_g * vignette)
            b = int(base_b * vignette)
            small_img.putpixel((x, y), (r, g, b))
            
    # Add 2 soft accent color blobs for premium mesh feel
    random.seed(playlist_name)
    for _ in range(2):
        cx = random.randint(10, 98)
        cy = random.randint(10, 98)
        radius = random.randint(15, 30)
        # draw soft blended accent blobs
        small_draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=accent_color)
        
    # Apply Gaussian blur to blend the colors smoothly
    blurred_small = small_img.filter(ImageFilter.GaussianBlur(radius=8))
    img = blurred_small.resize((1080, 1080), Image.Resampling.BILINEAR)
    
    # 3. Add grain noise texture
    try:
        noise_img = Image.effect_noise((1080, 1080), 8)
        noise_rgb = Image.merge("RGB", (noise_img, noise_img, noise_img))
        img = Image.blend(img, noise_rgb, 0.05) # 5% noise blend
    except Exception as noise_err:
        pass # fallback silently if effect_noise fails
        
    draw = ImageDraw.Draw(img)
    
    # 4. Inset decorative frames or cards
    if preset_idx == 4: # Artistic Indie: frame
        draw.rectangle([60, 60, 1020, 1020], outline=(255, 255, 255, 100), width=3)
    elif preset_idx == 5: # Cinematic Lofi: frosted glass card in center
        glass = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
        glass_draw = ImageDraw.Draw(glass)
        glass_draw.rounded_rectangle([150, 150, 930, 930], radius=30, fill=(255, 255, 255, 12), outline=(255, 255, 255, 30), width=2)
        img = Image.alpha_composite(img.convert("RGBA"), glass).convert("RGB")
        draw = ImageDraw.Draw(img)
        
    # 5. Measure and auto-size typography to prevent clipping
    max_text_width = 860 if preset_idx != 5 else 700
    font_size = 140
    min_font_size = 50
    lines = []
    
    # Capitalize for Gym Mode
    text_to_wrap = playlist_name.upper() if preset_idx == 2 else playlist_name
    
    while font_size >= min_font_size:
        font = get_font(font_file, font_size)
        lines = wrap_text(text_to_wrap, font, max_text_width)
        
        # Calculate total height of wrapped text block
        total_height = 0
        for line in lines:
            if hasattr(font, 'getbbox'):
                bbox = font.getbbox(line)
                h = bbox[3] - bbox[1]
            else:
                h = font.getsize(line)[1]
            total_height += h + 25 # line padding
            
        if total_height <= 600: # fits inside height budget
            break
        font_size -= 10
        
    font = get_font(font_file, font_size)
    
    # 6. Render text layers (with offset/rotations depending on style)
    # Target center positions
    start_y = (1080 - total_height) // 2
    
    if preset_idx == 1: # Late Night: Slanted Offset layer shadow
        # Create a text layer to rotate
        text_layer = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
        tl_draw = ImageDraw.Draw(text_layer)
        
        current_y = start_y
        for line in lines:
            if hasattr(font, 'getbbox'):
                bbox = font.getbbox(line)
                w = bbox[2] - bbox[0]
                h = bbox[3] - bbox[1]
            else:
                w, h = font.getsize(line)
            cx = (1080 - w) // 2
            
            # shadow layer (Accent Color) with drop offset
            tl_draw.text((cx + 10, current_y + 10), line, font=font, fill=(accent_color[0], accent_color[1], accent_color[2], 180))
            # top layer (White)
            tl_draw.text((cx, current_y), line, font=font, fill=(255, 255, 255, 255))
            current_y += h + 25
            
        # Rotate text layer by -4 degrees
        rotated_text = text_layer.rotate(-4, Image.Resampling.BILINEAR)
        img = Image.alpha_composite(img.convert("RGBA"), rotated_text).convert("RGB")
        
    elif preset_idx == 2: # Gym Mode: Left-aligned massive lime slanted text
        text_layer = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
        tl_draw = ImageDraw.Draw(text_layer)
        
        current_y = start_y
        for line in lines:
            if hasattr(font, 'getbbox'):
                bbox = font.getbbox(line)
                h = bbox[3] - bbox[1]
            else:
                h = font.getsize(line)[1]
            # left align with margin
            tl_draw.text((100, current_y), line, font=font, fill=(accent_color[0], accent_color[1], accent_color[2], 255))
            current_y += h + 20
            
        # Rotate slightly
        rotated_text = text_layer.rotate(-2, Image.Resampling.BILINEAR)
        img = Image.alpha_composite(img.convert("RGBA"), rotated_text).convert("RGB")
        
    else: # Centered layouts (Calm Study, Summer Vibes, Indie Mix, Lofi Nights)
        current_y = start_y
        for line in lines:
            if hasattr(font, 'getbbox'):
                bbox = font.getbbox(line)
                w = bbox[2] - bbox[0]
                h = bbox[3] - bbox[1]
            else:
                w, h = font.getsize(line)
            cx = (1080 - w) // 2
            
            # Summer vibes: soft translucent dark shadow
            if preset_idx == 3:
                draw.text((cx + 8, current_y + 8), line, font=font, fill=(15, 15, 15, 150))
                draw.text((cx, current_y), line, font=font, fill=(255, 255, 255))
            # Cinematic Lofi: elegant accent gold
            elif preset_idx == 5:
                draw.text((cx, current_y), line, font=font, fill=accent_color)
            # Calm Study / Indie: clean white/off-white
            else:
                draw.text((cx, current_y), line, font=font, fill=(245, 245, 245))
                
            current_y += h + 25
            
    # 7. Save finalized 1080x1080 PNG image
    img.save(output_path, "PNG")
    print(f"[generator] Successfully compiled playlist cover: {output_path}")

