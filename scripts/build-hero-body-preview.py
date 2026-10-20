"""Render geometry evidence from an exported GLB, without rebuilding it.

Run: blender --background --factory-startup --python scripts/build-hero-body-preview.py --
Optional: --input /path/to/body.glb --artifacts-dir /tmp/body-diagnostics
HERO_BODY_OUTPUT also sets the diagnostics directory.
"""
import argparse
import bpy
import os
import sys
from pathlib import Path
from mathutils import Vector, Matrix
repository_root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--input', default=str(repository_root/'public/assets/models/hero-organic-body.glb'))
parser.add_argument('--artifacts-dir', default=os.environ.get('HERO_BODY_OUTPUT','/tmp/yautja-realism/models'))
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
asset=os.path.abspath(os.path.expanduser(args.input))
if not os.path.isfile(asset):parser.error('GLB does not exist: '+asset)
output=os.path.abspath(os.path.expanduser(args.artifacts_dir))
prefix=Path(asset).stem
os.makedirs(output,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=asset)
scene=bpy.context.scene
bpy.context.view_layer.update()
meshes=[obj for obj in scene.objects if obj.type=='MESH']
corners=[obj.matrix_world@Vector(corner) for obj in meshes for corner in obj.bound_box]
minimum=Vector(tuple(min(point[axis] for point in corners) for axis in range(3)))
maximum=Vector(tuple(max(point[axis] for point in corners) for axis in range(3)))
centre=(minimum+maximum)*.5
size=maximum-minimum
longest=max(range(3),key=lambda axis:size[axis])
up=Vector((0,0,1) if longest==2 else (0,1,0))
front=Vector((0,-1,0) if longest==2 else (0,0,1))
right=up.cross(front).normalized()
print('WORLD_BOUNDS',list(minimum),list(maximum),'UP',list(up),flush=True)
scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=24
scene.cycles.use_denoising=False
scene.render.threads_mode='FIXED'
scene.render.threads=8
material=bpy.data.materials.new('neutral_clay_anatomy')
material.use_nodes=True
principled=material.node_tree.nodes.get('Principled BSDF')
principled.inputs['Base Color'].default_value=(.38,.34,.27,1)
principled.inputs['Roughness'].default_value=.72
for obj in meshes:
 obj.data.materials.clear();obj.data.materials.append(material)
scene.world.color=(.09,.09,.09)
def aim(obj,target):
 forward=(target-obj.location).normalized()
 horizontal=forward.cross(up).normalized()
 vertical=horizontal.cross(forward).normalized()
 obj.rotation_euler=Matrix(((horizontal.x,vertical.x,-forward.x),(horizontal.y,vertical.y,-forward.y),(horizontal.z,vertical.z,-forward.z))).to_euler()
for side,depth,height,power,area in [(5,8,5,1700,5),(-5,4,2,1000,4),(0,-5,4,1800,4)]:
 bpy.ops.object.light_add(type='AREA',location=centre+right*side+front*depth+up*height)
 light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=area;aim(light,centre)
bpy.ops.object.camera_add()
camera=bpy.context.object;camera.data.type='ORTHO';camera.data.ortho_scale=max(size)*1.15;scene.camera=camera
scene.render.resolution_x=850;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
for name,offset in [('front',front*14),('threequarter',front*12+right*7.8+up*.9)]:
 camera.location=centre+offset;aim(camera,centre)
 scene.render.filepath=os.path.join(output,prefix+'-clay-'+name+'.png')
 bpy.ops.render.render(write_still=True)
 print('PREVIEW_SAVED',scene.render.filepath,flush=True)
