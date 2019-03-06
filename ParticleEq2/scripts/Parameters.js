class Parameters 
{
    constructor()
    {
        this.ctrl = new dat.GUI();

        this.ctrlCss = this.ctrl.domElement.parentNode.style;
        this.ctrlCss['z-index'] = 9999;
        
        this.ctrlParams = {

            // debug
            ShowStats: true,
            ShowDebug: true,
            DebugThumbnailSize: 50,

            // particle
            ParticleDensity: 32,
            SphereResolution: 16,

            // force
            AudioGain: 7000,
            GlobalGravity: .057,
            LocalGravity: .29,
            OrbitAcc: .77,
            RandomAcc: 7.,
            
            RandomScalePop: 0.6,
            
            KeepInSphere: false,
            SphereRadius: 18,
            
            ScaleDamping: .93,
            
            TimeDelta: .010,
            MaxVel: 6.,

            ParticleScaleFactor: 1.,
            Ambient: .1,
            Diffuse: .33,
            Fill: 0., 
            Back: .39, 
            Fresnel: .3,
            Gamma: 4.2,
            isBW: true
        }

        // setup
        {
            this.ctrl.add(this.ctrlParams, 'AudioGain', 0, 10000).onChange(

                (val) => {
                    
                    audioAnalyzer.set_gain(val);
                }
            );

            let ctrlDebug = this.ctrl.addFolder('Debug');
            {
                ctrlDebug.add(this.ctrlParams, 'ShowStats').onFinishChange(

                    (val) => {

                        stats.dom.style.display = val ? 'block' : 'none'
                    }
                );

                ctrlDebug.add(this.ctrlParams, 'ShowDebug').onFinishChange(

                    (val) => this.ctrlParams.ShowDebug = val
                );

                ctrlDebug.add(this.ctrlParams, 'DebugThumbnailSize', 50, 200);
            }

            let ctrlGlobal = this.ctrl.addFolder('Particle Global');
            {
                ctrlGlobal.add(this.ctrlParams, 'ParticleDensity', [16, 32, 64, 128, 256, 512, 1024]).onChange(

                    (val) => {

                        SetBufferSize(val);
                        Reset();
                    }
                );

                ctrlGlobal.add(this.ctrlParams, 'SphereResolution', [4, 8, 16, 24, 32]).onChange(

                    (val) => {

                        particleRender.particleSystem._buildUnitSphere(val);
                        Reset();
                    }
                );

                ctrlGlobal.add(this.ctrlParams, 'ParticleScaleFactor', .1, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.particleScaleFactor = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );
            }

            let ctrlForce = this.ctrl.addFolder('Particle Forces');
            {
                ctrlForce.add(this.ctrlParams, 'GlobalGravity', 0, .5).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.globalGravity = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'LocalGravity', 0, 1).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.localGravity = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'OrbitAcc', 0, 1).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.orbitAcc = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'RandomAcc', 0, 10).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.randomAcc = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'RandomScalePop', 0., 10.).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.randomScalePop = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'KeepInSphere').onFinishChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.keepInSphere = val ? 1 : 0;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'SphereRadius', 0., 64.).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.sphereRadius = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'ScaleDamping', .9, 1.).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.scaleDamping = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'TimeDelta', 0., .1).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.timeDelta = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );

                ctrlForce.add(this.ctrlParams, 'MaxVel', 0., 50).onChange(

                    (val) => {
                        
                        particleRender.particleBehaviours.maxVel = val;
                        particleRender.particleBehaviours.updateCtrlParams();
                    }
                );
            }

            let ctrlLighting = this.ctrl.addFolder('Particle Shading and Lighting');
            {
                ctrlLighting.add(this.ctrlParams, 'Ambient', .0, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.ambient = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'Diffuse', 0, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.diffuse = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'Fill', 0, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.fill = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'Back', 0, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.back = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'Fresnel', 0, 2).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.fresnel = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'Gamma', .45, 4.22).onChange(

                    (val) => {
                        
                        particleRender.particleSystem.gamma = val;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );

                ctrlLighting.add(this.ctrlParams, 'isBW').onFinishChange(

                    (val) => {
                        
                        particleRender.particleSystem.isBW = val ? 1 : 0;
                        particleRender.particleSystem.updateCtrlParams();
                    }
                );
            }
        } 
    }

    toggleVisible = function()
    {
        const isVisible = this.ctrlCss.display === "block";

        this.ctrlCss.display = isVisible ? "none" : "block";
    }
}