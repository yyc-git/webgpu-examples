#version 460
#extension GL_EXT_ray_tracing : require
#pragma shader_stage(closest)

layout(location = 0) rayPayloadInEXT vec4 hitValue;

hitAttributeEXT vec4 attribs;

void main() {
  const vec3 bary = vec3(1.0 - attribs.x - attribs.y, attribs.x, attribs.y);
  vec3 worldPosition = gl_WorldRayOriginEXT + gl_RayTmaxEXT * gl_WorldRayDirectionEXT;
  hitValue = vec4(worldPosition, 0);
}
