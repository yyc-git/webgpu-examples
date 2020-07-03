#version 450
#pragma shader_stage(vertex)

layout (location = 0) out vec2 vUV;

void main(void) {
  vec2 uv = vec2((gl_VertexIndex << 1) & 2, gl_VertexIndex & 2);
  gl_Position = vec4(uv * 2.0 + -1.0f, 0.0, 1.0);
  vUV = vec2(uv.x, 1.0 - uv.y);
}
