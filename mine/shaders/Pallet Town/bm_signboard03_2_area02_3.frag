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

float SampleLightTable(texture2D tex, vec3 in_attr2, vec2 in_attr4) {
  vec4 fp_c6_data_1 = vec4(1, 1, 1, 1);
  vec4 fp_c4_data_1 = vec4(0, 1, 1, 0);
  vec4 fp_c4_data_2 = vec4(1, 0, 0, 0);
  vec4 fp_c4_data_3 = vec4(0, 1, 1, 0);

  float temp_116 = sin(fp_c4_data_1.z);
  float temp_117 = in_attr2.y + 1.0;
  float temp_118 = cos(fp_c4_data_1.z);
  float temp_119 = in_attr2.x + fp_c4_data_2.w;
  float temp_120 = -fp_c6_data_1.x;
  float temp_121 = fp_c6_data_1.x * temp_120;
  float temp_122 = in_attr2.z + fp_c4_data_3.x;
  float temp_123 = temp_119 * fp_c4_data_3.y;
  float temp_124 = -temp_121;
  float temp_125 = fma(fp_c6_data_1.z, fp_c6_data_1.z, temp_124);
  float temp_126 = temp_117 * 0.00100000005;
  float temp_127 = in_attr4.y + -0.5;
  float temp_128 = in_attr4.x + -0.5;
  float temp_129 = temp_116 * temp_127;
  float temp_130 = temp_127 * temp_118;
  float temp_131 = temp_125 * temp_126;
  float temp_132 = -temp_129;
  float temp_133 = fma(temp_118, temp_128, temp_132);
  float temp_134 = -fp_c6_data_1.x;
  float temp_135 = fp_c6_data_1.y * temp_134;
  float temp_136 = temp_123 * 0.00100000005;
  float temp_137 = temp_122 * fp_c4_data_3.z;
  float temp_138 = fma(temp_116, temp_133, temp_130);
  float temp_139 = fp_c6_data_1.y * fp_c6_data_1.z;
  float temp_140 = fma(temp_135, temp_136, temp_131);
  float temp_141 = temp_137 * 0.00100000005;
  float temp_142 = temp_136 * fp_c6_data_1.z;
  float temp_143 = -fp_c4_data_1.y;
  float temp_144 = temp_138 + temp_143;
  float temp_145 = -temp_141;
  float temp_146 = fma(temp_139, temp_145, temp_140);
  float temp_147 = -fp_c6_data_1.x;
  float temp_148 = fma(temp_141, temp_147, temp_142);
  float temp_149 = temp_144 + 0.5;
  float temp_150 = -temp_146;
  float temp_151 = temp_150 + -0.0;
  float temp_152 = temp_148 + 1.0;
  float temp_153 = -fp_c4_data_2.x;
  float temp_154 = fma(temp_149, temp_153, 1.0);
  float temp_155 = texture(sampler2D(tex, linearSampler), vec2(temp_152, temp_151)).r;
  return temp_155;
}

void main() {
  vec4 color = texture(sampler2D(texture2, linearSampler), vUv0);
  float lighting = SampleLightTable(texture0, normalize(vNormal.xyz), vUv0);

  outColor = mix(color, vec4(0), clamp(1.0 - lighting, 0.0, 1.0));
  worldColor = vPosition;
}
