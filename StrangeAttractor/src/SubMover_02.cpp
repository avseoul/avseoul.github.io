//
//  SubMover_02.cpp
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/7/15.
//
//

#include "SubMover_02.h"

SubMover02::SubMover02(int _index){
    GLLineIndex = _index;
    indexCount = 0;
    buildBSpline();
    
    mSpriteImage = new SpriteImage(2);
}

void SubMover02::update(Vec3f _loc){
    loc         = _loc;
    
    
    //push the random point
    int randomCount = randInt(2000);
    if(randomCount == 0){
        mSpriteImage->addLoc(loc);
    }
    
    int num = mLocs.size();
    for (int i = 0; i < num; i ++){
        Vec3f norm = mPerlin.dfBm( Vec3f( mLocs[i].x, mLocs[i].z, i ) * 1 / 2000 ) * 1.0f;
        //        Vec3f norm = Vec3f(sin(i), cos(i), 0);
        mLocs[i] += norm;
    }
}

void SubMover02::buildBSpline()
{
    curve.push_back( Vec3f(2930, -604, -285) );
    curve.push_back( Vec3f(48, 1157, -1952) );
    curve.push_back( Vec3f(-2930, 604, 285) );
    curve.push_back( Vec3f(-48, -1157, 1952) );
    
    // construct the spline
    BSpline3f mSpline( curve, 3, true, true );
    
    // Create high resolution list of points in path
    float resolution = 3000.0f;
    
    float delta = 1.0f / resolution;
    
    if(GLLineIndex%2 == 0){
        for (float theta = 0.0f; theta < 1.0f; theta += delta){
            getSplineShape(mSpline.getPosition(theta));
        }
    } else if(GLLineIndex%2 == 1){
        for (float theta = 0.999991f; theta >= 0.0f; theta -= delta){
            getSplineShape(mSpline.getPosition(theta));
        }
    }
}

void SubMover02::getSplineShape(Vec3f _loc){
    Vec3f mLoc = _loc;
    mSplineShape.push_back(mLoc);
}

void SubMover02::calUpdateLocs(float _sinCount){
    int num = mSplineShape.size();
    float sinCount = _sinCount;
    
    if(indexCount >= num){
        indexCount = 0;
    }
    
    float dist = (float)sqrt( pow(mSplineShape[indexCount].x, 2) + pow(mSplineShape[indexCount].z, 2));
    
    //float newLocX = dist * cos(sinCount * pi*0.01/num);
    float newLocX = dist * cos(sinCount);
    float newLocY = mSplineShape[indexCount].y;
    //float newLocZ = dist * sin(sinCount * pi*0.01/num);
    float newLocZ = dist * sin(sinCount);
    
    Vec3f norm = mPerlin.dfBm( Vec3f( newLocX, newLocZ, indexCount ) * 1 / 200 ) * 10.0f;
    
    Vec3f newLoc = Vec3f(newLocX + norm.x, newLocY + norm.y, newLocZ + norm.z);
    
    update(newLoc);
    addLocToArray(newLoc);
    
    indexCount++;
}

void SubMover02::addLocToArray(Vec3f _loc){
    Vec3f mLoc = _loc;
    mLocs.push_back(mLoc);
}

void SubMover02::drawMover(){
    gl::enableAlphaBlending();
    glBegin(GL_POINTS);
    {
        glPointSize( 10 );
        gl::color(ColorAf(0, 0, 0, 1));
        gl::vertex(loc);
    }
    glEnd();
    gl::disableAlphaBlending();
}

void SubMover02::drawRandomPoint(Vec3f _mRight, Vec3f _mUp){
    mSpriteImage->render(_mRight, _mUp);
}

void SubMover02::drawGLLine(){
    int num = mLocs.size();
    
    gl::enableAlphaBlending();
    glBegin(GL_LINE_STRIP);
    for(int i = 1; i < num; i++){
        gl::color(ColorAf(0, 0, 0, 0.1));
        gl::vertex(mLocs[i]);
    }
    glEnd();
    gl::disableAlphaBlending();
}
