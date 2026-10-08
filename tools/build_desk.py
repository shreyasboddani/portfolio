"""Create the portfolio's editable Blender scene and browser-ready GLB.

Run: blender --background --factory-startup --python tools/build_desk.py
All geometry is authored here; photographs/screenshots are the user's assets.
Blender coordinates are Z-up. GLB exports convert the scene to Three.js Y-up.
"""
import bpy
import math
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MODELS = PUBLIC / "models"
SOURCE = ROOT / "assets" / "blender"
MODELS.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)
random.seed(27)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)


def material(name, color, rough=.5, metal=0, emission=None):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    p = mat.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    if emission:
        p.inputs["Emission Color"].default_value = (*emission[0], 1)
        p.inputs["Emission Strength"].default_value = emission[1]
    return mat


WOOD = material("Walnut", (.19, .095, .049), .46)
WOOD_EDGE = material("Walnut end grain", (.095, .046, .029), .55)
BLACK = material("Blackened steel", (.019, .029, .032), .32, .7)
BRASS = material("Brushed brass", (.48, .29, .10), .3, .82)
GREEN = material("Forest enamel", (.038, .105, .088), .3, .25)
LEATHER = material("Sage leather", (.045, .09, .081), .88)
STITCH = material("Mat stitching", (.30, .34, .24), .9)
PAPER = material("Ivory paper", (.79, .74, .61), .92)
PAPER_EDGE = material("Paper edges", (.56, .52, .40), 1)
MANILA = material("Manila", (.58, .39, .18), .86)
INK = material("Ink", (.07, .063, .05), .85)
CREAM = material("Ceramic glaze", (.76, .73, .61), .18)
COFFEE = material("Coffee", (.029, .013, .006), .16)
CORD = material("Rust thread", (.48, .10, .055), .64)
RED = material("Pin enamel", (.49, .11, .067), .3)
WALL = material("Blue plaster", (.031, .052, .069), .96)
FLOOR = [material(f"Floor {i}", (.052+i*.005, .050+i*.004, .046+i*.003), .82) for i in range(5)]
GLASS = material("Night sky", (.025, .06, .12), .25, .2, ((.025, .066, .14), .6))
BULB = material("Lamp glow", (1, .67, .29), .3, 0, ((1, .52, .14), 4))
BOOK_COLORS = [material(f"Book cover {i}", c, .72) for i,c in enumerate([(.08,.19,.16),(.27,.13,.075),(.075,.12,.19),(.42,.34,.22),(.19,.13,.18)])]


def scanned_surface(mat, asset, scale, normal_strength=.4, diffuse=True):
    """Pack locally hosted CC0 scans into the editable scene and GLB."""
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    p = nodes.get("Principled BSDF")
    mat["texture_scale"] = scale
    for suffix, socket in [("diffuse", "Base Color"),("rough", "Roughness"),("nor_gl", "Normal")]:
        if suffix == "diffuse" and not diffuse: continue
        tex = nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(str(PUBLIC / "textures" / f"{asset}_{suffix}.jpg"), check_existing=True)
        if suffix != "diffuse": tex.image.colorspace_settings.name = "Non-Color"
        if suffix == "nor_gl":
            normal = nodes.new("ShaderNodeNormalMap")
            normal.inputs["Strength"].default_value = normal_strength
            links.new(tex.outputs["Color"], normal.inputs["Color"])
            links.new(normal.outputs["Normal"], p.inputs[socket])
        else: links.new(tex.outputs["Color"], p.inputs[socket])


scanned_surface(WOOD, "wood_table_worn", 5.5, .28)
scanned_surface(WOOD_EDGE, "wood_table_worn", 5.5, .28)
scanned_surface(LEATHER, "brown_leather", 2.2, .35, False)
scanned_surface(WALL, "blue_plaster_wall", 4, .4, False)
for mat in FLOOR: scanned_surface(mat, "wood_table_worn", 5.5, .32, False)


