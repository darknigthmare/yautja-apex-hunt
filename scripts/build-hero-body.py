"""Build the authored, continuous organic hero surface with Blender 4.3+.

Run: blender --background --factory-startup --threads 8 --python scripts/build-hero-body.py -- --bake
Optional: --source-texture /path/to/master.png --artifacts-dir /tmp/body-diagnostics
HERO_BODY_OUTPUT also sets the diagnostics directory; runtime assets stay in --output.
Coordinates are deliberately authored Y-up, facing +Z, in game units.
The GLB keeps these coordinates (export_yup=False) and contains its own textures.
"""
import argparse
from array import array
import shutil
import bpy
import json
import math
import os
import sys
from pathlib import Path
from mathutils import Vector, Matrix

repository_root = Path(__file__).resolve().parents[1]
args_parser = argparse.ArgumentParser()
args_parser.add_argument('--output', default=str(repository_root / 'public/assets/models/hero-organic-body.glb'))
args_parser.add_argument('--source-texture', default=str(repository_root / 'public/assets/textures/yautja-skin-albedo-v2.webp'))
args_parser.add_argument('--artifacts-dir', default=os.environ.get('HERO_BODY_OUTPUT', '/tmp/yautja-realism/models'), help='Directory for source copies, bakes and optional previews (or HERO_BODY_OUTPUT).')
args_parser.add_argument('--triangles', type=int, default=50000)
args_parser.add_argument('--voxel', type=float, default=0.022)
args_parser.add_argument('--texture-size', type=int, default=2048)
args_parser.add_argument('--bake', action='store_true')
args_parser.add_argument('--preview', action='store_true')
args = args_parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
args.source_texture = os.path.abspath(os.path.expanduser(args.source_texture))
if not os.path.isfile(args.source_texture):
    args_parser.error('Source texture does not exist: ' + args.source_texture)
output = os.path.abspath(args.output)
os.makedirs(os.path.dirname(output), exist_ok=True)
prefix = os.path.splitext(output)[0]
artifact_dir=os.path.abspath(os.path.expanduser(args.artifacts_dir))
os.makedirs(artifact_dir,exist_ok=True)
artifact_prefix=os.path.join(artifact_dir,os.path.basename(prefix))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 16
scene.cycles.use_denoising = False
scene.render.threads_mode = 'FIXED'
scene.render.threads = 8


def smoothstep(a, b, value):
    value = max(0.0, min(1.0, (value-a)/(b-a)))
    return value*value*(3-2*value)


def gaussian(value, center, width):
    return math.exp(-((value-center)/width)**2)


def interpolate(profiles, y, component):
    for index in range(len(profiles)-1):
        if y <= profiles[index+1][0]:
            first, second = profiles[index], profiles[index+1]
            delta = second[0]-first[0]
            t = max(0, min(1, (y-first[0])/delta))
            previous = profiles[max(0,index-1)]
            following = profiles[min(len(profiles)-1,index+2)]
            slope_a = (second[component]-previous[component]) / max(1e-5,second[0]-previous[0])
            slope_b = (following[component]-first[component]) / max(1e-5,following[0]-first[0])
            return (2*t**3-3*t*t+1)*first[component]+(t**3-2*t*t+t)*delta*slope_a+(-2*t**3+3*t*t)*second[component]+(t**3-t*t)*delta*slope_b
    return profiles[-1][component]

parts = []
print('BUILD_BEGIN anatomical profiles',flush=True)


