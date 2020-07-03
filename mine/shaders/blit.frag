#version 450
#pragma shader_stage(fragment)

layout (location = 0) in vec2 vUv;
layout (location = 0) out vec4 outColor;

layout (binding = 0) uniform sampler sampler0;

layout (binding = 1) uniform texture2D texture0;
layout (binding = 2) uniform texture2D texture1;
layout (binding = 3) uniform texture2D texture2;

vec3 reconstructNormal(vec3 pos) {
  vec3 fdx = vec3(dFdx(pos.x), dFdx(pos.y), dFdx(pos.z));    
  vec3 fdy = vec3(dFdy(pos.x), dFdy(pos.y), dFdy(pos.z));
  vec3 normal = normalize(cross(fdx,fdy));
  return normal;
}

void main() {
  float padding = 1.0 / 2.0;
  if (vUv.x >= padding * 0) {
    outColor = vec4(texture(sampler2D(texture0, sampler0), vUv).rgb, 1.0);
  }
  /*if (vUv.x >= padding * 1) {
    outColor = vec4(texture(sampler2D(texture1, sampler0), vUv).rgb * 0.001, 1.0);
  }*/
  if (vUv.x >= padding * 1) {
    outColor = vec4(texture(sampler2D(texture2, sampler0), vec2(vUv.x, 1.0 - vUv.y)).rgb, 1.0);
  }
}
