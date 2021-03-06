#version 460
#extension GL_EXT_ray_tracing : enable
#pragma shader_stage(closest)

layout(location = 0) rayPayloadInEXT vec3 hitValue;
layout(location = 1) rayPayloadEXT bool isShadowed;

layout(set = 0, binding = 0) uniform accelerationStructureEXT topLevelAS;

void main() {
  const float tMin = 0.1;

  float tMax = 100000.0;
  vec3 origin = vec3(0.1);
  vec3 rayDir = vec3(0.2, 0.1, 0.3);

  uint flags = gl_RayFlagsTerminateOnFirstHitEXT;
  isShadowed = true;

  traceRayEXT(topLevelAS, // acceleration structure
              flags,      // rayFlags
              0xFF,       // cullMask
              1,          // sbtRecordOffset
              0,          // sbtRecordStride
              1,          // missIndex
              origin,     // ray origin
              tMin,       // ray min range
              rayDir,     // ray direction
              tMax,       // ray max range
              1           // payload (location = 1)
  );

  hitValue = vec3(0.9);
}