def loft(name, profiles, rings=72, sides=48, side=1, sculpt=None):
    # Rows describe y, horizontal radius, depth radius, x centre, z centre.
    vertices=[]
    faces=[]
    minimum, maximum = profiles[0][0], profiles[-1][0]
    for ring in range(rings+1):
        y=minimum+(maximum-minimum)*ring/rings
        rx=max(.008,interpolate(profiles,y,1))
        rz=max(.008,interpolate(profiles,y,2))
        cx=interpolate(profiles,y,3)*side
        cz=interpolate(profiles,y,4)
        for sector in range(sides):
            angle=sector/sides*math.tau
            x=cx+math.sin(angle)*rx
            z=cz+math.cos(angle)*rz
            if sculpt:
                x,y_out,z=sculpt(x,y,z,angle,cx,cz)
            else:
                y_out=y
            vertices.append((x,y_out,z))
            if ring<rings:
                a=ring*sides+sector
                b=ring*sides+(sector+1)%sides
                faces.append((a,b,b+sides,a+sides))
    for ring,up in [(0,False),(rings,True)]:
        base=ring*sides
        center=len(vertices)
        vertices.append((interpolate(profiles,minimum if not up else maximum,3)*side,minimum if not up else maximum,interpolate(profiles,minimum if not up else maximum,4)))
        for sector in range(sides):
            a,b=base+sector,base+(sector+1)%sides
            faces.append((center,b,a) if not up else (center,a,b))
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(vertices,[],faces)
    mesh.update()
    obj=bpy.data.objects.new(name,mesh)
    scene.collection.objects.link(obj)
    parts.append(obj)
    return obj


def ellipsoid(name,location,scale):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=location)
    obj=bpy.context.object
    obj.name=name
    obj.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    parts.append(obj)


def sculpt_torso(x,y,z,angle,cx,cz):
    front=max(0,math.cos(angle))**3
    back=max(0,-math.cos(angle))**3
    # Broad pectoral insertions, defined sternum and serratus/abdominal sheet.
    chest=(gaussian(x,.43,.28)+gaussian(x,-.43,.28))*gaussian(y,5.58,.28)*.085
    sternum=gaussian(x,0,.055)*gaussian(y,5.45,.50)*.032
    abdominal=sum(gaussian(y,level,.13) for level in [4.35,4.64,4.94])*(gaussian(x,.17,.14)+gaussian(x,-.17,.14))*.032
    linea=gaussian(x,0,.034)*gaussian(y,4.7,.65)*.018
    z+=front*(chest-sternum+abdominal-linea)
    z-=back*((gaussian(x,.40,.23)+gaussian(x,-.40,.23))*gaussian(y,5.5,.36)*.06-gaussian(x,0,.045)*gaussian(y,5,.7)*.023)
    return x,y,z

loft('thoracic_and_abdominal_sheet',[
    (3.05,.17,.23,0,0),(3.25,.43,.31,0,-.01),(3.55,.64,.34,0,-.025),
    (3.85,.59,.31,0,0),(4.16,.51,.285,0,.005),(4.5,.56,.30,0,0),
    (4.9,.64,.34,0,0),(5.28,.79,.38,0,0),(5.60,.85,.39,0,0),
    (5.84,.82,.35,0,-.005),(6.0,.66,.28,0,-.015),(6.15,.35,.235,0,-.015),
    (6.31,.225,.205,0,-.01)],rings=112,sides=72,sculpt=sculpt_torso)


def sculpt_arm(x,y,z,angle,cx,cz):
    front=max(0,math.cos(angle))**3
    back=max(0,-math.cos(angle))**3
    z+=front*(gaussian(y,5.20,.35)*.055+gaussian(y,4.16,.27)*.035)
    z-=back*gaussian(y,5.2,.43)*.035
    return x,y,z


def sculpt_leg(x,y,z,angle,cx,cz):
    front=max(0,math.cos(angle))**3
    back=max(0,-math.cos(angle))**3
    z+=front*(gaussian(y,2.95,.45)*.05+gaussian(y,1.92,.16)*.022)
    z-=back*gaussian(y,1.32,.30)*.035
    # Long tibial edge; an anatomical plane rather than a uniform cylinder.
    z+=front*gaussian(y,1.1,.55)*gaussian(x,cx,.065)*.024
    return x,y,z

