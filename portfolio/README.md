# Sehyun Av Kim

## Technical Artist & Prototyper

Hi, I'm Sehyun Kim (also known as ‘av’ or ‘avseoul’). I am a computer graphics artist from Seoul, Korea.

I love things that are raw, bold, and rough but that are not indigested or distracted. I also love things that are sophisticated, elaborated, and refined but that are not boring or indistinctive.

I design and implement **realtime visual effects**, **animations**, and **interactions** for **AR/VR/MR/Web** experience on various platforms that range from **Microsoft Hololens**, **Oculus Quest**, **iOS**, **Android**, to **Web browsers** with **Unity**, **Threejs (WebGL)**, and **RealityKit**.

In my free time, I enjoy creating realtime WebGL sketches as hobby projects and also as technical explorations.

Currently, I'm a technical artist at Marcom, Creative Tech at Apple.

[Resume](https://docs.google.com/document/d/1U_0qwoadvwsV9x-FkS7Bj1ODvtJ5vnsinRwrHzDMlVI/edit?usp=sharing)
[LinkedIn](https://www.linkedin.com/in/avseoul/)
[Personal Works](https://www.instagram.com/avseoul/)

---

## Works at Apple

**Technical Artist** @Marcom, Creative Tech from *2022 Jan* to *present*  

- Prototyping AR experience for retail store experience with RealityKit and Unity3D
- Look development

**Contracted Creative Technologist** @Marcom, Creative Tech from *2021 Jun* to *2022 Jan*  

- Responsible for WebGL and localization parts for Airpods Max retail store experience

---

## Works at Spatial

**Creative Technologist** @[Spatial](https://spatial.io/) from *2018* to *2021 Jun*

- Responsible for designing and implementing **realtime visual effects**, **animations**, and **interactions** for **AR/VR/MR/Web** experience on various platforms that range from **Microsoft Hololens**, **Oculus Quest**, **iOS**, **Android**, to **Web browsers** with **Unity**, **Threejs (WebGL)**.

Spatial is a start up and it was even smaller when I was in. So the usual working process involves from brainstorming to production stages.

It starts from a simple need/idea/direction. I start with it and come up with some variations of quick working prototype. Sometimes, I use sketches or pre-rendered animations, but most of time, the working prototype works the most efficiently with less chance of miscommunications, especially for immersive experience, which is hard to demonstrate the idea in 2D. From there, I work closely with designers to refine how it works and how it looks and with engineers to integrate prototypes into framework.

Followings are some of features that I designed and developed:

### 3D Object Transition Effects

![](./assets/Spatial-02.990317fc-7328.gif) ![](./assets/Spatial-04.133fcba2-7330.gif)

#### What

A transition effects for 3d objects res-in/out.

- Batched triangles(particles) are generated based on the given target object's triangles
- Compute shader pass to compute transform for triangles
- Vertex shader pass to apply the computed transform data per triangle
- Fragment shader pass to apply lighting
    - Vertex attributes (normal, uv) and material parameters of the original object are encoded into the triangle data, to be used to match the lighting between the triangulated particles and the original object

Implemented with Unity3D, runs on Quest 1, 2, iOS/Android devices.

![](./assets/Spatial-03.01cf68f2-7329.gif ':size=200')

#### Design iteration

![](./assets/Spatial-08.d1aab532-7360.gif ':size=600') ![](./assets/Spatial-09.74d1a3b1-7359.gif ':size=600') ![](./assets/Spatial-07.17f2d62b-7361.gif ':size=600') ![](./assets/Spatial-11.4f52bdda-7357.gif ':size=600')

---

### Clapping & Fistbump Effects

![](./assets/Spatial-01.0456b652-7403.gif ':size=600')  

#### What

It is a playful experience that is only possible in virtual immersive space. But not only that, it also helps to make stronger connection between physical world and virtual world. By you perform a very familiar human interaction as you do in real life with virtual avatars (it work both ways), which gives you sensory feedback.

Implemented with Unity3D, runs on Hololens 2, Quest 1, 2, iOS/Android devices.

![](./assets/Spatial-15.f7ddae07-7402.gif ':size=600')

---

### 3D Scribble

![](./assets/Spatial-24.69e195e4-7415.gif ':size=600')  

#### What

A 3D scribbling in immersive environment.

Implemented with Unity3D, runs on Hololens 1, 2, Quest 1, 2.

![](./assets/Spatial-25.bdc31f62-7416.gif ':size=600')  

---

### Selfie Stick

![](./assets/Spatial-13.fffa6e84-7444.gif ':size=600') ![](./assets/Spatial-14.97faf0b5-7443.gif ':size=600')

#### What

I prototyped this in a Spatial internal hackathon and it has been accepted as a main feature. It is a screen capture module in a selfie stick form, providing a playful experience yet serving the purpose.

Implemented with Unity3D, runs on Quest 1, 2.

---

### Avatar Loading View

![](./assets/Spatial-00.131f74c6-7315.gif)  

#### What

A view for avatar loading state. It is implemented with Threejs so it renders realtime in order to seamlessly transition into the generated/loaded avatar.

Implemented with Threejs, runs on desktop/mobile web browsers.

![](./assets/ezgif.com-gif-maker.gif ':size=600')

#### Design iterations

*Design passes with prerendered animations)*  
![](./assets/06.05.2019-avatar_loading_type_comparision.gif) ![](./assets/06.05.2019-generic_loading_type_comparision.gif)

---

### Configurable Button & Tangible Touch Interaction

![](./assets/Spatial-27.ad53dc27-7464.gif)

#### What

Prototyping configurable button module with tangible interactions.

Implemented with Unity3D, runs on Hololens 1, 2, Quest 1, 2.

![](./assets/Spatial-28.c310e5f7-7465.gif ':size=600') ![](./assets/image3.gif ':size=600')  

---

### Gaze Hint

#### What

Prototyping visual guidance to help you notice events that happen outside of your view in immersive space.

![](./assets/gaze-hint-type-a.gif) ![](./assets/gaze-hint-type-b.gif)

---

### Object Highlighter

#### What

Prototyping visual guidance to help you understand what you are interacting with.

![](./assets/3d_object_contour_highlighter.gif)
![](./assets/plane_highlighter.gif ':size=414')

---

### 3D Elastic Tooltip

#### What

Prototyping tooltip in 3D space, with elastic behavior

![](./assets/elastic-tooltip.gif)

---

### Work Board

#### What

Prototyping various designs and behavious for work boards where you pin items

**Transitions**

![](./assets/workboard-gridtype-transition.gif)
![](./assets/workboard-solidtype-transition.gif ':size=450')

**Back drop effects**

![](./assets/workboard-solidtype-backdrop-effect.gif)  

**Event feedback**

![](./assets/workboard-gridtype-interaction-effect.gif)

---

### Space Portal Effects

![](./assets/ezgif.com-gif-maker-7.gif) ![](./assets/ezgif.com-gif-maker-5.gif)

### What

Prototyping a space portal that shows another space that is captured as a cubemap and map to a backface rendered sphere to create 3D portal type of parallax.

---

### Runtime Lightmap Transition

![](./assets/ezgif.com-gif-maker-6.gif)

#### What

Prototyping a simple lightmap transition system to render different time of a day in VR

---

## Technical Exploration

### Custom Spring Physics & Confetti Particle System

![](./assets/ezgif.com-gif-maker-10.gif) ![](./assets/ezgif.com-gif-maker-9.gif)

#### What

- Spring physics for sling shot to trigger confetti like particles
- Implemented with Unity3D, runs on Oculus Rift

---

### Fluid Simulation

![](./assets/thumb_47-1949.gif ':size=326') ![](./assets/cinder-fluid-sim-test--wip-1942.gif) ![](./assets/cinder-fluid-sim-test--wip(1)-1945.gif)  

#### What

- Implemented with Cinder with Nvidia Flex for fluid simulation

---

### Ray Marching & Metaball

![](./assets/ezgif.com-gif-maker-16.gif)

#### What

- Implemented based on Inigo Quilez’s metaball (<https://www.shadertoy.com/view/ld2GRz>)
- Extra small particles are actual geometries, they are composed in a composition shader pass with ray marched metaball pass with manual depth testing
- Implemented with Unity3D

---

### Sphere Collision Detection & Screen Space Reflection

![](./assets/23-Feb-2018-Test---Compute-Shader-&-Instancing-in-Touch-Designer-5891.gif)
![](./assets/24-25-Feb-2018-Test---Compute-Shader-&-Instancing-&-SSR-in-Touch-Designer-5889.gif ':size=450')

#### What

- A technical exploration in sphere collision test with compute shader and screen space reflection
- Implemented with Unity3D

---

### Procedural Normal and PBR textures & Subsurface Scattering

![](./assets/257837783_430141128671717_5514147033628404774_n-10039.gif)
![](./assets/258786282_903283267059254_4408524444550198624_n-10040.gif ':size=480')

#### What

- A technical exploration in lookdev with procedurally generated textures for PBR lighting and subsurface scattering
- Implemented with Threejs

![](./assets/28_mar_2018_test_-_audio_reactive_shader_in_unity3d-(360p).gif)

---

## Personal Works (WebGL Sketches)

**Below demos are developed and tested with Chrome, trying it with Chrome is recommended*

### WALK

![](./assets/Screen-Recording-2022-07-13-at-11.57.gif)
[WALK - working in progress (currently only available on Chrome)](https://avseoul.net/walk/)

---

### GLITCH SKULL

![](./assets/GLITCH-SKULL---webgl-realtime-audio-reactive-sketch-2009.gif)
[GLITCH SKULL](https://avseoul.net/GLITCH_SKULL/)

---

### Particle Equalizer

![](./assets/webgl_-_particle_equalizer_revision_final-(1080p).gif)
[Particle Equalizer - working in progress](https://avseoul.net/particleEqualizer/)

---

### FUZZY BLOB

![](./assets/FUZZY-BLOB---webgl-realtime-audio-reactive-sketch-2004.gif)
[FUZZY BLOB](https://avseoul.net/FUZZY_BLOB/)

---

### BAD SIGNALS

![](./assets/BAD-SIGNALS---webgl-audio-reactive-glitch-2008.gif)
[BAD SIGNALS](https://avseoul.net/BAD_SIGNALS/)

---

### Untitled

![](./assets/1_mar_2019_-_untitled_-_wip-(720p).gif)
Demo not available at the moment

---
