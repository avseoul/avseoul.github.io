//
//  Mover.cpp
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/6/15.
//
//

#include "Mover.h"

Mover::Mover(int _index){
    GLLineIndex = _index;
    indexCount = 0;
    buildBSpline();
    randSinCount = randInt(0, 100);
    
    mSpriteImage = new SpriteImage(0);
}

void Mover::update(Vec3f _loc){
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

void Mover::buildBSpline()
{
    /* set points for BSpline */
    curve.push_back( Vec3f(10, -65, 27) );
    curve.push_back( Vec3f(19, -711, 225) );
    curve.push_back( Vec3f(147, -994, 195) );
    curve.push_back( Vec3f(699, -975, 6) );
    curve.push_back( Vec3f(813, -731, -178) );
    curve.push_back( Vec3f(430, -566, -225) );
    curve.push_back( Vec3f(67, -299, -132) );
    curve.push_back( Vec3f(-25, 218, 6) );
    curve.push_back( Vec3f(-387, 515, 107) );
    curve.push_back( Vec3f(-813, 668, 92) );
    curve.push_back( Vec3f(-689, 994, -55) );
    curve.push_back( Vec3f(-106, 968, -222) );
    curve.push_back( Vec3f(-17, 575, -186) );
    
    /* construct the spline */
    BSpline3f mSpline( curve, 3, true, true );
    
    /* Create high resolution list of points in path */
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

void Mover::getSplineShape(Vec3f _loc){
    Vec3f mLoc = _loc;
    mSplineShape.push_back(mLoc);
}

void Mover::calUpdateLocs(float _sinCount){
    int num = mSplineShape.size();
    float sinCount = _sinCount;
    
    if(indexCount >= num){
        indexCount = 0;
    }
    
    float dist = (float)sqrt( pow(mSplineShape[indexCount].x, 2) + pow(mSplineShape[indexCount].z, 2));
    
    //float newLocX = dist * cos(sinCount * pi*0.01/num);
    float newLocX = dist * cos(sinCount);
    //float newLocX = dist * cos(randSinCount);
    float newLocY = mSplineShape[indexCount].y;
    //float newLocZ = dist * sin(sinCount * pi*0.01/num);
    float newLocZ = dist * sin(sinCount);
    //float newLocZ = dist * sin(randSinCount);
    
    Vec3f norm = mPerlin.dfBm( Vec3f( newLocX, newLocZ, indexCount ) * 2 / 200 ) * 20.0f;
    Vec3f newLoc = Vec3f(newLocX + norm.x, newLocY + norm.y, newLocZ + norm.z);
    
    update(newLoc);
    addLocToArray(newLoc);
    
    indexCount++;
    //    randSinCount += 0.1;
}

void Mover::addLocToArray(Vec3f _loc){
    Vec3f mLoc = _loc;
    mLocs.push_back(mLoc);
}

void Mover::drawMover(){
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

void Mover::drawGLLine(){
    int num = mLocs.size();
    
    gl::enableAlphaBlending();
    glBegin(GL_LINE_STRIP);
    for(int i = 1; i < num; i++){
        gl::color(ColorAf(0, 0, 0, 0.2));
        gl::vertex(mLocs[i]);
    }
    glEnd();
    gl::disableAlphaBlending();
}

void Mover::drawRandomPoint(Vec3f _mRight, Vec3f _mUp){
    mSpriteImage->render(_mRight, _mUp);
}