for side in [-1,1]:
    label='left' if side<0 else 'right'
    ellipsoid(label+'_deltoid',(side*.97,5.78,0),(.30,.34,.285))
    loft(label+'_arm',[
        (3.31,.11,.12,.93,0),(3.46,.125,.14,.94,0),(3.75,.17,.17,.98,.015),
        (4.12,.215,.215,1.025,.025),(4.37,.175,.18,.97,.01),(4.48,.15,.165,.93,0),
        (4.70,.18,.19,1.005,0),(5.15,.245,.25,1.07,.02),(5.50,.24,.245,1.075,0),
        (5.85,.245,.235,.98,0),(6.0,.15,.18,.93,0)],rings=96,sides=48,side=side,sculpt=sculpt_arm)
    ellipsoid(label+'_gluteal_mass',(side*.35,3.43,-.21),(.36,.39,.235))
    loft(label+'_leg',[
        (.22,.115,.13,.48,.005),(.42,.14,.145,.48,.005),(.78,.18,.19,.48,-.005),
        (1.25,.235,.275,.48,-.055),(1.52,.225,.255,.48,-.055),(1.77,.19,.205,.48,0),
        (1.91,.195,.22,.48,.025),(2.13,.205,.225,.48,.02),(2.52,.27,.275,.48,0),
        (3.0,.315,.32,.48,.01),(3.43,.32,.30,.48,-.005),(3.70,.255,.255,.48,-.01)],rings=120,sides=56,side=side,sculpt=sculpt_leg)

print('PROFILES_BUILT',len(parts),flush=True)
bpy.ops.object.select_all(action='DESELECT')
for obj in parts:obj.select_set(True)
bpy.context.view_layer.objects.active=parts[0]
bpy.ops.object.join()
high=bpy.context.object
high.name='hero_organic_high_sculpt'
remesh=high.modifiers.new('continuous_tissue_union','REMESH')
remesh.mode='VOXEL'
remesh.voxel_size=args.voxel
remesh.use_smooth_shade=True
print('VOXEL_BEGIN',flush=True)
bpy.ops.object.modifier_apply(modifier=remesh.name)
print('VOXEL_DONE',len(high.data.vertices),flush=True)
smooth=high.modifiers.new('relax_union_without_separate_capsules','SMOOTH')
smooth.factor=.6
smooth.iterations=4
bpy.ops.object.modifier_apply(modifier=smooth.name)
for polygon in high.data.polygons:polygon.use_smooth=True

low=high.copy()
low.data=high.data.copy()
scene.collection.objects.link(low)
low.name='hero_organic_body'
bpy.context.view_layer.objects.active=low
high.select_set(False)
low.select_set(True)
initial_triangles=sum(len(p.vertices)-2 for p in low.data.polygons)
print('DECIMATE_BEGIN',initial_triangles,flush=True)
if initial_triangles>args.triangles:
    decimate=low.modifiers.new('production_topology_budget','DECIMATE')
    decimate.ratio=args.triangles/initial_triangles
    bpy.ops.object.modifier_apply(modifier=decimate.name)
triangulate=low.modifiers.new('explicit_triangles','TRIANGULATE')
bpy.ops.object.modifier_apply(modifier=triangulate.name)
for polygon in low.data.polygons:polygon.use_smooth=True
print('DECIMATE_DONE',len(low.data.polygons),flush=True)
# Five non-overlapping anatomical charts avoid the global polygon-packer cost
# while preserving continuous circumferential coordinates on each limb.
uv_layer=low.data.uv_layers.new(name='anatomical_atlas')
charts={'torso':(.02,.52,.46,.46),'arm_l':(.52,.52,.21,.46),'arm_r':(.77,.52,.21,.46),'leg_l':(.02,.02,.21,.46),'leg_r':(.27,.02,.21,.46)}
chart_values={name:[] for name in charts}
chart_triangle_counts={name:0 for name in charts}
for polygon in low.data.polygons:
    centre=polygon.center
    if centre.y>3.64 and abs(centre.x)>.745:
        chart='arm_l' if centre.x<0 else 'arm_r';axis=-.98 if centre.x<0 else .98;lo,hi=3.3,6.03
    elif centre.y<3.4 and abs(centre.x)>.16:
        chart='leg_l' if centre.x<0 else 'leg_r';axis=-.48 if centre.x<0 else .48;lo,hi=.21,3.70
    else:
        chart='torso';axis=0;lo,hi=3.04,6.32
    values=[]
    for loop_index in polygon.loop_indices:
        point=low.data.vertices[low.data.loops[loop_index].vertex_index].co
        u=math.atan2(point.x-axis,point.z)/math.tau+.5
        v=max(0,min(1,(point.y-lo)/(hi-lo)))
        values.append([loop_index,u,v])
    if max(value[1] for value in values)-min(value[1] for value in values)>.5:
        for value in values:
            if value[1]<.5:value[1]+=1
    chart_values[chart].extend(values)
    chart_triangle_counts[chart]+=len(polygon.vertices)-2