def finish(obj, name, mat=None, bevel=0, parent=None):
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft manufactured edges", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    if parent:
        obj.parent = parent
    return obj


def box(name, loc, size, mat, bevel=.025, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat and "texture_scale" in mat:
        # Box-project at a physical scale, including the thin side edges.
        uv = obj.data.uv_layers.active
        for face in obj.data.polygons:
            normal = face.normal
            axes = (0,1) if abs(normal.z)>.5 else (0,2) if abs(normal.y)>.5 else (1,2)
            for index in face.loop_indices:
                co = obj.data.vertices[obj.data.loops[index].vertex_index].co
                uv.data[index].uv = (co[axes[0]]/mat["texture_scale"],co[axes[1]]/mat["texture_scale"])
    return finish(obj, name, mat, bevel, parent)


def empty(name, loc=(0,0,0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.parent = parent
    return obj


def cylinder(name, loc, radius, depth, mat, parent=None, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    obj = finish(bpy.context.object, name, mat, .012, parent)
    for face in obj.data.polygons:
        if len(face.vertices) == 4: face.use_smooth = True
    return obj


def rod(name, a, b, radius, mat, parent=None):
    a, b = Vector(a), Vector(b)
    obj = cylinder(name, (a+b)/2, radius, (b-a).length, mat, parent)
    obj.rotation_euler = (b-a).to_track_quat("Z", "Y").to_euler()
    return obj


def tube(name, points, radius, mat, parent=None):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 8
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    spline = curve.splines.new("POLY")
    spline.points.add(len(points)-1)
    for p, xyz in zip(spline.points, points): p.co = (*xyz, 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    obj.parent = parent
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)
    return obj


def lathe(name, profile, loc, mat, parent=None, segments=48):
    verts = []
    for radius, height in profile:
        for i in range(segments):
            angle = i*math.tau/segments
            verts.append((radius*math.cos(angle), radius*math.sin(angle), height))
    faces = []
    for ring in range(len(profile)-1):
        for i in range(segments):
            j = (i+1)%segments
            faces.append((ring*segments+i, ring*segments+j, (ring+1)*segments+j, (ring+1)*segments+i))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.parent = parent
    obj.data.materials.append(mat)
    for f in mesh.polygons: f.use_smooth = True
    return obj


def text(name, content, loc, size=.1, mat=INK, parent=None, front=False):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = content
    curve.size = size
    curve.extrude = .0008
    curve.resolution_u = 3
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.parent = parent
    if front: obj.rotation_euler.x = math.pi/2
    obj.data.materials.append(mat)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj.select_set(False)
    return obj


def image_mat(name, filename):
    mat = material(name, (1,1,1), .83)
    p = mat.node_tree.nodes.get("Principled BSDF")
    tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(PUBLIC / filename), check_existing=True)
    mat.node_tree.links.new(tex.outputs["Color"], p.inputs["Base Color"])
    return mat


def picture(name, loc, width, height, mat, parent=None, upright=False):
    if upright:
        verts = [(-width/2,0,-height/2),(width/2,0,-height/2),(width/2,0,height/2),(-width/2,0,height/2)]
    else:
        verts = [(-width/2,-height/2,0),(width/2,-height/2,0),(width/2,height/2,0),(-width/2,height/2,0)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], [(0,1,2,3)])
    mesh.uv_layers.new()
    crop=0
    if upright:
        image=next(node.image for node in mat.node_tree.nodes if node.type=="TEX_IMAGE")
        source_ratio=image.size[0]/image.size[1]
        crop=max(0,(1-(width/height)/source_ratio)/2)
    for loop, uv in zip(mesh.uv_layers.active.data, [(crop,0),(1-crop,0),(1-crop,1),(crop,1)]): loop.uv = uv
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.parent = parent
    obj.data.materials.append(mat)
    return obj


# Furniture is a volume with beveled edges, a front apron, drawers, and legs.
box("Desk_solid_walnut", (0,0,2.24), (12.2,7.5,.34), WOOD, .10)
box("Desk_front_apron", (0,-3.37,1.92), (11.6,.18,.37), WOOD_EDGE, .035)
box("Desk_left_apron", (-5.55,0,1.95), (.18,6.9,.45), WOOD_EDGE)
box("Desk_right_apron", (5.55,0,1.95), (.18,6.9,.45), WOOD_EDGE)
for x in [-5.3,5.3]:
    for y in [-2.9,2.9]:
        leg = box("Desk_leg", (x,y,1.08), (.15,.15,2.15), BLACK, .024)
        leg.rotation_euler.y = math.radians(-3 if x < 0 else 3)
    rod("Desk_leg_crossbar", (x,-2.9,.3),(x,2.9,.3), .07, BLACK)
for x in [-3.75,3.75]:
    box("Drawer", (x,-3.45,1.88), (2.8,.2,.32), WOOD, .035)
    rod("Drawer brass handle", (x-.23,-3.6,1.89),(x+.23,-3.6,1.89), .025, BRASS)

box("Leather writing mat", (0,.05,2.43), (9.9,6.75,.04), LEATHER, .075)
outline = [(-4.83,-3.24,2.456),(4.83,-3.24,2.456),(4.83,3.34,2.456),(-4.83,3.34,2.456),(-4.83,-3.24,2.456)]
tube("Leather mat stitching", outline, .009, STITCH)

# A small desktop frame, resting on its lower lip and a hinged easel leg.
# Keep the support's rear foot on the same world-space plane as the frame lip.
lean = math.radians(-12)
frame_scale = .80
lip_z, lip_y = -1.66, -.16
contact_z = math.sin(lean)*lip_y + math.cos(lean)*lip_z
profile = empty("item_profile", (-.45,.95,2.462-contact_z*frame_scale))
profile["evidenceId"] = "profile"
profile["fileId"] = "profile"
profile.rotation_euler = (lean,0,math.radians(-14))
profile.scale = (frame_scale,)*3
FRAME = material("Smoked walnut picture frame", (.065,.038,.025), .38)
scanned_surface(FRAME, "wood_table_worn", 4, .18, False)
BACKING = material("Frame felt backing", (.024,.030,.027), .96)
box("Portrait felt back", (0,.016,0), (2.72,.085,3.19), BACKING, .025, profile)
# Four separate rails make an actual recessed opening rather than a flat slab.
for x in [-1.35,1.35]:
    box("Portrait vertical frame rail", (x,-.055,0), (.18,.22,3.32), FRAME, .025, profile)
for z in [-1.57,1.57]:
    box("Portrait horizontal frame rail", (0,-.055,z), (2.62,.22,.18), FRAME, .025, profile)
box("Portrait ivory mount", (0,-.078,0), (2.52,.018,3.03), PAPER, .008, profile)
box("Portrait print edge", (0,-.091,.17), (2.29,.008,2.53), PAPER_EDGE, .004, profile)
picture("Portrait photograph", (0,-.097,.17),2.26,2.50,image_mat("Shreyas photograph","shreyas-headshot.png"),profile,True)
text("Portrait name", "SHREYAS BODDANI", (-1.04,-.094,-1.23),.146,INK,profile,True)
text("Portrait caption", "DEVELOPER. STUDENT. STILL CURIOUS.",(-1.04,-.094,-1.40),.061,INK,profile,True)
# The support starts at a real hinge on the back and reaches the desk.
rear_y = 1.05
rear_z = (contact_z-math.sin(lean)*rear_y)/math.cos(lean)
hinge_a = Vector((0,.10,.45))
foot_b = Vector((0,rear_y,rear_z+.022))
support = box("Portrait hinged easel leg", (hinge_a+foot_b)/2, (.70,.055,(foot_b-hinge_a).length), FRAME, .018, profile)
support.rotation_euler = (foot_b-hinge_a).to_track_quat("Z","Y").to_euler()
rod("Portrait brass hinge",(-.40,.10,.45),(.40,.10,.45),.030,BRASS,profile)
rod("Portrait rear rubber foot",(-.36,rear_y,rear_z+.022),(.36,rear_y,rear_z+.022),.025,BACKING,profile)
for x in [-.32,.32]:
    rod("Portrait stand limiting strap",(x,.07,-.70),(x,.63,-.70),.010,BACKING,profile)


def folder(ident, file_id, loc, title, number, rotation=0, image=None, green=False):
    parent = empty("item_"+ident, loc)
    parent["evidenceId"] = ident
    parent["fileId"] = file_id
    parent.rotation_euler.z = math.radians(rotation)
    w,h = 2.5,1.9
    box(ident+"_folder_bottom",(0,0,0),(w,h,.047),GREEN if green else MANILA,.02,parent)
    box(ident+"_folder_tab",(-.62,.98,.004),(.92,.21,.047),GREEN if green else MANILA,.035,parent)
    for i in range(3):
        page = box(ident+"_page",(random.uniform(-.015,.015),random.uniform(-.018,.018),.029+i*.012),(w-.16,h-.12,.012),PAPER,.008,parent)
        page.rotation_euler.z=random.uniform(-.018,.018)
    text(ident+"_inside", "NOTES / SHREYAS BODDANI",(-1.03,.63,.067),.07,INK,parent)
    for i in range(5):
        box(ident+"_text_line",(-.17,.25-i*.19,.069),(1.70 if i%2 else 1.96,.012,.002),PAPER_EDGE,0,parent)
    hinge = empty("hinge_"+ident,(-w/2,0,.085),parent)
    box(ident+"_folder_cover",(w/2,0,0),(w,h,.032),GREEN if green else MANILA,.025,hinge)
    text(ident+"_title",title,(.19,-.60,.022),.19,PAPER if green else INK,hinge)
    text(ident+"_number",number+" / ON MY DESK",(.19,.68,.022),.066,PAPER if green else INK,hinge)
    if image:
        box(ident+"_photo_border",(w/2,.10,.022),(2.04,1.14,.015),PAPER,.008,hinge)
        picture(ident+"_photo",(w/2,.10,.032),1.94,1.04,image_mat(ident+" screenshot",image),hinge)
    else:
        text(ident+"_scribble","A WORK IN PROGRESS",(.19,.22,.022),.10,PAPER if green else INK,hinge)
        for i in range(3): box(ident+"_cover_line",(1.10,.03-i*.12,.019),(1.82,.008,.002),PAPER if green else INK,0,hinge)
    return parent


folder("mentics","projects",(-3.20,.30,2.49),"MENTICS","002",9,"mentics.png")
folder("saferoute","projects",(-3.55,-2.15,2.49),"SAFEROUTE","002",-8,"saferoute.png")
folder("experience","experience",(3.3,.34,2.49),"IN THE FIELD","003",-7)
folder("research","research",(3.28,-2.1,2.49),"FOLLOW A QUESTION","004",6)
folder("community","community",(-.78,-2.45,2.49),"FOR THE PEOPLE","005",-5,green=True)
folder("education","education",(-2.66,2.59,2.49),"STILL LEARNING","006",-4)
folder("recognition","recognition",(3.12,2.60,2.49),"SMALL WINS","007",8)
folder("contact","contact",(.96,-.38,2.49),"LET'S TALK","008",-8)

# Thread is actual tubular geometry with a shallow catenary, not an SVG overlay.
for x,y in [(-3.2,.3),(-3.55,-2.15),(3.3,.34),(3.28,-2.1),(-.78,-2.45),(-2.66,2.59),(3.12,2.6),(.96,-.38)]:
    points=[]
    for i in range(21):
        t=i/20
        points.append((x*t+.11*math.sin(t*math.pi),.45+(y-.45)*t,2.473+.008*math.sin(t*math.pi)))
    tube("Connection thread",points,.009,CORD)
    cylinder("Connection pin",(x,y,2.60),.035,.16,BRASS,vertices=16)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=.064, location=(x,y,2.69))
    finish(bpy.context.object,"Connection red pin",RED)

# Banker-style task lamp: base, articulated metal arms, spun shade, visible bulb.
lamp = empty("Banker lamp",(-5.20,1.68,2.43))
lathe("Lamp heavy base",[(0,0),(.37,0),(.43,.05),(.43,.1),(.36,.16),(0,.18)],(0,0,0),GREEN,lamp)
rod("Lamp lower arm",(0,0,.16),(0,.18,1.15),.045,BRASS,lamp)
rod("Lamp upper arm",(0,.18,1.15),(.20,-.22,1.9),.04,BRASS,lamp)
for loc in [(0,.18,1.15),(.20,-.22,1.9)]: cylinder("Lamp hinge",loc,.10,.12,BLACK,lamp).rotation_euler.x=math.pi/2
shade = lathe("Lamp spun shade",[(.38,0),(.39,.04),(.22,.54),(.12,.60),(0,.61)],(.20,-.22,1.87),GREEN,lamp)
lathe("Lamp brass rim",[(.375,-.008),(.40,0),(.40,.025),(.375,.032)],(.20,-.22,1.87),BRASS,lamp)
cylinder("Lamp bulb",(.20,-.22,1.89),.25,.025,BULB,lamp)
tube("Lamp cable",[(0,.1,.04),(-.1,.42,.03),(-.08,.9,.015),(-.55,1.9,-.08),(-.9,2,-1.3)],.018,BLACK,lamp)

# Hollow ceramic mug with an integrated curved handle and a recessed liquid surface.
cup = empty("Ceramic coffee cup",(5.15,-.2,2.42))
lathe("Coffee cup ceramic",[(0,0),(.32,0),(.37,.05),(.43,.66),(.42,.71),(.365,.71),(.35,.15),(0,.12)],(0,0,0),CREAM,cup)
handle=[(.39+.25*math.sin(t*math.pi),0,.37+.25*math.cos(t*math.pi)) for t in [i/24 for i in range(25)]]
tube("Coffee cup handle",handle,.060,CREAM,cup)
cylinder("Recessed coffee",(0,0,.60),.37,.009,COFFEE,cup)
lathe("Coffee coaster",[(0,0),(.50,0),(.50,.035),(0,.035)],(0,0,-.01),WOOD_EDGE,cup)

notebook=empty("Bound notebook",(-5.25,-.82,2.44))
notebook.rotation_euler.z=math.radians(-12)
box("Notebook pages",(0,0,.10),(.84,1.28,.16),PAPER_EDGE,.035,notebook)
for z in [.009,.20]:box("Notebook forest cover",(0,0,z),(.90,1.35,.035),GREEN,.045,notebook)
box("Notebook spine",(-.43,0,.11),(.065,1.32,.21),GREEN,.02,notebook)
box("Notebook elastic",(.24,0,.224),(.035,1.36,.012),BLACK,.003,notebook)
text("Notebook title","IDEAS\n& OTHER\nTHINGS",(-.33,-.20,.225),.14,PAPER,notebook)

pen = empty("Fountain pen",(5.18,-2.23,2.50))
pen.rotation_euler.z=math.radians(23)
rod("Pen barrel",(0,-.70,0),(0,.57,0),.045,GREEN,pen)
rod("Pen cap",(0,.30,0),(0,.64,0),.050,BLACK,pen)
rod("Pen clip",(.024,.34,.047),(.024,.63,.047),.013,BRASS,pen)
rod("Pen gold nib",(0,-.80,0),(0,-.69,0),.025,BRASS,pen)

# A room around the desk makes orbiting obviously spatial.
for i in range(28):
    box("Floor plank",(-13.5+i,0,-.06),(.985,24,.12),FLOOR[i%5],.009)
box("Back wall",(0,6.6,5.3),(28,.18,10.6),WALL,.01)
box("Left wall",(-8.6,0,5.3),(.16,14,10.6),WALL,.01)
box("Baseboard",(0,6.47,.18),(28,.07,.29),BLACK,.01)
# Divided window and city silhouettes, all modeled geometry.
box("Window dark frame",(1.2,6.40,5.50),(5.5,.16,4.4),BLACK,.04)
box("Window sky",(1.2,6.30,5.50),(5.23,.035,4.14),GLASS,.01)
for x in [-1.43,1.2,3.83]:box("Window upright",(x,6.25,5.50),(.07,.06,4.2),BLACK,.008)
for z in [3.4,5.5,7.6]:box("Window crossbar",(1.2,6.24,z),(5.28,.06,.07),BLACK,.008)
box("Window sill",(1.2,6.22,3.37),(5.78,.43,.13),WOOD_EDGE,.025)
for i in range(15):
    h=random.uniform(.24,.9)
    box("Distant city",(-1.26+i*.345,6.275,3.44+h/2),(.24,.035,h),WALL,0)
    for row in range(int(h/.14)):
        if random.random()>.35:
            box("Distant apartment light",(-1.26+i*.345,6.247,3.50+row*.14),(.038,.012,.040),BULB,0)

# Venetian blinds, window trim and wall details give the light real occluders.
for i in range(13):
    slat=box("Venetian blind slat",(1.2,6.10,5.02+i*.19),(5.20,.25,.025),WOOD_EDGE,.008)
    slat.rotation_euler.x=math.radians(-24)
for x in [-.52,2.92]:
    rod("Blind ladder cord",(x,6.00,4.92),(x,6.00,7.45),.010,STITCH)
box("Window upper molding",(1.2,6.13,7.81),(5.72,.24,.18),WOOD_EDGE,.022)
for x in [-1.64,4.04]:
    box("Window side molding",(x,6.15,5.52),(.15,.23,4.67),WOOD_EDGE,.022)
for x in [-8.46,8.0]:
    box("Room wainscot rail",(x/2,6.45,1.23),(8.1,.09,.09),WOOD_EDGE,.015)
for i in range(12):
    box("Radiator fin",(4.55+i*.13,6.14,1.24),(.09,.29,1.52),BLACK,.035)
rod("Radiator pipe",(4.49,6.12,.45),(6.20,6.12,.45),.07,BLACK)
box("Wall light switch",(7.40,6.43,3.00),(.22,.06,.34),CREAM,.022)
box("Wall switch rocker",(7.40,6.39,3.00),(.11,.018,.17),PAPER,.01)

# A real ceiling spotlight body at the source of the dramatic desk light.
spot=empty("Ceiling investigation spotlight",(-3.4,-4.0,8.4))
spot.rotation_euler=(Vector((0,0,2.5))-spot.location).to_track_quat("-Z","Y").to_euler()
lathe("Ceiling spotlight housing",[(0,0),(.20,0),(.27,-.40),(.27,-.47),(.23,-.48)],(0,0,0),BLACK,spot)
cylinder("Ceiling spotlight lens",(0,0,-.46),.23,.01,BULB,spot)
rod("Spotlight suspension",(-3.4,-4.0,8.4),(-3.4,-4.0,10.3),.025,BLACK)

# Shelf with real book volumes, a globe, and a little plant.
for z in [1.9,3.8,5.7]:box("Wall shelf",(-5.5,6.0,z),(3.8,1,.13),WOOD,.035)
for i in range(20):
    level=i//7
    x=-7.02+(i%7)*.42
    h=random.uniform(.74,1.30)
    book=box("Shelf book",(x,6.03,2.0+level*1.9+h/2),(.27,.62,h),BOOK_COLORS[i%5],.018)
    if i%4==0:book.rotation_euler.y=math.radians(7)
    for dz in [-.25,.25]:box("Book spine line",(x,5.70,2.0+level*1.9+h/2+dz),(.25,.009,.023),BRASS,.003)

plant=empty("Desk plant",(5.3,2.50,2.41))
lathe("Plant ceramic pot",[(0,0),(.30,0),(.38,.52),(.35,.56),(.31,.54),(.27,.08),(0,.08)],(0,0,0),WOOD_EDGE,plant)
cylinder("Plant soil",(0,0,.47),.32,.02,COFFEE,plant)
for i in range(7):
    a=i*math.tau/7
    p=(.25*math.cos(a),.25*math.sin(a),.8+random.random()*.32)
    rod("Plant stem",(0,0,.5),p,.018,GREEN,plant)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,radius=1,location=p)
    leaf=finish(bpy.context.object,"Plant leaf",GREEN,parent=plant)
    leaf.scale=(.11,.055,.34)
    leaf.rotation_euler=(math.radians(32)*math.sin(a),math.radians(32)*math.cos(a),a)
    for face in leaf.data.polygons: face.use_smooth=True

