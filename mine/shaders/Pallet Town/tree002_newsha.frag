#version 450
#pragma shader_stage(fragment)

layout (location = 0) in vec2 vUv0;
layout (location = 1) in vec2 vUv1;
layout (location = 2) in vec2 vUv2;
layout (location = 3) in vec2 vUv3;
layout (location = 4) in vec4 vColor0;
layout (location = 5) in vec4 vColor1;
layout (location = 6) in vec4 vColor2;
layout (location = 7) in vec4 vColor3;
layout (location = 8) in vec4 vNormal;
layout (location = 9) in vec4 vPosition;

layout (location = 0) out vec4 outColor;
layout (location = 1) out vec4 worldColor;

layout (set = 0, binding = 0) uniform Camera {
  vec4 forward;
  mat4 viewInverse;
  mat4 projectionInverse;
  mat4 viewProjection;
} uCamera;

layout (set = 0, binding = 1) uniform texture2D texture0;
layout (set = 0, binding = 2) uniform texture2D texture1;
layout (set = 0, binding = 3) uniform texture2D texture2;
layout (set = 0, binding = 4) uniform texture2D texture3;
layout (set = 0, binding = 5) uniform texture2D texture4;
layout (set = 0, binding = 6) uniform texture2D texture5;
layout (set = 0, binding = 7) uniform texture2D texture6;
layout (set = 0, binding = 8) uniform texture2D texture7;
layout (set = 0, binding = 9) uniform texture2D texture8;
layout (set = 0, binding = 10) uniform texture2D texture9;
layout (set = 0, binding = 11) uniform texture2D texture10;
layout (set = 0, binding = 12) uniform texture2D texture11;
layout (set = 0, binding = 13) uniform texture2D texture12;
layout (set = 0, binding = 14) uniform texture2D texture13;
layout (set = 0, binding = 15) uniform sampler linearSampler;

vec4 blend(vec4 a, vec4 b, float c) {
  return c * (b - a) + a;
}

void main() {
  vec4 color2 = texture(sampler2D(texture2, linearSampler), vUv0);
  if (color2.a <= 0.85) discard;
  vec4 color3 = texture(sampler2D(texture3, linearSampler), vUv1);
  vec4 transition = texture(sampler2D(texture4, linearSampler), vUv0);
  vec4 color = mix(color3, color2, 1.0 - 0.75);
  float intensity = clamp(
    dot(uCamera.forward.xyz, normalize(vNormal.xyz)), 0.0, 1.0
  );
  float mixFactor = (1.0 - intensity) * 0.5;
  outColor = blend(
    blend(color, color3 * 0.5, mixFactor),
    vec4(0.065, 0.53, 0.38, 1.0),
    mixFactor
  );
  worldColor = vPosition;
}