# Seam unwrapping can produce U > 1. Normalize the complete observed range of
# each chart, including its duplicated seam loops, before placing it in the
# atlas. Leave enough empty border for the 12-pixel bake dilation plus filtering.
atlas_padding=min(16/args.texture_size,min(min(rect[2:]) for rect in charts.values())*.1)
uv_metrics={'paddingPixels':atlas_padding*args.texture_size,'charts':{}}
for name,values in chart_values.items():
    left,bottom,width,height=charts[name]
    minimum_u=min(value[1] for value in values)
    maximum_u=max(value[1] for value in values)
    u_span=max(maximum_u-minimum_u,1e-8)
    for loop_index,u,v in values:
        uv_layer.data[loop_index].uv=(left+atlas_padding+(u-minimum_u)/u_span*(width-2*atlas_padding),bottom+atlas_padding+v*(height-2*atlas_padding))
    mapped=[uv_layer.data[value[0]].uv for value in values]
    bounds={'min':[min(uv[axis] for uv in mapped) for axis in range(2)],'max':[max(uv[axis] for uv in mapped) for axis in range(2)]}
    assert all(left+atlas_padding-1e-6<=uv.x<=left+width-atlas_padding+1e-6 and bottom+atlas_padding-1e-6<=uv.y<=bottom+height-atlas_padding+1e-6 for uv in mapped), 'UV escaped chart '+name
    uv_metrics['charts'][name]={'rect':[left,bottom,width,height],'rawURange':[minimum_u,maximum_u],'bounds':bounds,'triangles':chart_triangle_counts[name]}
uv_metrics['bounds']={'min':[min(loop.uv[axis] for loop in uv_layer.data) for axis in range(2)],'max':[max(loop.uv[axis] for loop in uv_layer.data) for axis in range(2)]}
print('ANATOMICAL_UV_DONE',json.dumps(uv_metrics),flush=True)

# Skin indices are exported by glTF from these named vertex groups.
bones=[('joint:pelvis',(0,3.7,0),(0,4,0),None),('joint:torso',(0,4,0),(0,6.2,0),'joint:pelvis'),('joint:head',(0,6.6602,0),(0,7.2,0),'joint:torso')]
for suffix,side in [('l',-1),('r',1)]:
    bones.extend([(f'joint:shoulder_{suffix}',(side*.93,5.95,0),(side*.93,4.48,0),'joint:torso'),(f'joint:elbow_{suffix}',(side*.93,4.48,0),(side*.93,3.38,0),f'joint:shoulder_{suffix}'),(f'joint:wrist_{suffix}',(side*.93,3.38,0),(side*.93,3.1,0),f'joint:elbow_{suffix}')])
for suffix,side in [('l',-1),('r',1)]:
    bones.extend([(f'joint:hip_{suffix}',(side*.48,3.7,0),(side*.48,1.91,0),'joint:pelvis'),(f'joint:knee_{suffix}',(side*.48,1.91,0),(side*.48,.30,0),f'joint:hip_{suffix}'),(f'joint:ankle_{suffix}',(side*.48,.30,0),(side*.48,.05,.2),f'joint:knee_{suffix}')])