# Merge non-interactive static geometry by material to keep browser draw calls low.
static=[obj for obj in bpy.context.scene.objects if obj.type=="MESH" and not any(p.name.startswith("item_") or p.name.startswith("hinge_") for p in [obj.parent, obj.parent.parent if obj.parent else None] if p)]
groups={}
for obj in static:
    if len(obj.data.materials)==1:
        groups.setdefault(obj.data.materials[0].name,[]).append(obj)
for mat_name, objects in groups.items():
    if len(objects)<2: continue
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
        world=obj.matrix_world.copy()
        obj.parent=None
        obj.matrix_world=world
    bpy.context.view_layer.objects.active=objects[0]
    bpy.ops.object.join()
    bpy.context.object.name="Room_"+mat_name.replace(" ","_")

def scene_spot(name, loc, target, energy, color, angle, softness):
    light=bpy.data.lights.new(name,"SPOT")
    light.energy=energy
    light.color=color
    light.spot_size=angle*2
    light.spot_blend=softness
    light.shadow_soft_size=.18
    obj=bpy.data.objects.new(name,light)
    bpy.context.collection.objects.link(obj)
    obj.location=loc
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat("-Z","Y").to_euler()

scene_spot("Warm investigation key",(-3.4,-4.0,8.4),(0,0,2.5),1450,(1,.72,.43),.63,.48)
scene_spot("Cool window spill",(1.2,6.24,7.4),(-.4,-.8,2.45),450,(.35,.56,1),.68,.3)
scene_spot("Desk lamp pool",(-5,1.46,4.26),(-3,-.2,2.35),220,(1,.57,.24),.90,.75)
camera_data=bpy.data.cameras.new("Portfolio camera")
camera=bpy.data.objects.new("Portfolio camera",camera_data)
bpy.context.collection.objects.link(camera)
camera.location=(2.45,-8.4,5.65)
camera.rotation_euler=(Vector((-.15,.55,3.48))-camera.location).to_track_quat("-Z","Y").to_euler()
camera_data.lens=51
bpy.context.scene.camera=camera
bpy.context.scene.render.engine="CYCLES"
bpy.context.scene.cycles.samples=64
bpy.context.scene.render.resolution_x=1600
bpy.context.scene.render.resolution_y=1000
bpy.context.scene.world.color=(.015,.023,.035)
bpy.context.scene["Scene author"]="Shreyas Boddani portfolio / On My Desk"
bpy.context.scene["Build source"]="tools/build_desk.py"
bpy.context.preferences.filepaths.save_version=0
bpy.ops.file.pack_all()
bpy.ops.object.select_all(action="DESELECT")
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / "on-my-desk.blend"))
bpy.ops.export_scene.gltf(filepath=str(MODELS / "on-my-desk.glb"),export_format="GLB",export_extras=True,export_yup=True,export_apply=True,export_image_format="WEBP",export_image_quality=85)
meshes=[o for o in bpy.context.scene.objects if o.type=="MESH"]
print("DESK_MODEL_READY",len(meshes),"meshes",(MODELS / "on-my-desk.glb").stat().st_size,"bytes")
