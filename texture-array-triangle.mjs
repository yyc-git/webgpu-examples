import WebGPU from "webgpu";

Object.assign(global, WebGPU);


import Util from "util";


function printComplete(message, value) {
    console.log(message, Util.inspect(value, {
        maxArrayLength: null
    }));
    return value;
}




























const vsSrc = `
  #version 450
  #pragma shader_stage(vertex)
  layout(location = 0) in vec2 position;
  layout(location = 1) in vec2 texCoord;

  layout (location = 0) out vec2 v_texCoord;

  void main() {
    v_texCoord = texCoord;

    v_texCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y);

    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fsSrc = `
  #version 450
  #pragma shader_stage(fragment)

  layout (location = 0) in vec2 v_texCoord;

  layout(location = 0) out vec4 outColor;

  layout (binding = 0) uniform sampler TextureSampler;
  layout (binding = 1) uniform texture2DArray TextureArray;

  void main() {
    //outColor = vec4(1.0, 0.0, 0.0, 1.0);

    uint textureIndex = 0;





// vec2 new_texCoord = vec2(0.0);

// if(v_texCoord.x > 1.0){
// new_texCoord.x = 1.0 + (v_texCoord.x - 1.0) * 8 / 2048;
// }
// else if(v_texCoord.x < 0.0){
// new_texCoord.x = (1.0 + v_texCoord.x) * 8 / 2048 - 1.0;
// }
// else{
// new_texCoord.x = v_texCoord.x * 8 / 2048;
// }


// if(v_texCoord.y > 1.0){
// new_texCoord.y = 1.0 + (v_texCoord.y - 1.0) * 4 / 2048;
// }
// else if(v_texCoord.y < 0.0){
// new_texCoord.y = (1.0 + v_texCoord.y) * 4 / 2048 - 1.0;
// }
// else{
// new_texCoord.y = v_texCoord.y * 4 / 2048;
// }






// vec2 new_texCoord = vec2(v_texCoord.x * 8 / 16, v_texCoord.y * 4 / 16);
vec2 new_texCoord = vec2(v_texCoord.x * 8 / 2048, v_texCoord.y * 4 / 2048);
// vec2 new_texCoord = v_texCoord;



//handle clamp to edge
// if(new_texCoord.x < 0.0){
// new_texCoord.x = 0.0;
// }
// else if(new_texCoord.x > 1.0){
// new_texCoord.x = 1.0;
// }

// if(new_texCoord.y < 0.0){
// new_texCoord.y = 0.0;
// }
// else if(new_texCoord.y > 1.0){
// new_texCoord.y = 1.0;
// }



// if(new_texCoord.x > 1.0 * 8 / 2048){
// new_texCoord.x = 1.0 + v_texCoord.x * 8 / 2048;
// }


// if(new_texCoord.y > 1.0 * 8 / 2048){
// new_texCoord.y = 1.0 + v_texCoord.y * 8 / 2048;
// }

    outColor = texture(sampler2DArray(TextureArray, TextureSampler), vec3(new_texCoord, textureIndex));
  }