groups={name:low.vertex_groups.new(name=name) for name,*_ in bones}
for vertex in low.data.vertices:
    x,y,z=vertex.co
    suffix='l' if x<0 else 'r'
    arm_factor=smoothstep(.68,.94,abs(x))*smoothstep(3.65,3.95,y)
    arm_factor*=1-smoothstep(5.92,6.2,y)
    torso_factor=1-arm_factor
    weights={}
    if arm_factor>0:
        elbow=1-smoothstep(4.28,4.70,y)
        wrist=1-smoothstep(3.30,3.64,y)
        weights[f'joint:shoulder_{suffix}']=arm_factor*(1-elbow)
        weights[f'joint:elbow_{suffix}']=arm_factor*elbow*(1-wrist)
        weights[f'joint:wrist_{suffix}']=arm_factor*elbow*wrist
    leg_factor=(1-smoothstep(3.15,3.66,y))*smoothstep(.10,.32,abs(x))*torso_factor
    if leg_factor>0:
        knee=1-smoothstep(1.70,2.13,y)
        ankle=1-smoothstep(.26,.55,y)
        weights[f'joint:hip_{suffix}']=leg_factor*(1-knee)
        weights[f'joint:knee_{suffix}']=leg_factor*knee*(1-ankle)
        weights[f'joint:ankle_{suffix}']=leg_factor*knee*ankle
    centre=torso_factor-leg_factor
    spine=smoothstep(3.63,4.28,y)
    head=smoothstep(5.95,6.31,y)*.88
    weights['joint:pelvis']=centre*(1-spine)
    weights['joint:torso']=centre*spine*(1-head)
    weights['joint:head']=centre*spine*head
    ordered=sorted([(name,weight) for name,weight in weights.items() if weight>1e-7],key=lambda entry:entry[1],reverse=True)[:4]
    total=sum(weight for _,weight in ordered)
    for name,weight in ordered:groups[name].add([vertex.index],weight/total,'REPLACE')

print('SKIN_WEIGHTS_DONE',flush=True)
# High-frequency detail follows anatomy; it is not a uniform noisy surface.
subdivision=high.modifiers.new('bake_resolution','SUBSURF')
subdivision.levels=1
subdivision.render_levels=1
bpy.context.view_layer.objects.active=high
bpy.ops.object.modifier_apply(modifier=subdivision.name)
print('HIGH_SCULPT_SUBDIVIDED',len(high.data.vertices),flush=True)
high.data.update()
pigment=high.data.color_attributes.new(name='anatomical_pigment',type='FLOAT_COLOR',domain='POINT')
vertex_count=len(high.data.vertices)
coordinates=array('f',[0.0])*(vertex_count*3)
normals=array('f',[0.0])*(vertex_count*3)
colours=array('f',[0.0])*(vertex_count*4)
high.data.vertices.foreach_get('co',coordinates)
high.data.vertices.foreach_get('normal',normals)
# Snapshot normals once before displacement. Reading vertex.normal after each
# RNA coordinate edit recomputes the entire normal cache, an O(n²) trap.
for index in range(vertex_count):
    offset=index*3
    x,y,z=coordinates[offset:offset+3]
    front=smoothstep(-.05,.2,z)
    knee=gaussian(y,1.91,.20)*smoothstep(.20,.42,abs(x))
    elbow=gaussian(y,4.48,.16)*smoothstep(.72,1.04,abs(x))
    compression=(knee+elbow)*math.sin(y*140+x*18)*.0028
    arm_vein=gaussian(abs(x),1.12+.025*math.sin(y*7),.028)*gaussian(z,.14+.03*math.cos(y*8),.035)*gaussian(y,5.12,.60)*.009
    leg_tendon=gaussian(abs(x),.48,.04)*gaussian(y,1.12,.48)*front*.004
    displacement=compression+arm_vein+leg_tendon
    for axis in range(3):coordinates[offset+axis]+=normals[offset+axis]*displacement
    amount=min(.48,knee*.24+elbow*.30+gaussian(y,5.8,.28)*smoothstep(.6,1.0,abs(x))*.14+(1-front)*.10)
    colours[index*4:index*4+4]=array('f',[amount,amount,amount,1])
high.data.vertices.foreach_set('co',coordinates)
pigment.data.foreach_set('color',colours)
print('HIGH_SCULPT_DETAIL_DONE',flush=True)

high.data.update()

