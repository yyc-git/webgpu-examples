#version 460
#extension GL_EXT_ray_tracing : require
#extension GL_GOOGLE_include_directive : enable
#pragma shader_stage(miss)

layout(location = 1) rayPayloadInEXT bool shadowed;

void main() {
  shadowed = false;
}