`;

(async function main() {

    const triangleVertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);


    const triangleTexCoords = new Float32Array([
        0.5, 1.0,
        0.0, 0.0,
        // -0.5, 0.0,
        // 0.6, 0.0,
        1.0, 0.0
        // 1.2, 0.0
        // 0.3, 0.0
    ]);

    const triangleIndices = new Uint32Array([
        0, 1, 2
    ]);

    const window = new WebGPUWindow({
        width: 640,
        height: 480,
        title: "WebGPU"
    });

    const context = window.getContext("webgpu");

    const adapter = await GPU.requestAdapter({ window });

    const device = await adapter.requestDevice();

    const queue = device.getQueue();

    const swapChainFormat = await context.getSwapChainPreferredFormat(device);

    const swapChain = context.configureSwapChain({
        device: device,
        format: swapChainFormat
    });

    // demonstrate verbose staging process
    const stagingVertexBuffer = device.createBuffer({
        size: triangleVertices.byteLength,
        usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
    });
    const stagingVertexBufferView = await stagingVertexBuffer.mapWriteAsync();
    new Float32Array(stagingVertexBufferView).set(triangleVertices, 0);
    stagingVertexBuffer.unmap();

    const stagedVertexBuffer = device.createBuffer({
        size: triangleVertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });



    // staging->staged buffer
    const bufferCopyEncoder = device.createCommandEncoder({});
    bufferCopyEncoder.copyBufferToBuffer(
        stagingVertexBuffer,
        0,
        stagedVertexBuffer,
        0,
        triangleVertices.byteLength
    );
    queue.submit([bufferCopyEncoder.finish()]);




    const stagedUVBuffer = device.createBuffer({
        size: triangleTexCoords.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    stagedUVBuffer.setSubData(0, triangleTexCoords);

    // staging shortcut using buffer.setSubData
    const stagedIndexBuffer = device.createBuffer({
        size: triangleIndices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    stagedIndexBuffer.setSubData(0, triangleIndices);

    // const layout = device.createPipelineLayout({
    //     bindGroupLayouts: []
    // });

    const vertexShaderModule = device.createShaderModule({ code: vsSrc });
    const fragmentShaderModule = device.createShaderModule({ code: fsSrc });










    const imageCount = 1;
    const imageWidth = 2048;
    const imageHeight = 2048;
    // const imageWidth = 16;
    // const imageHeight = 16;
    // const imageWidth = 8;
    // const imageHeight = 4;

    const textureArray = device.createTexture({
        size: {
            width: imageWidth,
            height: imageHeight,
            depth: 1
        },
        arrayLayerCount: imageCount,
        mipLevelCount: 1,
        sampleCount: 1,
        dimension: "2d",
        format: "rgba8unorm-srgb",
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED
    });

    const textureArrayView = textureArray.createView({
        dimension: "2d-array",
        baseArrayLayer: 0,
        arrayLayerCount: imageCount,
        format: "rgba8unorm-srgb"
    });

    const textureSampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        // addressModeU: "repeat",
        // addressModeV: "repeat",
        // addressModeW: "repeat"
        // addressModeU: "clamp_to_edge",
        // addressModeV: "clamp_to_edge",
        // addressModeW: "clamp_to_edge"
        addressModeU: "mirror-repeat",
        addressModeV: "mirror-repeat",
        addressModeW: "mirror-repeat"
    });



    // const imageColors = [
    //     [255, 0, 0],   // red
    //     [0, 255, 0],   // green
    //     [0, 0, 255],   // blue
    //     [255, 0, 255], // pink
    // ];



    let imageActualData = [];
    let imageActualWidth = 8;
    let imageActualHeight = 4;


    imageActualData = [
        //0 row
        255, 0, 0, 255,
        200, 0, 0, 255,
        180, 0, 0, 255,
        160, 0, 0, 255,
        140, 0, 0, 255,
        120, 0, 0, 255,
        100, 0, 0, 255,
        50, 0, 0, 255,
        //1 row
        0, 255, 0, 255,
        0, 200, 0, 255,
        0, 180, 0, 255,
        0, 160, 0, 255,
        0, 140, 0, 255,
        0, 120, 0, 255,
        0, 100, 0, 255,
        0, 50, 0, 255,
        //2 row
        0, 0, 255, 255,
        0, 0, 200, 255,
        0, 0, 180, 255,
        0, 0, 160, 255,
        0, 0, 140, 255,
        0, 0, 120, 255,
        0, 0, 100, 255,
        0, 0, 50, 255,
        //3 row
        50, 0, 0, 255,
        100, 0, 0, 255,
        120, 0, 0, 255,
        140, 0, 0, 255,
        160, 0, 0, 255,
        180, 0, 0, 255,
        200, 0, 0, 255,
        255, 0, 0, 255,
    ];




    const commandEncoder = device.createCommandEncoder({});
    for (let ii = 0; ii < imageCount; ++ii) {
        const bytesPerRow = Math.ceil(imageWidth * 4 / 256) * 256;
        const data = new Uint8Array(bytesPerRow * imageHeight);
        // for (let yy = 0; yy < imageHeight; ++yy) {
        //     for (let xx = 0; xx < imageWidth; ++xx) {
        for (let yy = 0; yy < imageActualHeight; ++yy) {
            for (let xx = 0; xx < imageActualWidth; ++xx) {
                const index = xx * 4 + yy * bytesPerRow;
                let index2 = xx * 4 + yy * imageActualWidth * 4;
                // data[index + 0] = imageColors[ii][0];
                // data[index + 1] = imageColors[ii][1];
                // data[index + 2] = imageColors[ii][2];
                // data[index + 3] = 255;


                data[index + 0] = imageActualData[index2 + 0];
                data[index + 1] = imageActualData[index2 + 1];
                data[index + 2] = imageActualData[index2 + 2];
                data[index + 3] = imageActualData[index2 + 3];
            };
        };

        // printComplete("data:", data);

        const textureBuffer = device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });
        textureBuffer.setSubData(0, data);

        commandEncoder.copyBufferToTexture(
            {
                buffer: textureBuffer,
                bytesPerRow: bytesPerRow,
                arrayLayer: 0,
                mipLevel: 0,
                imageHeight: 0
            },
            {
                texture: textureArray,
                mipLevel: 0,
                arrayLayer: ii,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                width: imageWidth,
                height: imageHeight,
                depth: 1
            }
        );
    };
    queue.submit([commandEncoder.finish()]);


    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                type: "sampler"
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                type: "sampled-texture",
                viewDimension: "2d-array"
            }
        ]
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                sampler: textureSampler,
                size: 0
            },
            {
                binding: 1,
                textureView: textureArrayView,
                size: 0
            }
        ]
    });















    const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        }),
        sampleCount: 1,
        vertexStage: {
            module: vertexShaderModule,
            entryPoint: "main"
        },
        fragmentStage: {
            module: fragmentShaderModule,
            entryPoint: "main"
        },
        primitiveTopology: "triangle-list",
        vertexState: {
            indexFormat: "uint32",
            vertexBuffers:
                [
                    {
                        arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
                        stepMode: "vertex",
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: 0 * Float32Array.BYTES_PER_ELEMENT,
                                format: "float2"
                            }
                        ]
                    },
                    {
                        arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
                        stepMode: "vertex",
                        attributes: [
                            {
                                shaderLocation: 1,
                                offset: 0 * Float32Array.BYTES_PER_ELEMENT,
                                format: "float2"
                            }
                        ]
                    },
                ]
        },
        rasterizationState: {
            frontFace: "CCW",
            cullMode: "none"
        },
        colorStates: [{
            format: swapChainFormat,
            alphaBlend: {},
            colorBlend: {}
        }]
    });












    function onFrame() {
        if (!window.shouldClose()) setTimeout(onFrame, 1e3 / 60);

        const backBufferView = swapChain.getCurrentTextureView();
        const commandEncoder = device.createCommandEncoder({});
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                clearColor: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: "clear",
                storeOp: "store",
                attachment: backBufferView
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setVertexBuffer(0, stagedVertexBuffer, 0);
        renderPass.setVertexBuffer(1, stagedUVBuffer, 0);
        renderPass.setIndexBuffer(stagedIndexBuffer);
        renderPass.drawIndexed(triangleIndices.length, 1, 0, 0, 0);
        renderPass.endPass();

        const commandBuffer = commandEncoder.finish();
        queue.submit([commandBuffer]);
        swapChain.present();
        window.pollEvents();
    };
    setTimeout(onFrame, 1e3 / 60);

})();
