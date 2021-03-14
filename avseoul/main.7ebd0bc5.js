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
      "is": "video",
      "url": "https://player.vimeo.com/video/273627317",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/272286618",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/271868942",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_studies, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/257443370",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/249225659",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/238017289",
      "size": {
        "w": "640",
        "h": "320"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
      "is": "video",
      "url": "https://player.vimeo.com/video/236703159",
      "size": {
        "w": "920",
        "h": "500"
      }
    },
    "category": "case_study, creative_coding, show_all"
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
    "category": "case_study, creative_coding, show_all"
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
    "category": "case_study, creative_coding, show_all"
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
      "url": "https://player.vimeo.com/video/165077031",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "selected_works, show_all, creative_coding"
  }, {
    "thumbnail_src": "bigscreen_thumb.jpg",
    "id": "034",
    "title": "'Untitled' an audiovisual poem",
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
      "url": "https://player.vimeo.com/video/147669029",
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
      "url": "https://player.vimeo.com/video/148184905",
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
      "url": "https://player.vimeo.com/video/123569268",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/123573939",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/121578736",
      "size": {
        "w": "720",
        "h": "405"
      }
    }, {
      "is": "video",
      "url": "https://player.vimeo.com/video/121617425",
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
      "url": "https://player.vimeo.com/video/128038154",
      "size": {
        "w": "920",
        "h": "518"
      }
    },
    "category": "case_study, selected_works, show_all"
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
      "url": "https://player.vimeo.com/video/92112938",
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
      "url": "https://player.vimeo.com/video/103201075",
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
      "url": "https://player.vimeo.com/video/63771896",
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
      "url": "https://player.vimeo.com/video/99465683",
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
      "url": "https://player.vimeo.com/video/40884323",
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
      "url": "https://player.vimeo.com/video/56623218",
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
      "url": "https://player.vimeo.com/video/13197903",
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

