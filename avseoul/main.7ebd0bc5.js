// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"json/content.json":[function(require,module,exports) {
module.exports = {
  "projects": [{
    "thumbnail_src": "thumb_53.gif",
    "id": "053",
    "title": "Glitch In Boredom - Slingshot",
    "description": "Unity3D, Oculus Rift - Glitch In Boredom is a self development project to explore possible interactions and visual effects in VR",
    "date": "Mar,2018 - WIP",
    "info": [{
      "is": "text",
      "p": "WIP - Glitch In Boredom is a self development project to explore possible interactions and visual effects in VR"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/273627317",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "text",
      "p": "Lessons : Using spring force is not very optimal way in polishing interactions but fun / VR looks better in VR / I don't shake hands"
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/272689178",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "https://github.com/avseoul/Unity3d_GlitchInBoredom_Slingshot",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_52.gif",
    "id": "052",
    "title": "Audio Reactive Shader",
    "description": "Unity3D - a realtime audio reactive liquidy surface shader in unity3d",
    "date": "Mar,2018 - WIP",
    "info": [{
      "is": "",
      "url": "",
      "dummy": "",
      "size": {
        "w": "",
        "h": ""
      }
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/272286618",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/272134669",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "https://github.com/avseoul/Unity3D_LiquidySurfaceShader",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_51.gif",
    "id": "051",
    "title": "Raymarching Metaball",
    "description": "Unity3D / a realtime audio reactive metaball effects in unity3d",
    "date": "Apr,2018 - WIP",
    "info": [{
      "is": "text",
      "p": "Playing with <a href=\"https://www.shadertoy.com/view/ld2GRz\" target=\"_blank\">Inigo Quilez's shadertoy sketch \"raymarching metaball\"</a> in Unity3D. Blob's positions are driven by compute shader"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/271868942",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/271592846",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/271033206",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/270928052",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/270820953",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/270239022",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/270020106",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/264375572",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "https://github.com/avseoul/Unity3D_RayMarching_MetaBall",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_50.gif",
    "id": "050",
    "title": "Realtime Rendering Study",
    "description": "TouchDesigner / SSR and couple screen space post processing technique",
    "date": "Mar,2018",
    "info": [{
      "is": "text",
      "p": "Realtime Rendering Study - SSR and couple screen space post processing technique in TouchDesigner"
    }],
    "process": [{
      "is": "",
      "url": "",
      "dummy": "",
      "size": {
        "w": "",
        "h": ""
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "https://github.com/avseoul/TD_SSR",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/260673087",
      "size": {
        "w": "640",
        "h": "360"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_49.gif",
    "id": "049",
    "title": "Against The Grain",
    "description": "TouchDesigner / a realtime audio reactive visual for an electronic sound \"Against The Grain\" composed by NIM",
    "date": "Feb,2018",
    "info": [{
      "is": "text",
      "p": "a realtime audio reactive visual developed in Touch Designer"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/259600884",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/258566257",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/256517363",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/256365677",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/261670096",
      "size": {
        "w": "640",
        "h": "360"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_48.jpg",
    "id": "048",
    "title": "WIP - an experiment with Compute Shader, Instancing, and Realtime Rendering in Touch Designer",
    "description": "TouchDesigner",
    "date": "Feb,2018 - present",
    "info": [{
      "is": "text",
      "p": "Experiment with Compute Shader, Instancing, and Realtime Rendering in Touch Designer"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/257443370",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/257219654",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/257074693",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/255847086",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "https://github.com/avseoul/TD_simple_collision_test_with_compute_shader",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_47.gif",
    "id": "047",
    "title": "WIP - Fluid Sim Experiment",
    "description": "Cinder, NVIDIA FLEX / an audio reactive particle system",
    "date": "Jan,2018 - present",
    "info": [{
      "is": "text",
      "p": "experiment with NVIDIA FLEX in Cinder"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/249225659",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/249049149",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/248954771",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/248830570",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/248647852",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_45.jpg",
    "id": "045",
    "title": "Experiment with Single Line Drawing & Optical Flow Feedback & Pixel Displacement",
    "description": "Cinder, Glsl",
    "date": "Oct,2017",
    "info": [{
      "is": "text",
      "p": ""
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/238017289",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/237855230",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "image",
      "url": "slitscan_16.jpg"
    }, {
      "is": "image",
      "url": "slitscan_14.jpg"
    }, {
      "is": "image",
      "url": "slitscan_13.jpg"
    }, {
      "is": "image",
      "url": "slitscan_12.jpg"
    }, {
      "is": "text",
      "p": ""
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "slitscan_15.jpg",
    "id": "046",
    "title": "Slit-Scan Experiment",
    "description": "Cinder, Glsl <br><br><i> *the thumbnail from a collaboration with <a href=\"http://coleorloff.com/\" target=\"_blank\">Cole Orloff</a></i><br><i> *the original photography of thumbnail courtesy of <a href=\"http://coleorloff.com/\" target=\"_blank\">Cole Orloff</a></i><br><br>",
    "date": "Sep,2017",
    "info": [{
      "is": "text",
      "p": "an experiments with Slit-Scan technique"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/236703159",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "500"
      }
    }, {
      "is": "text",
      "p": "a collaborattion with <a href=\"http://coleorloff.com/\" target=\"_blank\">Cole Orloff</a>"
    }, {
      "is": "text",
      "p": "the original photography courtesy of <a href=\"http://coleorloff.com/\" target=\"_blank\">Cole Orloff</a>"
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/234599615",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "500"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/234132677",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "500"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/234105653",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "500"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/233771474",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "500"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/233592174",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "460"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/233402546",
      "dummy": "",
      "size": {
        "w": "920",
        "h": "917"
      }
    }, {
      "is": "image",
      "url": "slitscan_15.jpg"
    }, {
      "is": "image",
      "url": "slitscan_01.jpg"
    }, {
      "is": "image",
      "url": "slitscan_02.jpg"
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "",
      "url": "",
      "size": {
        "w": "",
        "h": ""
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thumb_36.jpg",
    "id": "036",
    "title": "Experiment with Optical Flow Feedback",
    "description": "Cinder, Glsl",
    "date": "Jun,2017",
    "info": [{
      "is": "text",
      "p": "a series of glsl sketches with optical flow feedback"
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/221208487",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/222143862",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/222047127",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/221520130",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/220750624",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/220581592",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/220169573",
      "dummy": "",
      "size": {
        "w": "640",
        "h": "320"
      }
    }, {
      "is": "text",
      "p": ""
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/220418304",
      "size": {
        "w": "640",
        "h": "360"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "fakelovernd01.png",
    "id": "044",
    "title": "[Works@FakeLove] AR Prototype for an Office Demo",
    "description": "Unity3D, HLSL / an interactive AR particle system",
    "date": "May,2017",
    "info": [{
      "is": "text",
      "p": "n interactive AR particle system for an office demo at fakelove"
    }],
    "process": [{
      "is": "text",
      "p": ""
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project (Design/Development)"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/215245440",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "kiacadenza.jpg",
    "id": "043",
    "title": "[Works@FakeLove] Kia Cadenza AR Live Event",
    "description": "Unity3D, ShaderLab, HLSL / a onsite AR installation for KIA CADENZA @<a href=\"http://fakelove.tv/\" target=\"_blank\">Fake Love</a>",
    "date": "Feb,2017",
    "info": [{
      "is": "text",
      "p": "I was one and only developer for this project. I developed and polished entire app, specifically I designed and developed,<br>- <a href=\"https://medium.com/@avseoul/unity3d-sprite-animation-with-uv-coordinate-with-one-baked-sprite-texture-5ec0dad38cf5#.r4w39n8v4\" target=\"_blank\">custom sprite sequence animation</a> module based on UV coordinates, <br>- custom slideshow animation module based on UV coordinates, <br>- custom special animations trigger module in realtime AR experience, <br>- <a href=\"https://medium.com/@avseoul/unity3d-how-to-create-fake-volumetric-light-using-shader-and-geometry-cf3885991720#.lz4cncadz\" target=\"_blank\">custom volumetric light rendering</a> module in mobile devices by using fresnel shading and Alpha blending"
    }, {
      "is": "text",
      "p": "---"
    }, {
      "is": "text",
      "p": "*Image&video courtesy of <a href=\"http://fakelove.tv/\" target=\"_blank\">Fake Love</a>"
    }, {
      "is": "image",
      "url": "kiacadenza.jpg"
    }],
    "process": [],
    "credit": [{
      "role": "Brand",
      "credit": "Kia"
    }, {
      "role": "Agency",
      "credit": "T Brand Studio"
    }, {
      "role": "Experience",
      "credit": "FAKE LOVE"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/207647857",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "hiddenfigures.jpg",
    "id": "042",
    "title": "[Works@FakeLove] Outthink Hidden",
    "description": "Unity3D, an AR mobile app to create extension to the movie \"<a href=\"http://www.ibm.com/thought-leadership/hidden-figures/\" target=\"_blank\">Hidden Figures</a>\" @<a href=\"http://fakelove.tv/\" target=\"_blank\">Fake Love</a>",
    "date": "Jan,2017",
    "info": [{
      "is": "text",
      "p": "I was one of main developers among only 2 devs, I designed and developed,<br>- UV based custom image viewer(light box) and thumbnail carousel module, <br>- custom video player module, <br>- custom native photo sharing module for iOS/android in Unity3D, <br>- custom audio player module with equalizer running on GPU, <br>- building UI structure logic and animating UI, <br>- realtime dynamic 3D AR model loading pipeline, <br>- realtime texture loading pipeline,<br>- realtime rotation module for 3D AR models with gyro sensor, <br>- touch based navigation module(pan, zoom, rotate) for 3D AR models"
    }, {
      "is": "text",
      "p": "---"
    }, {
      "is": "text",
      "p": "*Image&video courtesy of Fake Love"
    }, {
      "is": "text",
      "p": "Check out the offical documentation on <a href=\"http://fakelove.tv/work/outthink-hidden\" target=\"_blank\">Fake Love's website</a>"
    }, {
      "is": "image",
      "url": "hiddenfigures.jpg"
    }],
    "process": [],
    "credit": [{
      "role": "Brand",
      "credit": "IBM"
    }, {
      "role": "Agency",
      "credit": "OGILVY & MATHER"
    }, {
      "role": "Experience",
      "credit": "FAKE LOVE"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/201342638",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "MUFE_screen5.jpg",
    "id": "033",
    "title": "[Works@EdgeDNA] MAKE UP FOR EVER",
    "description": "Javascript&Node.js / a Machine Learning Style Transfer Mobile Web-app @<a href=\"https://edgedna.co/\" target=\"_blank\">EdgeDNA</a>",
    "date": "Aug,2016",
    "info": [{
      "is": "text",
      "p": "\"MAKE UP FOR EVER\" is a mobile web-app that user upload their selfie to the node server and server execute a machine learning style transfer python script made by <a href=\"http://genekogan.com/\" target=\"_blank\">Gene Kogan</a> to stylize uploaded selfie."
    }, {
      "is": "text",
      "p": "I worked with Nikolaj Petersen who is in-house product manager. I architected most of core functionalities and structures on server side and also client side. I mainly dedigned and developed,"
    }, {
      "is": "text",
      "p": "- a comunication module between server and client upload&download for multimedia"
    }, {
      "is": "text",
      "p": "- a FIFO workers class for workers which execute python scripts on server to stylize uploaded selfie and send it back to client in order to prepare bottle neck when a large number of users try the app simultaneously"
    }, {
      "is": "text",
      "p": "- a structure of UI and functionalities of UI such uploading selfie process, take a selfie - choose the filters color - chose the filters style - upload - loading - download - share "
    }, {
      "is": "text",
      "p": "---"
    }, {
      "is": "text",
      "p": "*Image&video courtesy of <a href=\"https://edgedna.co/\" target=\"_blank\">EdgeDNA</a>"
    }, {
      "is": "text",
      "p": "Check out the offical documentation on <a href=\"https://edgedna.co/work/makeupforever/\" target=\"_blank\">EdgeDNA's website</a>"
    }],
    "process": [{
      "is": "image",
      "url": "MUFE_screen1.png"
    }, {
      "is": "image",
      "url": "MUFE_screen2.png"
    }, {
      "is": "image",
      "url": "MUFE_screen3.png"
    }, {
      "is": "image",
      "url": "MUFE_screen4.png"
    }],
    "credit": [{
      "role": "Brand",
      "credit": "Make Up For Ever"
    }, {
      "role": "Agency",
      "credit": "EdgeDNA"
    }, {
      "role": "Development",
      "credit": "av & Nikolaj"
    }],
    "github": "",
    "content": {
      "is": "image",
      "url": "MUFE_screen5.jpg",
      "size": {
        "w": "920",
        "h": "auto"
      }
    },
    "category": "selected_works, creative_coding, show_all"
  }, {
    "thumbnail_src": "thesis_thumb.jpg",
    "id": "037",
    "title": "FRAGMENT AND ENTITY",
    "description": "Unity3d, C#, HLSL, Oculus DK2, Leap Motion, Ableton Live",
    "date": "May,2016",
    "info": [{
      "is": "text",
      "p": "<i>\"Fragment and Entity\"</i> is an experimental VR experience which takes the users on visual and auditory journey"
    }, {
      "is": "text",
      "p": "Designed and implemented this appication for Oculus Rift in Unity 3D"
    }],
    "process": [{
      "is": "text",
      "p": ""
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/165077031?autoplay=0?color=ffffff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, show_all, creative_coding"
  }, {
    "thumbnail_src": "bigscreen_thumb.jpg",
    "id": "034",
    "title": "'untitled' an audiovisual poem",
    "description": "Cinema4d, After Effects/Big Screens @ITP",
    "date": "Dec,2015",
    "info": [{
      "is": "text",
      "p": "untitled is an audiovisual poem by Av (Sehyun Kim) and Nick Bratton created specifically for the IAC Building’s 120’ HD video wall and surrounding space. the text, sound, and visuals aim to reconsider the idea of space in our hyperconnected world. in particular, the piece was made from an interest in exploring the way in which flat screens become psychological portals to different times and places and how the fractures and superpositions of sonic and visual stimuli in digital and physical spaces can modify our feelings of togetherness."
    }, {
      "is": "text",
      "p": "This piece was featured in ‘BIG SCREENS 2015 on december 4, 2015’ hosted by ITP (Interactive Telecommunication Program) at the IAC building."
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/147669029?autoplay=0?color=ffffff",
      "dummy": "/bigscreen_content_01_dummy.jpg",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Created by",
      "credit": "Sehyun Kim(av) and <a href='https://nickbratton.com' target='_blank'>Nick Bratton</a>"
    }, {
      "role": "Poem by",
      "credit": "Nick Bratton"
    }, {
      "role": "Visuals by",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Sounds by",
      "credit": "Nick Bratton"
    }, {
      "role": "Mastered by",
      "credit": "Cliff Goodloe"
    }, {
      "role": "Voice by",
      "credit": "Brett Stiller"
    }, {
      "role": "Filmed by",
      "credit": "Shaun Axani, Shir David, Juan Jose Egusquiza, Francesca Rodriguez Sawaya"
    }, {
      "role": "Special Thanks to",
      "credit": "Mimi Yin, Dan O’Sullivan, Rob Ryan, Joseph Mango, Seth Kranzler, T.K Broderick, David Cihelna, Nikolaj Slot Petersen, Boram Kim, Alon Chitayat, Rosalie Yu, MOQN, Namira Abdulgani, Big Screens 2015, IAC, and ITP"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/148184905?autoplay=0?color=ffffff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, motion_graphic, show_all"
  }, {
    "thumbnail_src": "NOC_W05_thumb.jpg",
    "id": "030",
    "title": "Strange Attractor",
    "description": "CINDER/Creative Coding/Nature of Code @ITP",
    "date": "May,2015",
    "info": [{
      "is": "text",
      "p": ""
    }],
    "process": [{
      "is": "video",
      "url": "https://player.vimeo.com/video/123569268?autoplay=0?color=ffffff",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/123573939?autoplay=0?color=ffffff",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/121578736?autoplay=0?color=ffffff",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/121617425?autoplay=0?color=ffffff",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "text",
      "p": ""
    }],
    "credit": [{
      "role": "Created by",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Sound Designed by",
      "credit": "<a href=\"https://davidcihelna.com\" target=\"_blank\">David Cihelna</a>"
    }],
    "github": "https://github.com/avseoul/avseoul.github.io/tree/master/2015.Apr_StrangeAttractor",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/128038154?autoplay=0?color=ffffff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "creative_coding, selected_works, show_all"
  }, {
    "thumbnail_src": "nonagon.jpg",
    "id": "021",
    "title": "Experiment Video for NONAGON with Parris goebel",
    "description": "Experimental Film/1m20s/Directing&Producing",
    "date": "Apr,2014",
    "info": [{
      "is": "text",
      "p": "NONAGON is a fashion brand which made by YG Entertainment and Samsung. They needed a promotion video for their brand launching. They did not want to make it seemed like typical commercial film but more like experimental fashion film. They also want to collaborate with Parris Goebel who choreographed for TaeYang's, one of the YG artists, performance."
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/92112938?autoplay=0?color=ffffff",
      "size": {
        "w": "720",
        "h": "405"
      }
    }],
    "process": [{
      "is": "text",
      "p": "This project is comprised of 2 piecies of videos. Because the client want to announce their launching by 2 times. Both videos shows 9 performers because their brand name NONAGON represent the number '9'. And the other huge meaning of this brand, which my client wanted to put this meaning into this video, is that 'SAMSUNG' and 'YG' are met and they collaborate to make this brand. So I imagined these two groups as two ancient tribes, and they met and unite together in the other video, the symbol of their unity is geometric shape of nonagon. And these united 9 dancers performed again in the other video, they perform modern street dance and they wear NONAGON's apparels. The first video represent the birth of the brand by meeting of two giant company, and the second video represent characteristic of the brand."
    }, {
      "is": "text",
      "p": "I wanted to put some special pattern on performer's body to make it seemed more experiment. I worked with amazing artist Giseok Cho, who made bodypaint for my other project 'Unpredictable'. For the first video, the two tribes have different ancient symbol and pattern on their body. One is representing 'Technology(Samsung)' by using straight line and the other is 'Music(YG)' by using curve line. For the second video, using Roman numerals '9' on performer's face for making them look like modern but maintaining the meaning of Nonagon."
    }],
    "credit": [{
      "role": "Client",
      "credit": "NONAGON"
    }, {
      "role": "Executive Producer",
      "credit": "YG"
    }, {
      "role": "Production",
      "credit": "Mixture Creative"
    }, {
      "role": "Director",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Edittor",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Post Production Designer",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "D.O.P",
      "credit": "Myungje Kim"
    }, {
      "role": "Choreographer",
      "credit": "Parris Goebel"
    }, {
      "role": "Performers",
      "credit": "Request Dance Crew"
    }, {
      "role": "Body Painting Artist",
      "credit": "Giseok Cho"
    }, {
      "role": "Sound Producer",
      "credit": "Choice37"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/103201075?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "video_works, selected_works, show_all"
  }, {
    "thumbnail_src": "unpredictable.jpg",
    "id": "020",
    "title": "Unpredictable",
    "description": "Experimental Film/2m40s/Directing&Producing",
    "date": "Apr,2013",
    "info": [{
      "is": "text",
      "p": "The film, ‘Unpredictable’, demonstrates the movement of a dancer visualizing smoke and variations of a piece of fabric. Among many physical phenomena, some movements are unpredictable or inconsistent; particularly the motion of particles in liquids and gases that always move randomly at any place. The unpredictable movement of smoke, which is infinitesimally small and subtle motion generated by air flow, allured me more than any other physical phenomena of the earth and motivated me to illustrate it at a new aspect. In this film, the piece of fabric represents smoke, and the dancer represents air. I tried to visualize rising smoke gradually taking shape and transforming into a different shape. The variations in choreography, the video editing skills, and visual consonance between the dancer (air) and the piece of fabric (smoke) were used to portray the four steps: Mergence, Assimilation, and Climax, and Vanishing."
    }, {
      "is": "text",
      "p": "The film was displayed in Tastemakers Promotion coordinated by BAT Korea, nominated as representative visual artist."
    }],
    "process": [{
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Client",
      "credit": "BAT(British American Tobacco)"
    }, {
      "role": "Production",
      "credit": "Visualozik"
    }, {
      "role": "Director",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Edittor",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Post Production Designer",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "D.O.P",
      "credit": "Jaehyung Choi(Bird Creative)"
    }, {
      "role": "Choreographer",
      "credit": "Byung cheol Jin"
    }, {
      "role": "Performers",
      "credit": "Byung cheol Jin"
    }, {
      "role": "Body Painting Artist",
      "credit": "Giseok Cho"
    }, {
      "role": "Sound Producer",
      "credit": "OVRTHS"
    }, {
      "role": "Sound Engineer",
      "credit": "MOODSCHULA"
    }, {
      "role": "1st Assistant Camera",
      "credit": "Hyung Yeon Kim"
    }, {
      "role": "2nd Assistant Camera",
      "credit": "Eun Yi rang"
    }, {
      "role": "Hair&Makeup",
      "credit": "Seul Gi Park"
    }, {
      "role": "Costume Designer",
      "credit": "Hey Jin Jeon"
    }, {
      "role": "Assistant Director",
      "credit": "Dong Ju Jang, Seung Rim Yoon"
    }, {
      "role": "Camera",
      "credit": "DIGITAL FACTORY, MOVIE PARKING"
    }, {
      "role": "Location",
      "credit": "STUDIO35"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/63771896?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "video_works, selected_works, show_all"
  }, {
    "thumbnail_src": "wooven.jpg",
    "id": "019",
    "title": "'ART OF WOVEN' VISUALOZIK X GOLDSTEP COLLABORATION FOR NIKE",
    "description": "Projection Mapping/0m53s/Projection on Painting/Directing&Producing",
    "date": "May,2013",
    "info": [{
      "is": "text",
      "p": "to be updated"
    }],
    "process": [{
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Client",
      "credit": "Nike Korea"
    }, {
      "role": "Production",
      "credit": "Post Visual"
    }, {
      "role": "Live Painting",
      "credit": "Goldstep"
    }, {
      "role": "Director and Projection Mapping Design",
      "credit": "Sehyun Kim(av)"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/99465683?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, 3d_mapping, show_all"
  }, {
    "thumbnail_src": "optpym3.jpg",
    "id": "018",
    "title": "Optical Pyramid 003 - China international Gallery Exposition 2012",
    "description": "Projection Mapping/5m15s/Projection on Painting/Directing&Producing",
    "date": "Apr,2012",
    "info": [{
      "is": "text",
      "p": "to be updated"
    }],
    "process": [{
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Role",
      "credit": "Personal Project"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/40884323?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "3d_mapping, show_all, selected_works"
  }, {
    "thumbnail_src": "8sec1.jpg",
    "id": "016",
    "title": "8SECONDS X EUDON CHOI (2012 SFDF WINNER OF THIS YEAR) COLLABORATION FASHION FILM",
    "description": "Fashion Film/1m24s/Directing&Producing",
    "date": "Dec,2012",
    "info": [{
      "is": "text",
      "p": "to be updated"
    }],
    "process": [{
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Client",
      "credit": "8seconds"
    }, {
      "role": "Agency",
      "credit": "Swpy"
    }, {
      "role": "Production",
      "credit": "Bird Creative"
    }, {
      "role": "Director",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Editting",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "Post Production Design",
      "credit": "Sehyun Kim(av)"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/56623218?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "video_works, selected_works, show_all"
  }, {
    "thumbnail_src": "visexp.jpg",
    "id": "014",
    "title": "Visualozik Experiment 3D Projection Mapping + X",
    "description": "Projection Mapping/Reel/3m52s/Directing&Producing",
    "date": "Apr,2011",
    "info": [{
      "is": "text",
      "p": "“Visualozik” is the name of a visual experimental group that Joi and I formed. Collaborating with Joi, a creative visual artist himself and more importantly one of my best friends, I inspired this visual project. This show reel is a combination of our works, demonstrates our 2-year brainstorming, experiment and history of exploring about Projection Mapping application, and ultimately our own vision as young visual artists in this era."
    }, {
      "is": "text",
      "p": "-"
    }, {
      "is": "text",
      "p": "00:24-00:54 Visualozik 1st Experiment"
    }, {
      "is": "text",
      "p": "00:54-01:21 Optical Pyramid 001"
    }, {
      "is": "text",
      "p": "01:21-01:52 Media Facade in Group Exhibition ’10 years after’"
    }, {
      "is": "text",
      "p": "01:52-02:14 Projection Mapping Artwork in Media Performance ‘J-th Time’"
    }, {
      "is": "text",
      "p": "02:14-02:35 UJN&NOVA ‘ELECTRON ENERGY’ M/V"
    }, {
      "is": "text",
      "p": "02:35-02:54 Total Experience"
    }, {
      "is": "text",
      "p": "02:54-03:25 Art Collaboration"
    }, {
      "is": "text",
      "p": "03:25-03:52 SKIT"
    }],
    "process": [{
      "is": "text",
      "p": "to be updated"
    }],
    "credit": [{
      "role": "Project&Documentation",
      "credit": "Sehyun Kim(av)"
    }, {
      "role": "",
      "credit": "-"
    }, {
      "role": "",
      "credit": "EXCEPT"
    }, {
      "role": "",
      "credit": "BGM(Boys Noize – Lava Lava)"
    }, {
      "role": "",
      "credit": "-"
    }, {
      "role": "",
      "credit": "01:52-02:13 Media Performance J-th Time"
    }, {
      "role": "",
      "credit": "/ Participated in part of art-director in Chapter3"
    }, {
      "role": "",
      "credit": "02:35-02:53 Total Experience"
    }, {
      "role": "",
      "credit": "/ Participated in producer"
    }, {
      "role": "",
      "credit": "(Directed by Joi&Live Painted by Goldstep)"
    }, {
      "role": "",
      "credit": "02:54-03:24 Illustration by Komba"
    }],
    "github": "",
    "content": {
      "is": "video",
      "url": "https://player.vimeo.com/video/13197903?autoplay=0&color=fff",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "3d_mapping, show_all, selected_works"
  }]
};
},{}],"js/utils.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.setMobileCSS = function () {
  console.log("avseoul->setting mobile_css");
  var work = document.getElementById("works_title");
  work.style.width = "100vw";
  var containers = document.getElementsByClassName("ui_container");

  var _iterator = _createForOfIteratorHelper(containers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var container = _step.value;
      container.style["position"] = "auto";
      container.style["height"] = "auto";
      container.style["margin-top"] = "30px";
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var uiThumbMasks = document.getElementsByClassName("ui_thumbnail_mask");

  var _iterator2 = _createForOfIteratorHelper(uiThumbMasks),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var mask = _step2.value;
      mask.style["position"] = "relative";
      mask.style["left"] = " ";
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var uiThumbs = document.getElementsByClassName("ui_thumbnail");

  var _iterator3 = _createForOfIteratorHelper(uiThumbs),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var thumb = _step3.value;
      thumb.style["width"] = "100vw";
      thumb.style["height"] = "auto";
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var uiDescriptionMasks = document.getElementsByClassName("ui_description_mask");

  var _iterator4 = _createForOfIteratorHelper(uiDescriptionMasks),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _mask = _step4.value;
      _mask.style['position'] = "relative";
      _mask.style['left'] = "0px";
      _mask.style['width'] = "100vw";
      _mask.style['height'] = "auto";
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
};

var isMobile = false;

exports.isMobile = function () {
  if (!isMobile) (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
  })(navigator.userAgent || navigator.vendor);
  return isMobile;
};

exports.insertNext = function (targetNode, referenceNode) {
  var _a;

  (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(targetNode, referenceNode.nextSibling);
};

exports.setLocation = function (id) {
  window.location.hash = id;
};

exports.getImageAssetURL = function (imageAssets, imageSrc) {
  var imageAssetsKey = imageSrc.split(".")[0];
  return Object.entries(imageAssets[imageAssetsKey])[0][1];
};

exports.getRandomColorCSS = function () {
  return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
};
},{}],"js/const.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTET_JAR = [{
  title: "gltich in boredom - slingshot",
  link: "",
  url: 273627317
}, {
  title: "audio reactive shader1",
  link: "",
  url: 272286618
}, {
  title: "audio reactive shader",
  link: "",
  url: 272134669
}, {
  title: "raymarch metaball unity3d 6",
  link: "",
  url: 271868942
}, {
  title: "raymarch metaball unity3d 6",
  link: "",
  url: 271592846
}, {
  title: "raymarch metaball unity3d 6",
  link: "",
  url: 271033206
}, {
  title: "raymarch metaball unity3d 5",
  link: "",
  url: 270928052
}, {
  title: "raymarch metaball unity3d 4",
  link: "",
  url: 270820953
}, {
  title: "raymarch metaball unity3d 3",
  link: "",
  url: 270239022
}, {
  title: "raymarch metaball unity3d 2",
  link: "",
  url: 270020106
}, {
  title: "raymarch metaball unity3d",
  link: "",
  url: 264375572
}, {
  title: "SSR test",
  link: "",
  url: 260673087
}, {
  title: "grain",
  link: "",
  url: 261670096
}, {
  title: "TD computeshader, ssr test",
  link: "",
  url: 257443370
}, {
  title: "glitch skull",
  link: "",
  url: 255753094
}, {
  title: "glitch skull webgl",
  link: "",
  url: 253358854
}, {
  title: "fuzzy blob",
  link: "",
  url: 252959874
}, {
  title: "bad signal",
  link: "",
  url: 252008506
}, {
  title: "particle eq",
  link: "",
  url: 251247372
}, {
  title: "fluid sim",
  link: "",
  url: 249225659
}, {
  title: "fluid sim another",
  link: "",
  url: 248954771
}, {
  title: "only thing yo ucan see i th dark",
  link: "",
  url: 240762034
}, {
  title: "cinder single spiral with optical flow feedback a",
  link: "",
  url: 238017289
}, {
  title: "cinder single spiral with optical flow feedback b",
  link: "",
  url: 237855230
}, {
  title: "slit scan caesar",
  link: "",
  url: 236703159
}, {
  title: "slit scan rectangle",
  link: "",
  url: 234132677
}, {
  title: "slit scan space man",
  link: "",
  url: 233771474
}, {
  title: "dirty line cam",
  link: "",
  url: 222886692
}, {
  title: "mr mcdonald",
  link: "",
  url: 221956220
}, {
  title: "pine apple",
  link: "",
  url: 221839224
}, {
  title: "skull",
  link: "",
  url: 221520130
}, {
  title: "line",
  link: "",
  url: 221208487
}, {
  title: "optical flow particle system",
  link: "",
  url: 220418304
}, {
  title: "avssketches 10",
  link: "",
  url: 220085257
}, {
  title: "kim kardashian",
  link: "",
  url: 219217460
}, {
  title: "avssketchs 003",
  link: "",
  url: 219175646
}, {
  title: "ar experiment",
  link: "",
  url: 215245440
}, {
  title: "fragment and entity",
  link: "",
  url: 165077031
}, {
  title: "untitled",
  link: "",
  url: 148184905
}, {
  title: "strange attracter",
  link: "",
  url: 128038154
}, {
  title: "nonagon",
  link: "",
  url: 103201075
}, {
  title: "unpredictable",
  link: "",
  url: 63771896
}, {
  title: "8 seconds",
  link: "",
  url: 56623218
}, {
  title: "optical flow 3",
  link: "",
  url: 40884323
}, {
  title: "visualozik exp",
  link: "",
  url: 13197903
}];
exports.CONTENT_TYPE = {
  TEXT: 0,
  IMAGE: 1,
  VIDEO: 2,
  REALTIME: 3
};
},{}],"../../../../assets/img/*.*":[function(require,module,exports) {
module.exports = {};
},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"js/main.ts":[function(require,module,exports) {
var process = require("process");
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var content_json_1 = __importDefault(require("/json/content.json"));

var utils_1 = require("/js/utils");

var const_1 = require("/js/const");

var ___1 = __importDefault(require("/assets/img/*.*"));

var setRandomScreeningContent = function setRandomScreeningContent() {
  var seed = Math.floor(Math.random() * const_1.CONTET_JAR.length);
  var m = const_1.CONTET_JAR[seed];
  var targetDiv = document.getElementById("random_selected_works");
  var w = parseFloat(getComputedStyle(targetDiv.parentNode, null).getPropertyValue('width'));
  var h = w * .6666;
  targetDiv.style['width'] = w + 'px';
  targetDiv.style['height'] = h + 'px';
  targetDiv.style['background'] = '#000';
  targetDiv.innerHTML = '<iframe id="mIframe_content" src=\"https://player.vimeo.com/video/' + m.url + '\" width=\"' + w + '\" height=\"' + h + '\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
};

var locateToHash = function locateToHash() {
  var _a, _b;

  var hash = location.hash;
  hash = hash.split('#')[1];
  var i = (_b = (_a = document.getElementById(hash)) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.firstElementChild;
  i === null || i === void 0 ? void 0 : i.click();
};

var linksAlive = function linksAlive() {
  var links = [].slice.call(document.querySelectorAll("a"));

  var _iterator = _createForOfIteratorHelper(links),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var link = _step.value;

      if (link.className != "is_fucked") {
        link.style["color"] = utils_1.getRandomColorCSS();
        link.style.backgroundColor = utils_1.getRandomColorCSS();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

var renderRainbow = function renderRainbow() {
  var paragraphs = [].slice.call(document.querySelectorAll("p"));
  var titles = [].slice.call(document.querySelectorAll("av_title"));
  var links = [].slice.call(document.querySelectorAll("a"));

  var _iterator2 = _createForOfIteratorHelper(paragraphs),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var p = _step2.value;
      p.style.backgroundColor = utils_1.getRandomColorCSS();
      var words = p.textContent.split(" ");
      p.textContent = '';

      var _iterator5 = _createForOfIteratorHelper(words),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var w = _step5.value;
          var tag = document.createElement("rainbow");
          tag.style.color = utils_1.getRandomColorCSS();
          tag.style.backgroundColor = utils_1.getRandomColorCSS();
          tag.textContent = w + ' ';
          p.appendChild(tag);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var _iterator3 = _createForOfIteratorHelper(titles),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var t = _step3.value;

      var _words = t.textContent.split(" ");

      t.textContent = '';

      var _iterator6 = _createForOfIteratorHelper(_words),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _w = _step6.value;

          var _tag = document.createElement("rainbow");

          _tag.style.color = utils_1.getRandomColorCSS();
          _tag.style.backgroundColor = utils_1.getRandomColorCSS();
          _tag.textContent = _w + ' ';
          t.appendChild(_tag);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  var _iterator4 = _createForOfIteratorHelper(links),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var l = _step4.value;
      l.className = "is_fucked";
      l.style.backgroundColor = utils_1.getRandomColorCSS();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
};

var expandContent = function expandContent(index) {
  var contentContainerClassName = utils_1.isMobile() ? "content_container_mobile" : "content_container"; // Reset the dom

  var containers = document.getElementsByClassName(contentContainerClassName);

  var _iterator7 = _createForOfIteratorHelper(containers),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var container = _step7.value;
      container.parentNode.removeChild(container);
    } // Set locatioin

  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  utils_1.setLocation(content_json_1.default.projects[index].id); // Construct doms 

  var project = content_json_1.default.projects[index];
  var targetDom = document.getElementById(project.id);
  var contentContainer = document.createElement('div');
  contentContainer.className = contentContainerClassName; // Append to target

  utils_1.insertNext(contentContainer, targetDom); // Contruct content doms

  var content = null;
  var targetDomWidth = parseFloat(getComputedStyle(targetDom, null).getPropertyValue('width'));
  var targetDomHeight = targetDomWidth * project.content.size.h / project.content.size.w;

  switch (project.content.is) {
    case 'video':
      content = buildContentNode(targetDomWidth, targetDomHeight, project.content.url, const_1.CONTENT_TYPE.VIDEO);
      break;

    case 'image':
      content = buildContentNode(targetDomWidth, targetDomHeight, project.content.url, const_1.CONTENT_TYPE.IMAGE);
      break;

    case 'realtime':
      content = buildContentNode(targetDomWidth, targetDomHeight, project.content.url, const_1.CONTENT_TYPE.REALTIME);
      break;

    default:
      break;
  }

  if (content !== null) contentContainer.appendChild(content); // Content info

  var contentTitle;

  for (var i = 0; i < 3; i++) {
    // Title
    switch (i) {
      case 0:
        contentTitle = '> Info';
        break;

      case 1:
        contentTitle = '> Process';
        break;

      case 2:
        contentTitle = '> Credit';
        break;

      default:
        break;
    }

    var title = document.createElement('div');
    title.className = "content_title";
    title.innerHTML = contentTitle;
    contentContainer.appendChild(title); // Description

    var description = document.createElement('div');
    var infoDescription = null;
    var processDescription = null;

    switch (i) {
      case 0:
        var _iterator8 = _createForOfIteratorHelper(project.info),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var info = _step8.value;

            switch (info.is) {
              case 'video':
                var height = targetDomWidth * info.size.h / info.size.w;
                infoDescription = buildDescriptionNode(targetDomWidth, height, info, const_1.CONTENT_TYPE.VIDEO);
                break;

              case 'image':
                infoDescription = buildDescriptionNode(targetDomWidth, 0, info, const_1.CONTENT_TYPE.IMAGE);
                break;

              case 'text':
                infoDescription = buildDescriptionNode(targetDomWidth, 0, info, const_1.CONTENT_TYPE.TEXT);
                break;

              default:
                break;
            }

            if (infoDescription !== null) description.appendChild(infoDescription);
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        break;

      case 1:
        var _iterator9 = _createForOfIteratorHelper(project.process),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var process = _step9.value;

            switch (process.is) {
              case 'video':
                var _height = targetDomWidth * process.size.h / process.size.w;

                processDescription = buildDescriptionNode(targetDomWidth, _height, process, const_1.CONTENT_TYPE.VIDEO);
                break;

              case 'image':
                processDescription = buildDescriptionNode(targetDomWidth, 0, process, const_1.CONTENT_TYPE.IMAGE);
                break;

              case 'text':
                processDescription = buildDescriptionNode(targetDomWidth, 0, process, const_1.CONTENT_TYPE.TEXT);
                break;

              default:
                break;
            }

            if (processDescription !== null) description.appendChild(processDescription);
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }

        break;

      case 2:
        var _iterator10 = _createForOfIteratorHelper(project.credit),
            _step10;

        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var credit = _step10.value;
            var creditNode = buildCreditNode(credit);
            if (creditNode !== null) description.appendChild(creditNode);
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }

        break;

      default:
        break;
    }

    if (description !== null) contentContainer.appendChild(description);
  } // Github info


  if (project.github !== '') {
    var githubInfo = buildGithubInfoNode(project.github);
    contentContainer.appendChild(githubInfo.title);
    contentContainer.appendChild(githubInfo.body);
  }
};

var buildGithubInfoNode = function buildGithubInfoNode(info) {
  var title = document.createElement('div');
  title.className = 'content_title';
  title.innerHTML = '> Source';
  var body = document.createElement('div');
  body.innerHTML = '<p><a href=' + info + ' target=\'_blank\'>github</a></p>';
  return {
    title: title,
    body: body
  };
};

var buildCreditNode = function buildCreditNode(info) {
  var paragraph = document.createElement('p');
  paragraph.innerHTML = '<credit>' + info.role + '</credit>: ' + info.credit;
  return paragraph;
};

var buildDescriptionNode = function buildDescriptionNode(width, height, info, contentType) {
  var domElement = null;

  switch (contentType) {
    case const_1.CONTENT_TYPE.VIDEO:
      domElement = document.createElement('div');
      domElement.style['width'] = width + 'px';
      domElement.style['height'] = height + 'px';
      domElement.style['background'] = '#000';
      domElement.innerHTML = '<iframe id="mIframe_content" src=\"' + info.url + '\" width=\"' + width + '\" height=\"' + height + '\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      break;

    case const_1.CONTENT_TYPE.IMAGE:
      domElement = document.createElement('img');
      domElement.src = utils_1.getImageAssetURL(___1.default, info.url);
      domElement.width = width;
      break;

    case const_1.CONTENT_TYPE.TEXT:
      domElement = document.createElement('p');
      domElement.innerHTML = info.p;
      break;

    default:
      break;
  }

  return domElement;
};

var buildContentNode = function buildContentNode(width, height, url, contentType) {
  var content = document.createElement('div');
  content.id = '_content';

  if (contentType === const_1.CONTENT_TYPE.IMAGE) {
    // Image content
    content.innerHTML = '<img src=\"avseoul/assets/' + utils_1.getImageAssetURL(___1.default, url) + '\" width=\"' + width + '\" height=\"' + height + '\">';
  } else {
    // Video and realtime content
    content.style.cursor = 'pointer';
    content.style.width = width.toString() + 'px';
    content.style.height = height.toString() + 'px';
    content.style.background = '#000';
    window.setTimeout(function () {
      content.style.opacity = '1';
      content.innerHTML = '<iframe src=\"' + url + '\" width=\"' + width + '\" height=\"' + height + '\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    }, 500);
  }

  return content;
};

var buildContentContainerNode = function buildContentContainerNode(contentData, nodeIndex) {
  var container = document.createElement('div');
  var thumbnailMask = document.createElement('div');
  var thumbnail = new Image();
  var descriptionMask = document.createElement('div');
  var subject = document.createElement('div');
  var description = document.createElement('div');
  var date = document.createElement('div');
  var detail = document.createElement('rainbow_p'); // Node tree

  container.appendChild(thumbnailMask);
  container.appendChild(descriptionMask);
  thumbnailMask.appendChild(thumbnail);
  descriptionMask.appendChild(subject);
  descriptionMask.appendChild(description);
  descriptionMask.appendChild(date);
  descriptionMask.appendChild(detail); // Nodes attributes

  container.className = 'ui_container';
  container.id = contentData.id;
  thumbnailMask.className = 'ui_thumbnail_mask';
  thumbnail.className = 'ui_thumbnail';
  thumbnail.onclick = expandContent.bind(this, nodeIndex);
  thumbnail.src = utils_1.getImageAssetURL(___1.default, contentData.thumbnail_src);
  descriptionMask.className = 'ui_description_mask';
  subject.className = 'ui_subject';
  subject.onclick = expandContent.bind(this, nodeIndex);
  subject.style.cursor = 'pointer';
  subject.innerHTML = '<av_title>' + contentData.title + '</av_title>';
  description.className = 'ui_description';
  description.innerHTML = '<p>' + contentData.description + '</p>';
  date.className = 'ui_date';
  date.innerHTML = '<p>' + contentData.date + '</p>';
  detail.className = 'ui_detail';
  detail.onclick = expandContent.bind(this, nodeIndex);
  detail.innerHTML = '<a>details</a>';
  return container;
};

var init = function init() {
  setRandomScreeningContent();
  var container = document.getElementById('container');

  for (var i = 0; i < content_json_1.default['projects'].length; i++) {
    var s = content_json_1.default['projects'][i];
    var scriptNode = buildContentContainerNode(s, i);
    container === null || container === void 0 ? void 0 : container.append(scriptNode);
  } // Assign onclick events


  var rainbowNode = document.getElementById('rainbow');
  rainbowNode.onclick = renderRainbow.bind(this);
  var linksAliveNode = document.getElementById('linksAlive');
  linksAliveNode.onclick = linksAlive.bind(this);
  if (utils_1.isMobile()) utils_1.setMobileCSS();
};

document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('hashchange', locateToHash);
},{"/json/content.json":"json/content.json","/js/utils":"js/utils.ts","/js/const":"js/const.ts","/assets/img/*.*":"../../../../assets/img/*.*","process":"../node_modules/process/browser.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52662" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.ts"], null)
//# sourceMappingURL=/main.7ebd0bc5.js.map