high_mat=bpy.data.materials.new('spatial_skin_source')
high_mat.use_nodes=True
nodes=high_mat.node_tree.nodes
nodes.clear()
output_node=nodes.new('ShaderNodeOutputMaterial')
principled=nodes.new('ShaderNodeBsdfPrincipled')
principled.inputs['Roughness'].default_value=.66
high_mat.node_tree.links.new(principled.outputs['BSDF'],output_node.inputs['Surface'])
if os.path.exists(args.source_texture):
    source_copy=artifact_prefix+'-source'+Path(args.source_texture).suffix.lower()
    if args.source_texture!=source_copy:shutil.copy2(args.source_texture,source_copy)
    source=bpy.data.images.load(args.source_texture,check_existing=True)
    source.pack()
    photo=nodes.new('ShaderNodeTexImage')
    photo.image=source
    photo.projection='BOX'
    photo.projection_blend=.28
    coord=nodes.new('ShaderNodeTexCoord')
    mapping=nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value=(1.2,1.2,1.2)
    high_mat.node_tree.links.new(coord.outputs['Position'] if 'Position' in coord.outputs else coord.outputs['Object'],mapping.inputs['Vector'])
    high_mat.node_tree.links.new(mapping.outputs['Vector'],photo.inputs['Vector'])
    mix=nodes.new('ShaderNodeMixRGB')
    mix.blend_type='MULTIPLY'
    mix.inputs[2].default_value=(.36,.28,.19,1)
    colour=nodes.new('ShaderNodeVertexColor')
    colour.layer_name=pigment.name
    high_mat.node_tree.links.new(colour.outputs['Color'],mix.inputs[0])
    high_mat.node_tree.links.new(photo.outputs['Color'],mix.inputs[1])
    high_mat.node_tree.links.new(mix.outputs[0],principled.inputs['Base Color'])
else:principled.inputs['Base Color'].default_value=(.32,.24,.13,1)
high.data.materials.clear()
high.data.materials.append(high_mat)
low_mat=bpy.data.materials.new('hero_organic_baked_skin')
low_mat.use_nodes=True
low.data.materials.clear()
low.data.materials.append(low_mat)
low_nodes=low_mat.node_tree.nodes
low_principled=low_nodes.get('Principled BSDF')
low_principled.inputs['Base Color'].default_value=(.45,.31,.16,1)
low_principled.inputs['Roughness'].default_value=.66
low_principled.inputs['Metallic'].default_value=0
textures={}
if args.bake:
    for channel,bake_type in [('albedo','DIFFUSE'),('normal','NORMAL'),('ao','AO')]:
        image=bpy.data.images.new('hero_organic_'+channel,width=args.texture_size,height=args.texture_size,alpha=False)
        image.colorspace_settings.name='sRGB' if channel=='albedo' else 'Non-Color'
        image.generated_color=(.5,.5,1,1) if channel=='normal' else (1,1,1,1)
        target=low_nodes.new('ShaderNodeTexImage')
        target.image=image
        low_nodes.active=target
        bpy.ops.object.select_all(action='DESELECT')
        low.select_set(True)
        bpy.context.view_layer.objects.active=low
        high.hide_render=(channel=='ao')
        high.select_set(channel!='ao')
        scene.render.bake.use_selected_to_active=(channel!='ao')
        scene.render.bake.use_clear=True
        scene.render.bake.cage_extrusion=.045
        scene.render.bake.max_ray_distance=.07
        scene.render.bake.margin=12
        scene.render.bake.use_pass_direct=False
        scene.render.bake.use_pass_indirect=False
        scene.render.bake.use_pass_color=True
        print('BAKE_START',channel,flush=True)
        bpy.ops.object.bake(type=bake_type)
        image.filepath_raw=artifact_prefix+'-'+channel+'.png'
        image.file_format='PNG'
        image.save()
        image.pack()
        textures[channel]=target
        print('BAKE_DONE',channel,flush=True)
    low_mat.node_tree.links.new(textures['albedo'].outputs['Color'],low_principled.inputs['Base Color'])
    normal_node=low_nodes.new('ShaderNodeNormalMap')
    low_mat.node_tree.links.new(textures['normal'].outputs['Color'],normal_node.inputs['Color'])
    low_mat.node_tree.links.new(normal_node.outputs['Normal'],low_principled.inputs['Normal'])
    # glTF's documented custom group connects a baked occlusion texture.
    ao_group=bpy.data.node_groups.new('glTF Material Output','ShaderNodeTree')
    ao_group.interface.new_socket(name='Occlusion',in_out='INPUT',socket_type='NodeSocketFloat')
    ao_node=low_nodes.new('ShaderNodeGroup')
    ao_node.node_tree=ao_group
    low_mat.node_tree.links.new(textures['ao'].outputs['Color'],ao_node.inputs['Occlusion'])