exports.insertNext = function (targetNode, referenceNode) {
  var _a;

  (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(targetNode, referenceNode.nextSibling);
};

exports.getImageAssetURL = function (imageAssets, imageSrc) {
  var imageAssetsKey = imageSrc.split(".")[0];
  return Object.entries(imageAssets[imageAssetsKey])[0][1];
};

exports.getRandomColorCSS = function () {
  return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
};

exports.shuffleRandomScreeningContent = function () {
  var seed = Math.floor(Math.random() * exports.CONTET_JAR.length);
  var m = exports.CONTET_JAR[seed];
  var targetDiv = document.getElementById("random_selected_works");
  var w = parseFloat(getComputedStyle(targetDiv.parentNode, null).getPropertyValue('width'));
  var h = w * .6666;
  targetDiv.style['width'] = w + 'px';
  targetDiv.style['height'] = h + 'px';
  targetDiv.style['background'] = '#000';
  targetDiv.innerHTML = '<iframe src=\"https://player.vimeo.com/video/' + m.url + '\" width=\"' + w + '\" height=\"' + h + '\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
};

exports.linksAlive = function () {
  var links = [].slice.call(document.querySelectorAll("a"));

  var _iterator = _createForOfIteratorHelper(links),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var link = _step.value;

      if (link.className != "is_fucked") {
        link.style["color"] = exports.getRandomColorCSS();
        link.style.backgroundColor = exports.getRandomColorCSS();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

exports.renderRainbow = function () {
  var paragraphs = [].slice.call(document.querySelectorAll("p"));
  var titles = [].slice.call(document.querySelectorAll("av_title"));
  var links = [].slice.call(document.querySelectorAll("a"));

  var _iterator2 = _createForOfIteratorHelper(paragraphs),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var p = _step2.value;
      p.style.backgroundColor = exports.getRandomColorCSS();
      var words = p.textContent.split(" ");
      p.textContent = '';

      var _iterator5 = _createForOfIteratorHelper(words),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var w = _step5.value;
          var tag = document.createElement("rainbow");
          tag.style.color = exports.getRandomColorCSS();
          tag.style.backgroundColor = exports.getRandomColorCSS();
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

          _tag.style.color = exports.getRandomColorCSS();
          _tag.style.backgroundColor = exports.getRandomColorCSS();
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
      l.style.backgroundColor = exports.getRandomColorCSS();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
};

exports.buildVimeoEmbedCode = function (url, showInfo) {
  var n = showInfo ? 1 : 0;
  return "\n\t\t<div style=\"height: 100%;position:relative;\">\n\t\t\t<iframe src=\"".concat(url, "?color=ffffff&title=").concat(n, "&byline=").concat(n, "&portrait=").concat(n, "&controls=").concat(n, "\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" frameborder=\"0\" allow=\"autoplay\" allowfullscreen></iframe>\n\t\t</div>\n\t\t<script src=\"https://player.vimeo.com/api/player.js\"></script>\n\t");
};
},{}],"assets/img/10years.jpg":[function(require,module,exports) {
module.exports = "/10years.8af2ff4e.jpg";
},{}],"assets/img/2-agrippa.jpg":[function(require,module,exports) {
module.exports = "/2-agrippa.d0e15463.jpg";
},{}],"assets/img/3-answer.jpg":[function(require,module,exports) {
module.exports = "/3-answer.706045e0.jpg";
},{}],"assets/img/360stadium.jpg":[function(require,module,exports) {
module.exports = "/360stadium.7e42e4c2.jpg";
},{}],"assets/img/5-tea.jpg":[function(require,module,exports) {
module.exports = "/5-tea.5bfffa98.jpg";
},{}],"assets/img/8sec1.jpg":[function(require,module,exports) {
module.exports = "/8sec1.fef64fd2.jpg";
},{}],"assets/img/DTS_W01.jpg":[function(require,module,exports) {
module.exports = "/DTS_W01.8658b95f.jpg";
},{}],"assets/img/8sec2.jpg":[function(require,module,exports) {
module.exports = "/8sec2.ef126d0d.jpg";
},{}],"assets/img/ICM01.jpg":[function(require,module,exports) {
module.exports = "/ICM01.e74b0948.jpg";
},{}],"assets/img/MUFE_screen1.png":[function(require,module,exports) {
module.exports = "/MUFE_screen1.189afb9f.png";
},{}],"assets/img/MUFE_screen2.png":[function(require,module,exports) {
module.exports = "/MUFE_screen2.2ac983af.png";
},{}],"assets/img/MUFE_screen4.png":[function(require,module,exports) {
module.exports = "/MUFE_screen4.c8e30979.png";
},{}],"assets/img/MUFE_screen3.png":[function(require,module,exports) {
module.exports = "/MUFE_screen3.5287578c.png";
},{}],"assets/img/MUFE_screen5.jpg":[function(require,module,exports) {
module.exports = "/MUFE_screen5.60e0cc41.jpg";
},{}],"assets/img/NM02.jpg":[function(require,module,exports) {
module.exports = "/NM02.42ec3e7a.jpg";
},{}],"assets/img/NM01.jpg":[function(require,module,exports) {
module.exports = "/NM01.292dc989.jpg";
},{}],"assets/img/NOC_W05_01.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_01.7f6172d0.jpg";
},{}],"assets/img/NOC_W05_02.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_02.0f7bd28f.jpg";
},{}],"assets/img/NOC_W05_03.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_03.2ad2eb4d.jpg";
},{}],"assets/img/NOC_W05_04.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_04.61ef4c92.jpg";
},{}],"assets/img/NOC_W05_05.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_05.b7de7344.jpg";
},{}],"assets/img/NOC_W05_06.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_06.d5ee7504.jpg";
},{}],"assets/img/NOC_W05_07.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_07.bccbec35.jpg";
},{}],"assets/img/NOC_W05_08.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_08.52663260.jpg";
},{}],"assets/img/NOC_W05_09.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_09.7b59a009.jpg";
},{}],"assets/img/NOC_W05_10.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_10.8cee04ce.jpg";
},{}],"assets/img/NOC_W05_11.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_11.a7039c10.jpg";
},{}],"assets/img/NOC_W05_12.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_12.6536aa1b.jpg";
},{}],"assets/img/NOC_W05_13.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_13.42ab5fb0.jpg";
},{}],"assets/img/NOC_W05_14.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_14.04092639.jpg";
},{}],"assets/img/NOC_W05_15.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_15.15555209.jpg";
},{}],"assets/img/NOC_W05_16.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_16.b06b7cec.jpg";
},{}],"assets/img/NOC_W05_17.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_17.4bc811cb.jpg";
},{}],"assets/img/RG_main.png":[function(require,module,exports) {
module.exports = "/RG_main.fe5b3a72.png";
},{}],"assets/img/RG_rasterize.png":[function(require,module,exports) {
module.exports = "/RG_rasterize.01c0923c.png";
},{}],"assets/img/NOC_W05_thumb.jpg":[function(require,module,exports) {
module.exports = "/NOC_W05_thumb.d9984e5d.jpg";
},{}],"assets/img/Screen-Shot-2012-07-04-at-5.37.24-PM.jpg":[function(require,module,exports) {
module.exports = "/Screen-Shot-2012-07-04-at-5.37.24-PM.9a547d53.jpg";
},{}],"assets/img/[DTS]_W01_process.png":[function(require,module,exports) {
module.exports = {};
},{}],"assets/img/asdf.jpg":[function(require,module,exports) {
module.exports = "/asdf.b34e70b7.jpg";
},{}],"assets/img/artcol.jpg":[function(require,module,exports) {
module.exports = "/artcol.84432dc6.jpg";
},{}],"assets/img/bemyluv.jpg":[function(require,module,exports) {
module.exports = "/bemyluv.9187897c.jpg";
},{}],"assets/img/bg_pattern_01.jpg":[function(require,module,exports) {
module.exports = "/bg_pattern_01.6fcf146f.jpg";
},{}],"assets/img/bg_pattern_02.png":[function(require,module,exports) {
module.exports = "/bg_pattern_02.8ab4780c.png";
},{}],"assets/img/bigscreen_thumb.jpg":[function(require,module,exports) {
module.exports = "/bigscreen_thumb.e2addfd7.jpg";
},{}],"assets/img/buttonMirrorThumb.jpg":[function(require,module,exports) {
module.exports = "/buttonMirrorThumb.9075c567.jpg";
},{}],"assets/img/cityweather01.jpg":[function(require,module,exports) {
module.exports = "/cityweather01.87d7d14d.jpg";
},{}],"assets/img/cityweather02.jpg":[function(require,module,exports) {
module.exports = "/cityweather02.fcc69c05.jpg";
},{}],"assets/img/cityweather03.jpg":[function(require,module,exports) {
module.exports = "/cityweather03.0afbd51d.jpg";
},{}],"assets/img/cityweather04.jpg":[function(require,module,exports) {
module.exports = "/cityweather04.5c0cc5f3.jpg";
},{}],"assets/img/cityweatherThumb.jpg":[function(require,module,exports) {
module.exports = "/cityweatherThumb.b5ed08dd.jpg";
},{}],"assets/img/clip_content_01.png":[function(require,module,exports) {
module.exports = "/clip_content_01.99ecd0da.png";
},{}],"assets/img/contact.jpg":[function(require,module,exports) {
module.exports = "/contact.46c77f0a.jpg";
},{}],"assets/img/clip_thumb.jpg":[function(require,module,exports) {
module.exports = "/clip_thumb.2aa518c5.jpg";
},{}],"assets/img/crazyparticlesystem.jpg":[function(require,module,exports) {
module.exports = "/crazyparticlesystem.57a573ef.jpg";
},{}],"assets/img/diffuse.jpg":[function(require,module,exports) {
module.exports = "/diffuse.8d5ee2a4.jpg";
},{}],"assets/img/cosmosonic.jpg":[function(require,module,exports) {
module.exports = "/cosmosonic.e3186de5.jpg";
},{}],"assets/img/expressivetypography.jpg":[function(require,module,exports) {
module.exports = "/expressivetypography.5b766ea0.jpg";
},{}],"assets/img/drpepper.jpg":[function(require,module,exports) {
module.exports = "/drpepper.dac48e6c.jpg";
},{}],"assets/img/expressivetypography01.png":[function(require,module,exports) {
module.exports = "/expressivetypography01.6dc059b3.png";
},{}],"assets/img/expressivetypography02.png":[function(require,module,exports) {
module.exports = "/expressivetypography02.05963285.png";
},{}],"assets/img/expressivetypography03.png":[function(require,module,exports) {
module.exports = "/expressivetypography03.e2bb8394.png";
},{}],"assets/img/fakelovernd01.png":[function(require,module,exports) {
module.exports = "/fakelovernd01.494b6c4c.png";
},{}],"assets/img/fakelovernd02.jpg":[function(require,module,exports) {
module.exports = "/fakelovernd02.92653313.jpg";
},{}],"assets/img/fragthumbnail.jpg":[function(require,module,exports) {
module.exports = "/fragthumbnail.c5703f6e.jpg";
},{}],"assets/img/fuckdetector.jpg":[function(require,module,exports) {
module.exports = "/fuckdetector.b2024b8a.jpg";
},{}],"assets/img/g_cam_thumb.jpg":[function(require,module,exports) {
module.exports = "/g_cam_thumb.2c3b6650.jpg";
},{}],"assets/img/glitchnl.jpg":[function(require,module,exports) {
module.exports = "/glitchnl.9f6c013e.jpg";
},{}],"assets/img/hiddenfigures.jpg":[function(require,module,exports) {
module.exports = "/hiddenfigures.36c28af1.jpg";
},{}],"assets/img/hoam.jpg":[function(require,module,exports) {
module.exports = "/hoam.30455737.jpg";
},{}],"assets/img/itp-t-shirts-appl-2.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-2.0234ed6a.jpg";
},{}],"assets/img/itp-t-shirts-appl-3.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-3.8f74e884.jpg";
},{}],"assets/img/itp-t-shirts-appl-5.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-5.37fe39cf.jpg";
},{}],"assets/img/itp-t-shirts-appl-4.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-4.c91fc52b.jpg";
},{}],"assets/img/itp-t-shirts-appl-6.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-6.f7db556a.jpg";
},{}],"assets/img/itp-t-shirts-appl-7.jpg":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl-7.172d2450.jpg";
},{}],"assets/img/itp-t-shirts-appl.png":[function(require,module,exports) {
module.exports = "/itp-t-shirts-appl.2228479a.png";
},{}],"assets/img/itplogo.jpg":[function(require,module,exports) {
module.exports = "/itplogo.7907b520.jpg";
},{}],"assets/img/jthtime.jpg":[function(require,module,exports) {
module.exports = "/jthtime.8760d08d.jpg";
},{}],"assets/img/kiacadenza.jpg":[function(require,module,exports) {
module.exports = "/kiacadenza.7c9e3f49.jpg";
},{}],"assets/img/logo.png":[function(require,module,exports) {
module.exports = "/logo.fb412750.png";
},{}],"assets/img/logo_dot_w.png":[function(require,module,exports) {
module.exports = "/logo_dot_w.d055efcf.png";
},{}],"assets/img/noc_w04_thumb.jpg":[function(require,module,exports) {
module.exports = "/noc_w04_thumb.0b16ee06.jpg";
},{}],"assets/img/moreraytracing.jpg":[function(require,module,exports) {
module.exports = "/moreraytracing.8f080f55.jpg";
},{}],"assets/img/nonagon.jpg":[function(require,module,exports) {
module.exports = "/nonagon.59e780f8.jpg";
},{}],"assets/img/noise.jpg":[function(require,module,exports) {
module.exports = "/noise.d565e126.jpg";
},{}],"assets/img/ofs_mv.jpg":[function(require,module,exports) {
module.exports = "/ofs_mv.5ccb63cc.jpg";
},{}],"assets/img/op3.jpg":[function(require,module,exports) {
module.exports = "/op3.26cd8c40.jpg";
},{}],"assets/img/opticalpiramid.jpg":[function(require,module,exports) {
module.exports = "/opticalpiramid.744b36ea.jpg";
},{}],"assets/img/opticalpy2.jpg":[function(require,module,exports) {
module.exports = "/opticalpy2.e83bd740.jpg";
},{}],"assets/img/optpym3.jpg":[function(require,module,exports) {
module.exports = "/optpym3.eda5a2c8.jpg";
},{}],"assets/img/particleEQ_thumb.jpg":[function(require,module,exports) {
module.exports = "/particleEQ_thumb.25afce77.jpg";
},{}],"assets/img/profile.jpg":[function(require,module,exports) {
module.exports = "/profile.0ac66c1e.jpg";
},{}],"assets/img/quickavsketch01.png":[function(require,module,exports) {
module.exports = "/quickavsketch01.7a8671cc.png";
},{}],"assets/img/rg_thumbnail.jpg":[function(require,module,exports) {
module.exports = "/rg_thumbnail.951e8542.jpg";
},{}],"assets/img/rainytypewriter.jpg":[function(require,module,exports) {
module.exports = "/rainytypewriter.b3a01e1b.jpg";
},{}],"assets/img/slitscan.jpg":[function(require,module,exports) {
module.exports = "/slitscan.921cc49e.jpg";
},{}],"assets/img/slitscan_01.jpg":[function(require,module,exports) {
module.exports = "/slitscan_01.b0023709.jpg";
},{}],"assets/img/slitscan_02.jpg":[function(require,module,exports) {
module.exports = "/slitscan_02.06f991c9.jpg";
},{}],"assets/img/slitscan_03.jpg":[function(require,module,exports) {
module.exports = "/slitscan_03.a57604f1.jpg";
},{}],"assets/img/slitscan_04.jpg":[function(require,module,exports) {
module.exports = "/slitscan_04.091e1db7.jpg";
},{}],"assets/img/slitscan_05.jpg":[function(require,module,exports) {
module.exports = "/slitscan_05.35caaec4.jpg";
},{}],"assets/img/slitscan_06.jpg":[function(require,module,exports) {
module.exports = "/slitscan_06.c1b52822.jpg";
},{}],"assets/img/slitscan_07.png":[function(require,module,exports) {
module.exports = "/slitscan_07.70c753b9.png";
},{}],"assets/img/slitscan_08.jpg":[function(require,module,exports) {
module.exports = "/slitscan_08.ca4b3261.jpg";
},{}],"assets/img/slitscan_09.jpg":[function(require,module,exports) {
module.exports = "/slitscan_09.2c2315b8.jpg";
},{}],"assets/img/slitscan_10.jpg":[function(require,module,exports) {
module.exports = "/slitscan_10.150676a7.jpg";
},{}],"assets/img/slitscan_11.jpg":[function(require,module,exports) {
module.exports = "/slitscan_11.c750a815.jpg";
},{}],"assets/img/slitscan_12.jpg":[function(require,module,exports) {
module.exports = "/slitscan_12.41992476.jpg";
},{}],"assets/img/slitscan_13.jpg":[function(require,module,exports) {
module.exports = "/slitscan_13.630e4a80.jpg";
},{}],"assets/img/slitscan_14.jpg":[function(require,module,exports) {
module.exports = "/slitscan_14.6b0fefa3.jpg";
},{}],"assets/img/slitscan_15.jpg":[function(require,module,exports) {
module.exports = "/slitscan_15.ba0daa47.jpg";
},{}],"assets/img/slitscan_16.jpg":[function(require,module,exports) {
module.exports = "/slitscan_16.2f48330a.jpg";
},{}],"assets/img/slitscan_17.jpg":[function(require,module,exports) {
module.exports = "/slitscan_17.81e3f3d4.jpg";
},{}],"assets/img/thesis_thumb.jpg":[function(require,module,exports) {
module.exports = "/thesis_thumb.129f4ca1.jpg";
},{}],"assets/img/thumb_36.jpg":[function(require,module,exports) {
module.exports = "/thumb_36.a4ef69b4.jpg";
},{}],"assets/img/threejsstudy01.jpg":[function(require,module,exports) {
module.exports = "/threejsstudy01.1727c358.jpg";
},{}],"assets/img/thumb_47.gif":[function(require,module,exports) {
module.exports = "/thumb_47.36b6379a.gif";
},{}],"assets/img/thumb_45.jpg":[function(require,module,exports) {
module.exports = "/thumb_45.c9d189ad.jpg";
},{}],"assets/img/thumb_48.jpg":[function(require,module,exports) {
module.exports = "/thumb_48.1ea224b5.jpg";
},{}],"assets/img/thumb_49.gif":[function(require,module,exports) {
module.exports = "/thumb_49.2a9acc58.gif";
},{}],"assets/img/thumb_50.gif":[function(require,module,exports) {
module.exports = "/thumb_50.a919a93d.gif";
},{}],"assets/img/thumb_52.gif":[function(require,module,exports) {
module.exports = "/thumb_52.5e3f9ac7.gif";
},{}],"assets/img/thumb_51.gif":[function(require,module,exports) {
module.exports = "/thumb_51.e4112863.gif";
},{}],"assets/img/thumb_53.gif":[function(require,module,exports) {
module.exports = "/thumb_53.f91aa14d.gif";
},{}],"assets/img/toneandthree.jpg":[function(require,module,exports) {
module.exports = "/toneandthree.f94e1e28.jpg";
},{}],"assets/img/ujnnova.jpg":[function(require,module,exports) {
module.exports = "/ujnnova.ca74a571.jpg";
},{}],"assets/img/unpredictable.jpg":[function(require,module,exports) {
module.exports = "/unpredictable.f1b25abf.jpg";
},{}],"assets/img/upload1.jpg":[function(require,module,exports) {
module.exports = "/upload1.9a084043.jpg";
},{}],"assets/img/visexp.jpg":[function(require,module,exports) {
module.exports = "/visexp.642e46b0.jpg";
},{}],"assets/img/web_thumbnail.jpg":[function(require,module,exports) {
module.exports = "/web_thumbnail.41c80570.jpg";
},{}],"assets/img/webgl_bad.gif":[function(require,module,exports) {
module.exports = "/webgl_bad.8a242a7d.gif";
},{}],"assets/img/webgl_fuz.jpg":[function(require,module,exports) {
module.exports = "/webgl_fuz.623b7fe9.jpg";
},{}],"assets/img/webgl_par.jpg":[function(require,module,exports) {
module.exports = "/webgl_par.f199f185.jpg";
},{}],"assets/img/webgl_peq.jpg":[function(require,module,exports) {
module.exports = "/webgl_peq.5b7abcba.jpg";
},{}],"assets/img/webgl_sku.jpg":[function(require,module,exports) {
module.exports = "/webgl_sku.bfd6464b.jpg";
},{}],"assets/img/wooven.jpg":[function(require,module,exports) {
module.exports = "/wooven.e235df90.jpg";
},{}],"assets/img/*.*":[function(require,module,exports) {
module.exports = {
  "10years": {
    "jpg": require("./10years.jpg")
  },
  "2-agrippa": {
    "jpg": require("./2-agrippa.jpg")
  },
  "3-answer": {
    "jpg": require("./3-answer.jpg")
  },
  "360stadium": {
    "jpg": require("./360stadium.jpg")
  },
  "5-tea": {
    "jpg": require("./5-tea.jpg")
  },
  "8sec1": {
    "jpg": require("./8sec1.jpg")
  },
  "DTS_W01": {
    "jpg": require("./DTS_W01.jpg")
  },
  "8sec2": {
    "jpg": require("./8sec2.jpg")
  },
  "ICM01": {
    "jpg": require("./ICM01.jpg")
  },
  "MUFE_screen1": {
    "png": require("./MUFE_screen1.png")
  },
  "MUFE_screen2": {
    "png": require("./MUFE_screen2.png")
  },
  "MUFE_screen4": {
    "png": require("./MUFE_screen4.png")
  },
  "MUFE_screen3": {
    "png": require("./MUFE_screen3.png")
  },
  "MUFE_screen5": {
    "jpg": require("./MUFE_screen5.jpg")
  },
  "NM02": {
    "jpg": require("./NM02.jpg")
  },
  "NM01": {
    "jpg": require("./NM01.jpg")
  },
  "NOC_W05_01": {
    "jpg": require("./NOC_W05_01.jpg")
  },
  "NOC_W05_02": {
    "jpg": require("./NOC_W05_02.jpg")
  },
  "NOC_W05_03": {
    "jpg": require("./NOC_W05_03.jpg")
  },
  "NOC_W05_04": {
    "jpg": require("./NOC_W05_04.jpg")
  },
  "NOC_W05_05": {
    "jpg": require("./NOC_W05_05.jpg")
  },
  "NOC_W05_06": {
    "jpg": require("./NOC_W05_06.jpg")
  },
  "NOC_W05_07": {
    "jpg": require("./NOC_W05_07.jpg")
  },
  "NOC_W05_08": {
    "jpg": require("./NOC_W05_08.jpg")
  },
  "NOC_W05_09": {
    "jpg": require("./NOC_W05_09.jpg")
  },
  "NOC_W05_10": {
    "jpg": require("./NOC_W05_10.jpg")
  },
  "NOC_W05_11": {
    "jpg": require("./NOC_W05_11.jpg")
  },
  "NOC_W05_12": {
    "jpg": require("./NOC_W05_12.jpg")
  },
  "NOC_W05_13": {
    "jpg": require("./NOC_W05_13.jpg")
  },
  "NOC_W05_14": {
    "jpg": require("./NOC_W05_14.jpg")
  },
  "NOC_W05_15": {
    "jpg": require("./NOC_W05_15.jpg")
  },
  "NOC_W05_16": {
    "jpg": require("./NOC_W05_16.jpg")
  },
  "NOC_W05_17": {
    "jpg": require("./NOC_W05_17.jpg")
  },
  "RG_main": {
    "png": require("./RG_main.png")
  },
  "RG_rasterize": {
    "png": require("./RG_rasterize.png")
  },
  "NOC_W05_thumb": {
    "jpg": require("./NOC_W05_thumb.jpg")
  },
  "Screen-Shot-2012-07-04-at-5": {
    "37.24-PM.jpg": require("./Screen-Shot-2012-07-04-at-5.37.24-PM.jpg")
  },
  "[DTS]_W01_process": {
    "png": require("./[DTS]_W01_process.png")
  },
  "asdf": {
    "jpg": require("./asdf.jpg")
  },
  "artcol": {
    "jpg": require("./artcol.jpg")
  },
  "bemyluv": {
    "jpg": require("./bemyluv.jpg")
  },
  "bg_pattern_01": {
    "jpg": require("./bg_pattern_01.jpg")
  },
  "bg_pattern_02": {
    "png": require("./bg_pattern_02.png")
  },
  "bigscreen_thumb": {
    "jpg": require("./bigscreen_thumb.jpg")
  },
  "buttonMirrorThumb": {
    "jpg": require("./buttonMirrorThumb.jpg")
  },
  "cityweather01": {
    "jpg": require("./cityweather01.jpg")
  },
  "cityweather02": {
    "jpg": require("./cityweather02.jpg")
  },
  "cityweather03": {
    "jpg": require("./cityweather03.jpg")
  },
  "cityweather04": {
    "jpg": require("./cityweather04.jpg")
  },
  "cityweatherThumb": {
    "jpg": require("./cityweatherThumb.jpg")
  },
  "clip_content_01": {
    "png": require("./clip_content_01.png")
  },
  "contact": {
    "jpg": require("./contact.jpg")
  },
  "clip_thumb": {
    "jpg": require("./clip_thumb.jpg")
  },
  "crazyparticlesystem": {
    "jpg": require("./crazyparticlesystem.jpg")
  },
  "diffuse": {
    "jpg": require("./diffuse.jpg")
  },
  "cosmosonic": {
    "jpg": require("./cosmosonic.jpg")
  },
  "expressivetypography": {
    "jpg": require("./expressivetypography.jpg")
  },
  "drpepper": {
    "jpg": require("./drpepper.jpg")
  },
  "expressivetypography01": {
    "png": require("./expressivetypography01.png")
  },
  "expressivetypography02": {
    "png": require("./expressivetypography02.png")
  },
  "expressivetypography03": {
    "png": require("./expressivetypography03.png")
  },
  "fakelovernd01": {
    "png": require("./fakelovernd01.png")
  },
  "fakelovernd02": {
    "jpg": require("./fakelovernd02.jpg")
  },
  "fragthumbnail": {
    "jpg": require("./fragthumbnail.jpg")
  },
  "fuckdetector": {
    "jpg": require("./fuckdetector.jpg")
  },
  "g_cam_thumb": {
    "jpg": require("./g_cam_thumb.jpg")
  },
  "glitchnl": {
    "jpg": require("./glitchnl.jpg")
  },
  "hiddenfigures": {
    "jpg": require("./hiddenfigures.jpg")
  },
  "hoam": {
    "jpg": require("./hoam.jpg")
  },
  "itp-t-shirts-appl-2": {
    "jpg": require("./itp-t-shirts-appl-2.jpg")
  },
  "itp-t-shirts-appl-3": {
    "jpg": require("./itp-t-shirts-appl-3.jpg")
  },
  "itp-t-shirts-appl-5": {
    "jpg": require("./itp-t-shirts-appl-5.jpg")
  },
  "itp-t-shirts-appl-4": {
    "jpg": require("./itp-t-shirts-appl-4.jpg")
  },
  "itp-t-shirts-appl-6": {
    "jpg": require("./itp-t-shirts-appl-6.jpg")
  },
  "itp-t-shirts-appl-7": {
    "jpg": require("./itp-t-shirts-appl-7.jpg")
  },
  "itp-t-shirts-appl": {
    "png": require("./itp-t-shirts-appl.png")
  },
  "itplogo": {
    "jpg": require("./itplogo.jpg")
  },
  "jthtime": {
    "jpg": require("./jthtime.jpg")
  },
  "kiacadenza": {
    "jpg": require("./kiacadenza.jpg")
  },
  "logo": {
    "png": require("./logo.png")
  },
  "logo_dot_w": {
    "png": require("./logo_dot_w.png")
  },
  "noc_w04_thumb": {
    "jpg": require("./noc_w04_thumb.jpg")
  },
  "moreraytracing": {
    "jpg": require("./moreraytracing.jpg")
  },
  "nonagon": {
    "jpg": require("./nonagon.jpg")
  },
  "noise": {
    "jpg": require("./noise.jpg")
  },
  "ofs_mv": {
    "jpg": require("./ofs_mv.jpg")
  },
  "op3": {
    "jpg": require("./op3.jpg")
  },
  "opticalpiramid": {
    "jpg": require("./opticalpiramid.jpg")
  },
  "opticalpy2": {
    "jpg": require("./opticalpy2.jpg")
  },
  "optpym3": {
    "jpg": require("./optpym3.jpg")
  },
  "particleEQ_thumb": {
    "jpg": require("./particleEQ_thumb.jpg")
  },
  "profile": {
    "jpg": require("./profile.jpg")
  },
  "quickavsketch01": {
    "png": require("./quickavsketch01.png")
  },
  "rg_thumbnail": {
    "jpg": require("./rg_thumbnail.jpg")
  },
  "rainytypewriter": {
    "jpg": require("./rainytypewriter.jpg")
  },
  "slitscan": {
    "jpg": require("./slitscan.jpg")
  },
  "slitscan_01": {
    "jpg": require("./slitscan_01.jpg")
  },
  "slitscan_02": {
    "jpg": require("./slitscan_02.jpg")
  },
  "slitscan_03": {
    "jpg": require("./slitscan_03.jpg")
  },
  "slitscan_04": {
    "jpg": require("./slitscan_04.jpg")
  },
  "slitscan_05": {
    "jpg": require("./slitscan_05.jpg")
  },
  "slitscan_06": {
    "jpg": require("./slitscan_06.jpg")
  },
  "slitscan_07": {
    "png": require("./slitscan_07.png")
  },
  "slitscan_08": {
    "jpg": require("./slitscan_08.jpg")
  },
  "slitscan_09": {
    "jpg": require("./slitscan_09.jpg")
  },
  "slitscan_10": {
    "jpg": require("./slitscan_10.jpg")
  },
  "slitscan_11": {
    "jpg": require("./slitscan_11.jpg")
  },
  "slitscan_12": {
    "jpg": require("./slitscan_12.jpg")
  },
  "slitscan_13": {
    "jpg": require("./slitscan_13.jpg")
  },
  "slitscan_14": {
    "jpg": require("./slitscan_14.jpg")
  },
  "slitscan_15": {
    "jpg": require("./slitscan_15.jpg")
  },
  "slitscan_16": {
    "jpg": require("./slitscan_16.jpg")
  },
  "slitscan_17": {
    "jpg": require("./slitscan_17.jpg")
  },
  "thesis_thumb": {
    "jpg": require("./thesis_thumb.jpg")
  },
  "thumb_36": {
    "jpg": require("./thumb_36.jpg")
  },
  "threejsstudy01": {
    "jpg": require("./threejsstudy01.jpg")
  },
  "thumb_47": {
    "gif": require("./thumb_47.gif")
  },
  "thumb_45": {
    "jpg": require("./thumb_45.jpg")
  },
  "thumb_48": {
    "jpg": require("./thumb_48.jpg")
  },
  "thumb_49": {
    "gif": require("./thumb_49.gif")
  },
  "thumb_50": {
    "gif": require("./thumb_50.gif")
  },
  "thumb_52": {
    "gif": require("./thumb_52.gif")
  },
  "thumb_51": {
    "gif": require("./thumb_51.gif")
  },
  "thumb_53": {
    "gif": require("./thumb_53.gif")
  },
  "toneandthree": {
    "jpg": require("./toneandthree.jpg")
  },
  "ujnnova": {
    "jpg": require("./ujnnova.jpg")
  },
  "unpredictable": {
    "jpg": require("./unpredictable.jpg")
  },
  "upload1": {
    "jpg": require("./upload1.jpg")
  },
  "visexp": {
    "jpg": require("./visexp.jpg")
  },
  "web_thumbnail": {
    "jpg": require("./web_thumbnail.jpg")
  },
  "webgl_bad": {
    "gif": require("./webgl_bad.gif")
  },
  "webgl_fuz": {
    "jpg": require("./webgl_fuz.jpg")
  },
  "webgl_par": {
    "jpg": require("./webgl_par.jpg")
  },
  "webgl_peq": {
    "jpg": require("./webgl_peq.jpg")
  },
  "webgl_sku": {
    "jpg": require("./webgl_sku.jpg")
  },
  "wooven": {
    "jpg": require("./wooven.jpg")
  }
};
},{"./10years.jpg":"assets/img/10years.jpg","./2-agrippa.jpg":"assets/img/2-agrippa.jpg","./3-answer.jpg":"assets/img/3-answer.jpg","./360stadium.jpg":"assets/img/360stadium.jpg","./5-tea.jpg":"assets/img/5-tea.jpg","./8sec1.jpg":"assets/img/8sec1.jpg","./DTS_W01.jpg":"assets/img/DTS_W01.jpg","./8sec2.jpg":"assets/img/8sec2.jpg","./ICM01.jpg":"assets/img/ICM01.jpg","./MUFE_screen1.png":"assets/img/MUFE_screen1.png","./MUFE_screen2.png":"assets/img/MUFE_screen2.png","./MUFE_screen4.png":"assets/img/MUFE_screen4.png","./MUFE_screen3.png":"assets/img/MUFE_screen3.png","./MUFE_screen5.jpg":"assets/img/MUFE_screen5.jpg","./NM02.jpg":"assets/img/NM02.jpg","./NM01.jpg":"assets/img/NM01.jpg","./NOC_W05_01.jpg":"assets/img/NOC_W05_01.jpg","./NOC_W05_02.jpg":"assets/img/NOC_W05_02.jpg","./NOC_W05_03.jpg":"assets/img/NOC_W05_03.jpg","./NOC_W05_04.jpg":"assets/img/NOC_W05_04.jpg","./NOC_W05_05.jpg":"assets/img/NOC_W05_05.jpg","./NOC_W05_06.jpg":"assets/img/NOC_W05_06.jpg","./NOC_W05_07.jpg":"assets/img/NOC_W05_07.jpg","./NOC_W05_08.jpg":"assets/img/NOC_W05_08.jpg","./NOC_W05_09.jpg":"assets/img/NOC_W05_09.jpg","./NOC_W05_10.jpg":"assets/img/NOC_W05_10.jpg","./NOC_W05_11.jpg":"assets/img/NOC_W05_11.jpg","./NOC_W05_12.jpg":"assets/img/NOC_W05_12.jpg","./NOC_W05_13.jpg":"assets/img/NOC_W05_13.jpg","./NOC_W05_14.jpg":"assets/img/NOC_W05_14.jpg","./NOC_W05_15.jpg":"assets/img/NOC_W05_15.jpg","./NOC_W05_16.jpg":"assets/img/NOC_W05_16.jpg","./NOC_W05_17.jpg":"assets/img/NOC_W05_17.jpg","./RG_main.png":"assets/img/RG_main.png","./RG_rasterize.png":"assets/img/RG_rasterize.png","./NOC_W05_thumb.jpg":"assets/img/NOC_W05_thumb.jpg","./Screen-Shot-2012-07-04-at-5.37.24-PM.jpg":"assets/img/Screen-Shot-2012-07-04-at-5.37.24-PM.jpg","./[DTS]_W01_process.png":"assets/img/[DTS]_W01_process.png","./asdf.jpg":"assets/img/asdf.jpg","./artcol.jpg":"assets/img/artcol.jpg","./bemyluv.jpg":"assets/img/bemyluv.jpg","./bg_pattern_01.jpg":"assets/img/bg_pattern_01.jpg","./bg_pattern_02.png":"assets/img/bg_pattern_02.png","./bigscreen_thumb.jpg":"assets/img/bigscreen_thumb.jpg","./buttonMirrorThumb.jpg":"assets/img/buttonMirrorThumb.jpg","./cityweather01.jpg":"assets/img/cityweather01.jpg","./cityweather02.jpg":"assets/img/cityweather02.jpg","./cityweather03.jpg":"assets/img/cityweather03.jpg","./cityweather04.jpg":"assets/img/cityweather04.jpg","./cityweatherThumb.jpg":"assets/img/cityweatherThumb.jpg","./clip_content_01.png":"assets/img/clip_content_01.png","./contact.jpg":"assets/img/contact.jpg","./clip_thumb.jpg":"assets/img/clip_thumb.jpg","./crazyparticlesystem.jpg":"assets/img/crazyparticlesystem.jpg","./diffuse.jpg":"assets/img/diffuse.jpg","./cosmosonic.jpg":"assets/img/cosmosonic.jpg","./expressivetypography.jpg":"assets/img/expressivetypography.jpg","./drpepper.jpg":"assets/img/drpepper.jpg","./expressivetypography01.png":"assets/img/expressivetypography01.png","./expressivetypography02.png":"assets/img/expressivetypography02.png","./expressivetypography03.png":"assets/img/expressivetypography03.png","./fakelovernd01.png":"assets/img/fakelovernd01.png","./fakelovernd02.jpg":"assets/img/fakelovernd02.jpg","./fragthumbnail.jpg":"assets/img/fragthumbnail.jpg","./fuckdetector.jpg":"assets/img/fuckdetector.jpg","./g_cam_thumb.jpg":"assets/img/g_cam_thumb.jpg","./glitchnl.jpg":"assets/img/glitchnl.jpg","./hiddenfigures.jpg":"assets/img/hiddenfigures.jpg","./hoam.jpg":"assets/img/hoam.jpg","./itp-t-shirts-appl-2.jpg":"assets/img/itp-t-shirts-appl-2.jpg","./itp-t-shirts-appl-3.jpg":"assets/img/itp-t-shirts-appl-3.jpg","./itp-t-shirts-appl-5.jpg":"assets/img/itp-t-shirts-appl-5.jpg","./itp-t-shirts-appl-4.jpg":"assets/img/itp-t-shirts-appl-4.jpg","./itp-t-shirts-appl-6.jpg":"assets/img/itp-t-shirts-appl-6.jpg","./itp-t-shirts-appl-7.jpg":"assets/img/itp-t-shirts-appl-7.jpg","./itp-t-shirts-appl.png":"assets/img/itp-t-shirts-appl.png","./itplogo.jpg":"assets/img/itplogo.jpg","./jthtime.jpg":"assets/img/jthtime.jpg","./kiacadenza.jpg":"assets/img/kiacadenza.jpg","./logo.png":"assets/img/logo.png","./logo_dot_w.png":"assets/img/logo_dot_w.png","./noc_w04_thumb.jpg":"assets/img/noc_w04_thumb.jpg","./moreraytracing.jpg":"assets/img/moreraytracing.jpg","./nonagon.jpg":"assets/img/nonagon.jpg","./noise.jpg":"assets/img/noise.jpg","./ofs_mv.jpg":"assets/img/ofs_mv.jpg","./op3.jpg":"assets/img/op3.jpg","./opticalpiramid.jpg":"assets/img/opticalpiramid.jpg","./opticalpy2.jpg":"assets/img/opticalpy2.jpg","./optpym3.jpg":"assets/img/optpym3.jpg","./particleEQ_thumb.jpg":"assets/img/particleEQ_thumb.jpg","./profile.jpg":"assets/img/profile.jpg","./quickavsketch01.png":"assets/img/quickavsketch01.png","./rg_thumbnail.jpg":"assets/img/rg_thumbnail.jpg","./rainytypewriter.jpg":"assets/img/rainytypewriter.jpg","./slitscan.jpg":"assets/img/slitscan.jpg","./slitscan_01.jpg":"assets/img/slitscan_01.jpg","./slitscan_02.jpg":"assets/img/slitscan_02.jpg","./slitscan_03.jpg":"assets/img/slitscan_03.jpg","./slitscan_04.jpg":"assets/img/slitscan_04.jpg","./slitscan_05.jpg":"assets/img/slitscan_05.jpg","./slitscan_06.jpg":"assets/img/slitscan_06.jpg","./slitscan_07.png":"assets/img/slitscan_07.png","./slitscan_08.jpg":"assets/img/slitscan_08.jpg","./slitscan_09.jpg":"assets/img/slitscan_09.jpg","./slitscan_10.jpg":"assets/img/slitscan_10.jpg","./slitscan_11.jpg":"assets/img/slitscan_11.jpg","./slitscan_12.jpg":"assets/img/slitscan_12.jpg","./slitscan_13.jpg":"assets/img/slitscan_13.jpg","./slitscan_14.jpg":"assets/img/slitscan_14.jpg","./slitscan_15.jpg":"assets/img/slitscan_15.jpg","./slitscan_16.jpg":"assets/img/slitscan_16.jpg","./slitscan_17.jpg":"assets/img/slitscan_17.jpg","./thesis_thumb.jpg":"assets/img/thesis_thumb.jpg","./thumb_36.jpg":"assets/img/thumb_36.jpg","./threejsstudy01.jpg":"assets/img/threejsstudy01.jpg","./thumb_47.gif":"assets/img/thumb_47.gif","./thumb_45.jpg":"assets/img/thumb_45.jpg","./thumb_48.jpg":"assets/img/thumb_48.jpg","./thumb_49.gif":"assets/img/thumb_49.gif","./thumb_50.gif":"assets/img/thumb_50.gif","./thumb_52.gif":"assets/img/thumb_52.gif","./thumb_51.gif":"assets/img/thumb_51.gif","./thumb_53.gif":"assets/img/thumb_53.gif","./toneandthree.jpg":"assets/img/toneandthree.jpg","./ujnnova.jpg":"assets/img/ujnnova.jpg","./unpredictable.jpg":"assets/img/unpredictable.jpg","./upload1.jpg":"assets/img/upload1.jpg","./visexp.jpg":"assets/img/visexp.jpg","./web_thumbnail.jpg":"assets/img/web_thumbnail.jpg","./webgl_bad.gif":"assets/img/webgl_bad.gif","./webgl_fuz.jpg":"assets/img/webgl_fuz.jpg","./webgl_par.jpg":"assets/img/webgl_par.jpg","./webgl_peq.jpg":"assets/img/webgl_peq.jpg","./webgl_sku.jpg":"assets/img/webgl_sku.jpg","./wooven.jpg":"assets/img/wooven.jpg"}],"../node_modules/process/browser.js":[function(require,module,exports) {

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

var ___1 = __importDefault(require("./../assets/img/*.*"));

var expandContent = function expandContent(index, scrollToNode) {
  var _a; // Reset the dom


  var containers = document.getElementsByClassName("contentContainer");

  var _iterator = _createForOfIteratorHelper(containers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var container = _step.value;
      (_a = container === null || container === void 0 ? void 0 : container.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(container);
    } // Construct doms 

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var project = content_json_1.default.projects[index];
  var targetDom = document.getElementById(project.id);
  var contentContainer = document.createElement('div');
  contentContainer.className = "content contentContainer"; // Append to target

  utils_1.insertNext(contentContainer, targetDom); // Contruct content doms

  var targetDomWidth = parseFloat(getComputedStyle(selectedWorkNode, null).getPropertyValue('width')); // Content info

  var contentTitle = '';

  for (var i = 0; i < 3; i++) {
    // Title
    switch (i) {
      case 0:
        contentTitle = 'Info';
        break;

      case 1:
        contentTitle = 'Process';
        break;

      case 2:
        contentTitle = 'Credit';
        break;

      default:
        break;
    }

    var title = document.createElement('div');
    title.className = "contentTitle";
    title.innerHTML = "<h2>" + contentTitle + "</h2>";
    contentContainer.appendChild(title); // Description

    var description = document.createElement('div');
    description.className = "contentDescription";
    var infoDescription = null;
    var processDescription = null;

    switch (i) {
      case 0:
        var _iterator2 = _createForOfIteratorHelper(project.info),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var info = _step2.value;

            switch (info.is) {
              case 'video':
                infoDescription = buildDescriptionNode(targetDomWidth, info, utils_1.CONTENT_TYPE.VIDEO);
                break;

              case 'image':
                infoDescription = buildDescriptionNode(targetDomWidth, info, utils_1.CONTENT_TYPE.IMAGE);
                break;

              case 'text':
                infoDescription = buildDescriptionNode(targetDomWidth, info, utils_1.CONTENT_TYPE.TEXT);
                break;

              default:
                break;
            }

            if (infoDescription !== null) description.appendChild(infoDescription);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        break;

      case 1:
        var _iterator3 = _createForOfIteratorHelper(project.process),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var process = _step3.value;

            switch (process.is) {
              case 'video':
                processDescription = buildDescriptionNode(targetDomWidth, process, utils_1.CONTENT_TYPE.VIDEO);
                break;

              case 'image':
                processDescription = buildDescriptionNode(targetDomWidth, process, utils_1.CONTENT_TYPE.IMAGE);
                break;

              case 'text':
                processDescription = buildDescriptionNode(targetDomWidth, process, utils_1.CONTENT_TYPE.TEXT);
                break;

              default:
                break;
            }

            if (processDescription !== null) description.appendChild(processDescription);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        break;

      case 2:
        var _iterator4 = _createForOfIteratorHelper(project.credit),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var credit = _step4.value;
            var creditNode = buildCreditNode(credit);
            if (creditNode !== null) description.appendChild(creditNode);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        break;

      default:
        break;
    }

    if (description !== null) contentContainer.appendChild(description);
  }

  scrollToNode.scrollIntoView({
    behavior: 'smooth'
  });
};

var buildCreditNode = function buildCreditNode(info) {
  var paragraph = document.createElement('p');
  paragraph.innerHTML = '<credit>' + info.role + '</credit>: ' + info.credit;
  return paragraph;
};

var buildDescriptionNode = function buildDescriptionNode(width, info, contentType) {
  var domElement = null;

  switch (contentType) {
    case utils_1.CONTENT_TYPE.VIDEO:
      domElement = document.createElement('div');
      domElement.className = "listThumbnailImageContainer";
      domElement.innerHTML = utils_1.buildVimeoEmbedCode(info.url, true);
      break;

    case utils_1.CONTENT_TYPE.IMAGE:
      domElement = document.createElement('img');
      domElement.src = utils_1.getImageAssetURL(___1.default, info.url);
      domElement.width = width;
      break;

    case utils_1.CONTENT_TYPE.TEXT:
      domElement = document.createElement('p');
      domElement.innerHTML = info.p;
      break;

    default:
      break;
  }

  return domElement;
};

var buildContentNode = function buildContentNode(width, url, name, contentType) {
  var content = document.createElement('div');

  if (contentType === utils_1.CONTENT_TYPE.IMAGE) {
    // Image content
    content.innerHTML = '<img src=\"avseoul/assets/' + utils_1.getImageAssetURL(___1.default, url) + '\" width=\"' + width + '\" height="auto">';
  } else {
    // Video and realtime content
    content.style.cursor = 'pointer';
    content.style.opacity = '1';
    content.innerHTML = utils_1.buildVimeoEmbedCode(url, true);
  }

  return content;
};

var buildContentContainerNode = function buildContentContainerNode(contentData, nodeIndex) {
  var container = document.createElement('div');
  var thumbnailMask = document.createElement('div');
  var thumbnail = null; // = new HTMLElement();// = new Image() as HTMLImageElement;

  var descriptionMask = document.createElement('div');
  var subject = document.createElement('div');
  var description = document.createElement('div');
  var date = document.createElement('div');
  var detail = document.createElement('rainbow_p'); // Node tree

  container.appendChild(thumbnailMask);
  container.appendChild(descriptionMask);
  descriptionMask.appendChild(subject);
  descriptionMask.appendChild(description);
  descriptionMask.appendChild(date);
  descriptionMask.appendChild(detail); // Nodes attributes

  container.className = 'listContainer';
  container.id = contentData.id;
  container.setAttribute('name', contentData.title);
  var targetDomWidth = parseFloat(getComputedStyle(selectedWorkNode, null).getPropertyValue('width'));

  switch (contentData.content.is) {
    case 'video':
      thumbnail = buildContentNode(targetDomWidth, contentData.content.url, contentData.title, utils_1.CONTENT_TYPE.VIDEO);
      break;

    case 'image':
      thumbnail = buildContentNode(targetDomWidth, contentData.content.url, contentData.title, utils_1.CONTENT_TYPE.IMAGE);
      break;

    case 'realtime':
      thumbnail = buildContentNode(targetDomWidth, contentData.content.url, contentData.title, utils_1.CONTENT_TYPE.REALTIME);
      break;

    default:
      break;
  }

  if (thumbnail !== null) {
    thumbnailMask.appendChild(thumbnail);
    thumbnail.className = 'listThumbnailImage';
  }

  thumbnailMask.className = 'listThumbnailImageContainer';
  descriptionMask.className = 'listDescriptionContainer';
  subject.className = 'listSubject';
  subject.onclick = expandContent.bind(this, nodeIndex, thumbnailMask);
  subject.style.cursor = 'pointer';
  subject.innerHTML = '<div><h2>' + contentData.title + '</h2></div>';
  description.className = 'listDescription';
  description.innerHTML = '<p>' + contentData.description + '</p>';
  date.className = 'listDate';
  date.innerHTML = '<p>' + contentData.date + '</p>';
  detail.className = 'listDetail';
  detail.onclick = expandContent.bind(this, nodeIndex, thumbnailMask);
  detail.innerHTML = '<a>Details</a>';
  return container;
};

var init = function init() {
  webglNode = document.getElementById('webgl');
  aboutNode = document.getElementById('about');
  selectedWorkNode = document.getElementById('selectedWorks');
  caseStudyNode = document.getElementById('caseStudies');
  titleNode = document.getElementById('title');
  var selectedWorksContainer = document.getElementById('selectedWorks');
  var caseStudiesContainer = document.getElementById('caseStudies');

  for (var i = 0; i < content_json_1.default['projects'].length; i++) {
    var s = content_json_1.default['projects'][i];
    var scriptNode = buildContentContainerNode(s, i);
    if (s.category.includes("case_study")) caseStudiesContainer.append(scriptNode);else if (s.category.includes("selected_works")) selectedWorksContainer.append(scriptNode);
  } // Add all webgl work nodes to focusTargetnodes for raycasting


  fillRaycastingNode(aboutNode);
  fillRaycastingNode(webglNode); // TODO: make dynamic

  webglIFrameURLNodes.GLITCH_SKULL.node = document.getElementById('iframe_GLITCH_SKULL');
  webglIFrameURLNodes.FUZZY_BLOB.node = document.getElementById('iframe_FUZZY_BLOB');
  webglIFrameURLNodes.BAD_SIGNALS.node = document.getElementById('iframe_BAD_SIGNALS');
  webglIFrameURLNodes.particleEqualizer.node = document.getElementById('iframe_particleEqualizer');
  onScroll();
};

document.addEventListener('DOMContentLoaded', init, false);
var raycastTargetNodes = [];
var aboutNode;
var webglNode;
var selectedWorkNode;
var caseStudyNode;
var titleNode;
var webglIFrameURLNodes = {
  GLITCH_SKULL: {
    node: null,
    url: "https://avseoul.net/GLITCH_SKULL/"
  },
  FUZZY_BLOB: {
    node: null,
    url: "https://avseoul.net/FUZZY_BLOB/"
  },
  BAD_SIGNALS: {
    node: null,
    url: "https://avseoul.net/BAD_SIGNALS/"
  },
  particleEqualizer: {
    node: null,
    url: "https://avseoul.net/particleEqualizer/"
  }
};

var toggleWebGLDemo = function toggleWebGLDemo(name, enabled) {
  if (webglIFrameURLNodes[name].node.src !== webglIFrameURLNodes[name].url && enabled) {
    webglIFrameURLNodes[name].node.src = webglIFrameURLNodes[name].url;
  } else if (webglIFrameURLNodes[name].node.src !== "" && !enabled) {
    webglIFrameURLNodes[name].node.src = "";
  }
};

var fillRaycastingNode = function fillRaycastingNode(sourceNode) {
  var _a;

  var _iterator5 = _createForOfIteratorHelper(sourceNode.childNodes),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var childNode = _step5.value;

      if ((_a = childNode.className) === null || _a === void 0 ? void 0 : _a.includes('listContainer')) {
        raycastTargetNodes.push(childNode);
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
};

var handleRaycasting = function handleRaycasting(max) {
  var _iterator6 = _createForOfIteratorHelper(raycastTargetNodes),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var raycastNode = _step6.value;
      var nodeBound = raycastNode.getBoundingClientRect();
      var nodePosition = nodeBound.top + window.pageYOffset;
      var name = raycastNode.getAttribute('name'); // Is visible in viewport?

      if (nodePosition < max && nodePosition > window.scrollY - nodeBound.height) {
        toggleWebGLDemo(name, true);
      } else {
        toggleWebGLDemo(name, false);
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
};

var onScroll = function onScroll() {
  var raycastPosition = window.scrollY + .5 * window.innerHeight;
  handleRaycasting(raycastPosition);

  if (raycastPosition > webglNode.offsetTop) {
    titleNode.innerHTML = "WebGL Demos";
  } else {
    titleNode.innerHTML = "About";
  }

  if (raycastPosition > selectedWorkNode.offsetTop) {
    titleNode.innerHTML = "Selected Works";
  }

  if (raycastPosition > caseStudyNode.offsetTop) {
    titleNode.innerHTML = "Case Studies";
  }
};

window.addEventListener('scroll', onScroll, false);
},{"/json/content.json":"json/content.json","/js/utils":"js/utils.ts","./../assets/img/*.*":"assets/img/*.*","process":"../node_modules/process/browser.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59624" + '/');

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