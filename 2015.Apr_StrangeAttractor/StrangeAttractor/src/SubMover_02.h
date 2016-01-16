//
//  SubMover_02.h
//  StrangeAttractor
//
//  Created by av's macbook pro on 3/7/15.
//
//

#pragma once

#include <stdio.h>
#include "cinder/BSpline.h"
#include "cinder/Perlin.h"
#include "cinder/Rand.h"
#include "cinder/gl/gl.h"

#include "SpriteImage.h"

using namespace::std;
using namespace::ci;
using namespace::cinder;

class SubMover02{
public:
    SubMover02(int _index);
    
    void                update(Vec3f _loc);
    void                buildBSpline();
    void                addLocToArray(Vec3f _loc);
    void                getSplineShape(Vec3f _loc);
    void                calUpdateLocs(float _sinCount);
    void                drawMover();
    void                drawGLLine();
    void                drawRandomPoint(Vec3f _mRight, Vec3f _mUp);
    
    int                 indexCount;
    int                 GLLineIndex;
    
    Vec3f               loc;
    vector<Vec3f>       curve;
    vector<Vec3f>       mSplineShape;
    vector<Vec3f>       mLocs;
    
    Perlin              mPerlin;
    
    SpriteImage         *mSpriteImage;
};