high.hide_render=True
high.hide_viewport=True

bpy.ops.object.select_all(action='DESELECT')
bpy.ops.object.armature_add(enter_editmode=True,location=(0,0,0))
armature=bpy.context.object
armature.name='hero_organic_rest_skeleton'
for bone in list(armature.data.edit_bones):armature.data.edit_bones.remove(bone)
for name,head,tail,parent in bones:
    bone=armature.data.edit_bones.new(name)
    bone.head=head
    bone.tail=tail
    if parent:bone.parent=armature.data.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
armature_modifier=low.modifiers.new('existing_game_joint_weights','ARMATURE')
armature_modifier.object=armature
low.parent=armature

# Check connectedness and normalized influence sets on the actual export mesh.
adjacency=[[] for _ in low.data.vertices]
for edge in low.data.edges:
    a,b=edge.vertices
    adjacency[a].append(b)
    adjacency[b].append(a)
visited=set()
components=[]
for start in range(len(adjacency)):
    if start in visited:continue
    pending=[start]
    visited.add(start)
    count=0
    while pending:
        current=pending.pop();count+=1
        for neighbor in adjacency[current]:
            if neighbor not in visited:visited.add(neighbor);pending.append(neighbor)
    components.append(count)
triangles=sum(len(poly.vertices)-2 for poly in low.data.polygons)
metrics={'source':'authored anatomical lofts, Blender voxel union and high-to-low baking','coordinateSystem':'Y-up, facing +Z; game units','triangles':triangles,'vertices':len(low.data.vertices),'components':components,'voxelSize':args.voxel,'textures':{name:[args.texture_size,args.texture_size] for name in textures},'boneNames':[entry[0] for entry in bones],'restPositions':{entry[0]:list(entry[1]) for entry in bones},'noHeadHandsFeet':True,'uvAtlas':uv_metrics}
assert len(components)==1, 'Organic body must be one connected tissue surface: '+str(components)
assert 20000<=triangles<=70000, 'Unexpected production topology budget: '+str(triangles)
for vertex in low.data.vertices:
    weights=[group.weight for group in vertex.groups]
    assert 1<=len(weights)<=4 and abs(sum(weights)-1)<.0001
with open(prefix+'-metrics.json','w') as file:json.dump(metrics,file,indent=2)
low['organicBodyMetrics']=json.dumps(metrics)
bpy.ops.object.select_all(action='DESELECT')
low.select_set(True)
armature.select_set(True)
bpy.context.view_layer.objects.active=low
bpy.ops.export_scene.gltf(filepath=output,export_format='GLB',use_selection=True,export_yup=False,export_animations=False,export_skins=True,export_all_influences=False,export_extras=True,export_image_format='AUTO')
print('ORGANIC_BODY_EXPORTED',json.dumps(metrics),flush=True)

if args.preview:
    # A neutral clay view to inspect anatomy without hiding it under texture/armour.
    clay=bpy.data.materials.new('neutral_anatomy_inspection')
    clay.diffuse_color=(.38,.34,.27,1)
    clay.use_nodes=True
    clay.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.38,.34,.27,1)
    clay.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.7
    low.data.materials.clear();low.data.materials.append(clay)
    scene.world.color=(.07,.07,.07)
    for location,power,size in [((5,9,8),1400,5),((-5,5,4),900,4),((0,7,-5),1500,4)]:
        bpy.ops.object.light_add(type='AREA',location=location)
        light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector((0,3.3,0))-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.camera_add(location=(7.8,4.3,12))
    camera=bpy.context.object
    forward=(Vector((0,3.25,0))-camera.location).normalized()
    right=forward.cross(Vector((0,1,0))).normalized()
    up=right.cross(forward).normalized()
    camera.rotation_euler=Matrix(((right.x,up.x,-forward.x),(right.y,up.y,-forward.y),(right.z,up.z,-forward.z))).to_euler()
    camera.data.type='ORTHO';camera.data.ortho_scale=7.0;scene.camera=camera
    scene.render.resolution_x=850;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
    scene.render.filepath=artifact_prefix+'-clay.png'
    bpy.ops.render.render(write_still=True)
