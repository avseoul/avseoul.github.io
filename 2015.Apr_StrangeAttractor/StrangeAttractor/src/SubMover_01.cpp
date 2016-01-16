//
//  SubMover_01.cpp
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/7/15.
//
//

#include "SubMover_01.h"

SubMover::SubMover(int _index){
    GLLineIndex = _index;
    indexCount = 0;
    buildBSpline();
    
    mSpriteImage = new SpriteImage(1);
}

void SubMover::update(Vec3f _loc){
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

void SubMover::buildBSpline()
{
    curve.push_back( Vec3f(-263, -6, 0) );
    curve.push_back( Vec3f(-352, 466, 0) );
    curve.push_back( Vec3f(-749, 235, 0) );
    curve.push_back( Vec3f(54, -37, 0) );
    curve.push_back( Vec3f(-695, -356, 0) );
    curve.push_back( Vec3f(-329, -534, 0) );
    
    // construct the spline
    BSpline3f mSpline( curve, 3, true, true );
    
    // Create high resolution list of points in path
    float resolution = 1000.0f;
    
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

void SubMover::getSplineShape(Vec3f _loc){
    Vec3f mLoc = _loc;
    mSplineShape.push_back(mLoc);
}

void SubMover::calUpdateLocs(float _sinCount){
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
    
    Vec3f norm = mPerlin.dfBm( Vec3f( newLocX, newLocZ, indexCount ) * 1 / 200 ) * 40.0f;
    
    Vec3f newLoc = Vec3f(newLocX + norm.x, newLocY + norm.y, newLocZ + norm.z);
    
    update(newLoc);
    addLocToArray(newLoc);
    
    indexCount++;
}

void SubMover::addLocToArray(Vec3f _loc){
    Vec3f mLoc = _loc;
    mLocs.push_back(mLoc);
}

void SubMover::drawMover(){
    gl::enableAlphaBlending();
    glBegin(GL_POINTS);
    {
        glPointSize( 10 );
        gl::color(ColorAf(1, 1, 1, 1));
        gl::vertex(loc);
    }
    glEnd();
    gl::disableAlphaBlending();
}

void SubMover::drawRandomPoint(Vec3f _mRight, Vec3f _mUp){
    mSpriteImage->render(_mRight, _mUp);
}

void SubMover::drawGLLine(){
    int num = mLocs.size();
    
    gl::enableAlphaBlending();
    glBegin(GL_LINE_STRIP);
    for(int i = 1; i < num; i++){
        gl::color(ColorAf(0.5, 0, 0, 0.2));
        gl::vertex(mLocs[i]);
    }
    glEnd();

    gl::disableAlphaBlending();
}
