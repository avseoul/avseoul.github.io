#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"
#include "cinder/BSpline.h"
#include "cinder/Path2d.h"
#include "cinder/MayaCamUI.h"
#include "cinder/Rand.h"
#include "Mover.h"
#include "SubMover_01.h"
#include "SubMover_02.h"
#include <math.h>
#include <vector>
#include "cinder/gl/TileRender.h"
#include "cinder/Utilities.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class StrangeAttractorApp : public AppNative {
public:
    void                prepareSettings( Settings *settings);
    void                setup();
    void                update();
    void                draw();
    void                mouseDown( MouseEvent event );
    void                mouseDrag( MouseEvent event );
    
    float               rotateY;
    float               translateZ;
    int                 count;
    
    /* camera */
    CameraPersp         mSceneCam;
    MayaCamUI           mMayaCam;
    
    /* strange attractor objects */
    vector<Mover*>      mMovers;
    vector<SubMover*>   mSubMovers;
    vector<SubMover02*> mSubMover02s;
    
    float               sinCountForMover;
    float               sinCountForSubMover;
    float               sinCountForSubMover02;
    int                 GLLineIndex;
    
    //save frames
    int                 mCurrentFrame;
};

void StrangeAttractorApp::prepareSettings( Settings *settings)
{
    settings->setWindowSize(1920,  1080);
    settings->setFullScreen( true );
    settings->setTitle( "CINDER" );
    settings->setFrameRate(60);
}

void StrangeAttractorApp::setup()
{
    /* setting for Cemera Matrix */
    mSceneCam.setPerspective(45.0f, getWindowAspectRatio(), 0.1, 10000);
    Vec3f mEye        = Vec3f( 0, 0, 3000 );
    Vec3f mCenter     = Vec3f(Vec3f(0, 0, 0));
    Vec3f mUp         = Vec3f::yAxis();
    mSceneCam.lookAt( mEye, mCenter, mUp );
    mSceneCam.setCenterOfInterestPoint(Vec3f(0, 0, 0));
    mMayaCam.setCurrentCam(mSceneCam);
    
    /* initialize variables */
    sinCountForSubMover             = 0;
    sinCountForMover                = 0;
    sinCountForSubMover02           = 0;
    count                           = 1;
    GLLineIndex                     = 0;
    
    /* add one object for each of my strange attractor class */
    mMovers.push_back(new Mover(GLLineIndex));
    mSubMovers.push_back(new SubMover(GLLineIndex));
    mSubMover02s.push_back(new SubMover02(GLLineIndex));
}

void StrangeAttractorApp::mouseDown( MouseEvent event )
{
    mMayaCam.mouseDown( event.getPos());
}

void StrangeAttractorApp::mouseDrag( MouseEvent event )
{
    mMayaCam.mouseDrag( event.getPos(), event.isLeftDown(), event.isMiddleDown(), event.isRightDown() );
}

void StrangeAttractorApp::update()
{
    int mArraySize = mMovers.size();
    int randNum = randInt(2, 5);
    
    /* add more objects (the maximum number is 120) */
    if(count%randNum == 0){
        if(mArraySize < 120){
            GLLineIndex++;
            mMovers.push_back(new Mover(GLLineIndex));
            mSubMovers.push_back(new SubMover(GLLineIndex));
            mSubMover02s.push_back(new SubMover02(GLLineIndex));
        }
    }
    
    /* update my objects */
    for(int i = 0; i < mArraySize; i++){
        mMovers[i]->calUpdateLocs(sinCountForMover);
        mSubMovers[i]->calUpdateLocs(sinCountForSubMover);
        mSubMover02s[i]->calUpdateLocs(sinCountForSubMover);
    }
    
    sinCountForSubMover     += 0.005;
    sinCountForSubMover02   += 0.01;
    sinCountForMover        += 0.025;
    
    count++;
}

void StrangeAttractorApp::draw()
{
    /* set my camera viewport */
    gl::setMatrices(mMayaCam.getCamera());
    
    //    gl::clear( Color( 0.0f, 0.0f, 0.0f ) );
    gl::clear( Color( 0.9f, 0.9f, 0.9f ) );
    
    /* draw my objects and make camera animation */
    gl::pushMatrices();
    {
        gl::translate(0, 0, translateZ);
        gl::pushMatrices();
        {
            gl::rotate(Vec3f(0, rotateY, 0));
            ci::Vec3f mRight, mUp;
            mMayaCam.getCamera().getBillboardVectors(&mRight, &mUp);
            
            int mArraySize = mMovers.size();
            for(int i = 0; i < mArraySize; i++){
                mMovers[i]->drawGLLine();
                mMovers[i]->drawMover();
                mMovers[i]->drawRandomPoint(mRight, mUp);
                mSubMovers[i]->drawGLLine();
                mSubMovers[i]->drawMover();
                mSubMovers[i]->drawRandomPoint(mRight, mUp);
                mSubMover02s[i]->drawGLLine();
                mSubMover02s[i]->drawMover();
                mSubMover02s[i]->drawRandomPoint(mRight, mUp);
            }
        }
        gl::popMatrices();
    }
    gl::popMatrices();
    
    rotateY -= 0.6;
    translateZ -= 1.2;
    //    writeImage( getHomeDirectory() / "CinderScreengrabs" / ( "StrangeAttractor_" + toString( mCurrentFrame ) + ".png" ), copyWindowSurface() );
    //    mCurrentFrame++;
}

CINDER_APP_NATIVE( StrangeAttractorApp, RendererGl )


